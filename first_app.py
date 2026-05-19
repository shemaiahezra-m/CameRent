# A simple web application.
import json
import os
import sqlite3
import functools
from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")


def _db_path():
    return os.path.join(DATA_DIR, "app.db")


def _db_table_columns(table):
    db = _db_path()
    if not os.path.exists(db):
        return set()
    try:
        conn = sqlite3.connect(db)
        cur = conn.cursor()
        cur.execute(f"PRAGMA table_info({table})")
        cols = {r[1] for r in cur.fetchall()}
        conn.close()
        return cols
    except Exception:
        return set()


def _ensure_users_table():
    db = _db_path()
    if not os.path.exists(os.path.dirname(db)):
        os.makedirs(os.path.dirname(db), exist_ok=True)
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            passwordHash TEXT,
            isAdmin INTEGER DEFAULT 0
            , resetToken TEXT,
            resetExpiry INTEGER
        )
        """
    )
    conn.commit()
    conn.close()


def migrate_users_to_sqlite():
    """Migrate users from data/users.json into an SQLite database at data/app.db.
    This is safe to call multiple times (uses INSERT OR REPLACE).
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    users_path = _users_path()
    db_path = _db_path()

    users = []
    if os.path.exists(users_path):
        try:
            with open(users_path, "r", encoding="utf-8") as f:
                users = json.load(f)
        except Exception:
            users = []

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            passwordHash TEXT
        )
        """
    )

    for u in users:
        cur.execute(
            "INSERT OR REPLACE INTO users (id, firstName, lastName, email, phone, passwordHash) VALUES (?, ?, ?, ?, ?, ?)",
            (
                u.get("id"),
                u.get("firstName"),
                u.get("lastName"),
                u.get("email"),
                u.get("phone"),
                u.get("passwordHash"),
            ),
        )

    conn.commit()
    conn.close()
    return len(users)

app = Flask(__name__, template_folder='.', static_folder='.', static_url_path='')
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret")

# Simple admin password (set ADMIN_PASSWORD env var in production)
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin')


def require_admin_json(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        # require admin session
        if not session.get('is_admin'):
            return jsonify({'ok': False, 'message': 'unauthorized'}), 401

        # For non-GET requests, require CSRF header
        if request.method != 'GET':
            token = session.get('csrf_token')
            hdr = request.headers.get('X-CSRF-Token') or request.form.get('csrf')
            if not token or not hdr or hdr != token:
                return jsonify({'ok': False, 'message': 'invalid csrf'}), 403

        return fn(*args, **kwargs)
    return wrapper


def require_admin_page(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get('is_admin'):
            return redirect(url_for('admin_login', next=request.path))
        return fn(*args, **kwargs)
    return wrapper


def _users_path():
    return os.path.join(DATA_DIR, "users.json")

def _orders_path():
    return os.path.join(DATA_DIR, "orders.json")


def _ensure_orders_table():
    db = _db_path()
    if not os.path.exists(os.path.dirname(db)):
        os.makedirs(os.path.dirname(db), exist_ok=True)
    conn = sqlite3.connect(db)
    cur = conn.cursor()
    # Create table with additional fields for booking details; if table exists,
    # we'll ensure missing columns are added later.
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY,
            userId INTEGER,
            items TEXT,
            total REAL,
            status TEXT,
            createdAt INTEGER,
            start_date INTEGER,
            end_date INTEGER,
            payment_method TEXT,
            shipping_method TEXT,
            security_deposit_status TEXT
        )
        """
    )

    # Ensure columns exist (SQLite cannot DROP or ALTER types easily, but can ADD COLUMN)
    cur.execute("PRAGMA table_info(orders)")
    existing_cols = {r[1] for r in cur.fetchall()}
    extras = {
        'start_date': 'ALTER TABLE orders ADD COLUMN start_date INTEGER',
        'end_date': 'ALTER TABLE orders ADD COLUMN end_date INTEGER',
        'payment_method': "ALTER TABLE orders ADD COLUMN payment_method TEXT",
        'shipping_method': "ALTER TABLE orders ADD COLUMN shipping_method TEXT",
        'security_deposit_status': "ALTER TABLE orders ADD COLUMN security_deposit_status TEXT",
    }
    for col, stmt in extras.items():
        if col not in existing_cols:
            try:
                cur.execute(stmt)
            except Exception:
                pass
    conn.commit()
    conn.close()


def _ensure_schema():
    """Ensure all application tables exist and upgrade users table where possible."""
    db = _db_path()
    os.makedirs(os.path.dirname(db), exist_ok=True)
    conn = sqlite3.connect(db)
    cur = conn.cursor()

    # Ensure users table exists (keep existing columns, add extras if missing)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            firstName TEXT,
            lastName TEXT,
            email TEXT UNIQUE,
            phone TEXT,
            passwordHash TEXT,
            isAdmin INTEGER DEFAULT 0,
            resetToken TEXT,
            resetExpiry INTEGER
        )
        """
    )

    # Add optional columns to users (full_name, phone_number, address, id_verification_url, role)
    cur.execute("PRAGMA table_info(users)")
    existing = {r[1] for r in cur.fetchall()}
    alters = []
    if 'full_name' not in existing:
        alters.append("ALTER TABLE users ADD COLUMN full_name TEXT")
    if 'phone_number' not in existing:
        alters.append("ALTER TABLE users ADD COLUMN phone_number TEXT")
    if 'address' not in existing:
        alters.append("ALTER TABLE users ADD COLUMN address TEXT")
    if 'id_verification_url' not in existing:
        alters.append("ALTER TABLE users ADD COLUMN id_verification_url TEXT")
    if 'role' not in existing:
        alters.append("ALTER TABLE users ADD COLUMN role TEXT")
    for a in alters:
        try:
            cur.execute(a)
        except Exception:
            pass

    # Categories
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS categories (
            category_id INTEGER PRIMARY KEY,
            category_name TEXT UNIQUE
        )
        """
    )

    # Products (catalog)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS products (
            product_id INTEGER PRIMARY KEY,
            category_id INTEGER,
            model_name TEXT,
            brand TEXT,
            specs TEXT,
            daily_rate REAL,
            hourly_rate REAL,
            security_deposit_amount REAL,
            status TEXT,
            image_urls TEXT,
            FOREIGN KEY(category_id) REFERENCES categories(category_id)
        )
        """
    )

    # Bookings
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            start_date INTEGER,
            end_date INTEGER,
            total_price REAL,
            security_deposit_status TEXT,
            shipping_method TEXT,
            booking_status TEXT,
            createdAt INTEGER
        )
        """
    )

    # Booking items
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS booking_items (
            booking_item_id INTEGER PRIMARY KEY,
            booking_id INTEGER,
            product_id INTEGER,
            quantity INTEGER,
            FOREIGN KEY(booking_id) REFERENCES bookings(booking_id),
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )
        """
    )

    # Payments
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS payments (
            payment_id INTEGER PRIMARY KEY,
            booking_id INTEGER,
            payment_method TEXT,
            transaction_reference_no TEXT,
            proof_of_payment_url TEXT,
            amount_paid REAL,
            payment_date INTEGER,
            FOREIGN KEY(booking_id) REFERENCES bookings(booking_id)
        )
        """
    )

    # Inspections
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS inspections (
            inspection_id INTEGER PRIMARY KEY,
            booking_id INTEGER,
            type TEXT,
            condition_notes TEXT,
            photos_at_handover TEXT,
            inspected_at INTEGER,
            FOREIGN KEY(booking_id) REFERENCES bookings(booking_id)
        )
        """
    )

    # Reviews
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS reviews (
            review_id INTEGER PRIMARY KEY,
            product_id INTEGER,
            user_id INTEGER,
            rating INTEGER,
            comment TEXT,
            createdAt INTEGER,
            FOREIGN KEY(product_id) REFERENCES products(product_id),
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
        """
    )

    # Availability calendar for blocked dates
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS availability_calendar (
            id INTEGER PRIMARY KEY,
            product_id INTEGER,
            blocked_from INTEGER,
            blocked_to INTEGER,
            reason TEXT,
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )
        """
    )

    # Equipment inventory (track each physical unit)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS equipment_inventory (
            unit_id INTEGER PRIMARY KEY,
            product_id INTEGER,
            serial_number TEXT UNIQUE,
            date_purchased INTEGER,
            unit_condition TEXT,
            current_location TEXT,
            notes TEXT,
            FOREIGN KEY(product_id) REFERENCES products(product_id)
        )
        """
    )

    # Verification requests for user identity checks
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS verification_requests (
            request_id INTEGER PRIMARY KEY,
            user_id INTEGER,
            id_type TEXT,
            id_photo_front_url TEXT,
            id_photo_back_url TEXT,
            selfie_with_id_url TEXT,
            verification_status TEXT,
            admin_notes TEXT,
            requested_at INTEGER,
            reviewed_at INTEGER,
            reviewer_id INTEGER,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(reviewer_id) REFERENCES users(id)
        )
        """
    )

    # Deposit ledger for tracking security deposits (liabilities)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS deposit_ledger (
            ledger_id INTEGER PRIMARY KEY,
            booking_id INTEGER,
            deposit_amount REAL,
            status TEXT,
            deduction_reason TEXT,
            refund_reference_no TEXT,
            recorded_at INTEGER,
            FOREIGN KEY(booking_id) REFERENCES bookings(booking_id)
        )
        """
    )

    conn.commit()
    conn.close()


def load_orders():
    """Load orders from SQLite if available, otherwise from data/orders.json."""
    db = _db_path()
    if os.path.exists(db):
        try:
            conn = sqlite3.connect(db)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            _ensure_orders_table()
            cur.execute("SELECT id, userId, items, total, status, createdAt, start_date, end_date, payment_method, shipping_method, security_deposit_status FROM orders ORDER BY id DESC")
            rows = cur.fetchall()
            orders = []
            for r in rows:
                # items stored as JSON text
                try:
                    items = json.loads(r['items']) if r['items'] else []
                except Exception:
                    items = []
                orders.append({
                    'id': r['id'],
                    'userId': r['userId'],
                    'items': items,
                    'total': float(r['total']) if r['total'] is not None else None,
                    'status': r['status'],
                    'createdAt': int(r['createdAt']) if r['createdAt'] is not None else None,
                    'start_date': int(r['start_date']) if ('start_date' in r.keys() and r['start_date'] is not None) else None,
                    'end_date': int(r['end_date']) if ('end_date' in r.keys() and r['end_date'] is not None) else None,
                    'payment_method': r['payment_method'] if 'payment_method' in r.keys() else None,
                    'shipping_method': r['shipping_method'] if 'shipping_method' in r.keys() else None,
                    'security_deposit_status': r['security_deposit_status'] if 'security_deposit_status' in r.keys() else None,
                })
            conn.close()
            return orders
        except Exception:
            pass

    # fallback to JSON file
    try:
        with open(_orders_path(), 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []


def save_orders(orders):
    """Save orders to JSON and upsert into SQLite if available."""
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(_orders_path(), 'w', encoding='utf-8') as f:
        json.dump(orders, f, ensure_ascii=False, indent=2)

    db = _db_path()
    if os.path.exists(db):
        try:
            _ensure_orders_table()
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            for o in orders:
                try:
                    cur.execute(
                        "INSERT OR REPLACE INTO orders (id, userId, items, total, status, createdAt, start_date, end_date, payment_method, shipping_method, security_deposit_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        (
                            o.get('id'),
                            o.get('userId'),
                            json.dumps(o.get('items') or []),
                            o.get('total'),
                            o.get('status'),
                            o.get('createdAt'),
                            o.get('start_date'),
                            o.get('end_date'),
                            o.get('payment_method'),
                            o.get('shipping_method'),
                            o.get('security_deposit_status')
                        ),
                    )
                except Exception as e:
                    # log the specific row error for debugging
                    try:
                        with open(os.path.join(DATA_DIR, 'save_orders_errors.log'), 'a', encoding='utf-8') as ef:
                            ef.write(f"Failed to upsert order {o.get('id')}: {repr(e)}\n")
                    except Exception:
                        pass
            conn.commit()
            conn.close()
        except Exception as e:
            try:
                with open(os.path.join(DATA_DIR, 'save_orders_errors.log'), 'a', encoding='utf-8') as ef:
                    ef.write(f"save_orders top-level error: {repr(e)}\n")
            except Exception:
                pass


def _next_order_id():
    db = _db_path()
    if os.path.exists(db):
        try:
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            cur.execute('SELECT MAX(id) FROM orders')
            row = cur.fetchone()
            conn.close()
            if row and row[0]:
                return int(row[0]) + 1
        except Exception:
            pass

    orders = load_orders()
    return (max([o.get('id', 0) for o in orders]) + 1) if orders else 1
def load_users():
    """Load users from SQLite if available, otherwise from data/users.json."""
    # Prefer SQLite if present
    db = _db_path()
    if os.path.exists(db):
        try:
            conn = sqlite3.connect(db)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            _ensure_users_table()
            # select common + optional columns
            cols = _db_table_columns('users')
            select_cols = [
                'id',
                'firstName',
                'lastName',
                'full_name',
                'email',
                'phone',
                'phone_number',
                'address',
                'id_verification_url',
                'passwordHash',
                'isAdmin',
                'resetToken',
                'resetExpiry',
                'role'
            ]
            use_cols = [c for c in select_cols if c in cols]
            if not use_cols:
                use_cols = ['id','firstName','lastName','email','phone','passwordHash']
            cur.execute("SELECT " + ",".join(use_cols) + " FROM users ORDER BY id ASC")
            rows = cur.fetchall()
            users = []
            for r in rows:
                u = {'id': r['id']}
                # fill known fields if present
                for k in ('firstName','lastName','full_name','email','phone','phone_number','address','id_verification_url','passwordHash','role'):
                    if k in r.keys():
                        u[k] = r[k]
                # booleans and tokens
                u['isAdmin'] = bool(r['isAdmin']) if 'isAdmin' in r.keys() else False
                u['resetToken'] = r['resetToken'] if 'resetToken' in r.keys() else None
                u['resetExpiry'] = int(r['resetExpiry']) if ('resetExpiry' in r.keys() and r['resetExpiry'] is not None) else None
                # compatibility: if full_name present but firstName/lastName missing, try split
                if 'full_name' in u and ('firstName' not in u or 'lastName' not in u):
                    parts = (u.get('full_name') or '').split(None, 1)
                    u['firstName'] = u.get('firstName') or (parts[0] if parts else '')
                    u['lastName'] = u.get('lastName') or (parts[1] if len(parts) > 1 else '')
                users.append(u)
            conn.close()
            return users
        except Exception:
            # fallback to JSON on error
            pass

    # Fallback to JSON file
    try:
        with open(_users_path(), "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_users(users):
    """Save users to JSON and upsert into SQLite if available."""
    os.makedirs(DATA_DIR, exist_ok=True)
    # Save JSON copy
    with open(_users_path(), "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2)

    # Also persist into SQLite if present
    db = _db_path()
    if os.path.exists(db):
        try:
            _ensure_users_table()
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            # determine which columns exist in users table
            cols = _db_table_columns('users')
            for u in users:
                # ensure compatibility fields
                u.setdefault('full_name', (u.get('firstName','') + ' ' + u.get('lastName','')).strip())
                u.setdefault('phone_number', u.get('phone'))
                # prepare insert/update using available columns
                available = []
                vals = []
                for key in ('id','firstName','lastName','full_name','email','phone','phone_number','address','id_verification_url','passwordHash','isAdmin','resetToken','resetExpiry','role'):
                    if key in cols:
                        available.append(key)
                        if key == 'isAdmin':
                            vals.append(1 if u.get('isAdmin') else 0)
                        else:
                            vals.append(u.get(key))
                if not available:
                    continue
                placeholders = ','.join(['?'] * len(available))
                sql = f"INSERT OR REPLACE INTO users ({','.join(available)}) VALUES ({placeholders})"
                try:
                    cur.execute(sql, tuple(vals))
                except Exception:
                    # best effort: ignore DB errors
                    pass
            conn.commit()
            conn.close()
        except Exception:
            # ignore DB errors, JSON is the source of truth
            pass


def _next_user_id():
    """Compute next user id using SQLite if present, otherwise from JSON."""
    db = _db_path()
    if os.path.exists(db):
        try:
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            cur.execute("SELECT MAX(id) FROM users")
            row = cur.fetchone()
            conn.close()
            if row and row[0]:
                return int(row[0]) + 1
        except Exception:
            pass

    users = load_users()
    return (max([u.get('id', 0) for u in users]) + 1) if users else 1


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/profile")
def profile():
    return render_template("profile.html")


@app.route("/hello/<name>")
def greet(name="Stranger"):
    return render_template("greeting.html", name=name)


@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json(silent=True) or {}
    required = ["firstName", "lastName", "email", "phone", "password"]
    if not all(data.get(k) for k in required):
        return jsonify({"error": "Missing required fields"}), 400

    email = data["email"].strip().lower()
    users = load_users()
    if any(u.get("email") == email for u in users):
        return jsonify({"error": "Email already registered"}), 400

    if len(data["password"]) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    user = {
        "id": _next_user_id(),
        "firstName": data["firstName"].strip(),
        "lastName": data["lastName"].strip(),
        "email": email,
        "phone": data["phone"].strip(),
        "passwordHash": generate_password_hash(data["password"]),
    }
    # populate compatible new fields
    user['full_name'] = (user.get('firstName','') + ' ' + user.get('lastName','')).strip()
    user['phone_number'] = user.get('phone')
    user['role'] = 'Customer'
    users.append(user)
    save_users(users)

    session["user"] = {k: user[k] for k in ("id", "firstName", "lastName", "email", "phone")}
    return jsonify({"user": session["user"]}), 201


@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    users = load_users()
    user = next((u for u in users if u.get("email") == email), None)
    if not user or not check_password_hash(user.get("passwordHash", ""), password):
        return jsonify({"error": "Invalid email or password"}), 401

    # build session user payload (include new fields)
    session_user = {
        'id': user.get('id'),
        'firstName': user.get('firstName'),
        'lastName': user.get('lastName'),
        'full_name': user.get('full_name') or ((user.get('firstName','') + ' ' + user.get('lastName','')).strip()),
        'email': user.get('email'),
        'phone': user.get('phone') or user.get('phone_number')
    }
    session["user"] = session_user
    return jsonify({"user": session["user"]})


@app.route("/api/logout", methods=["POST"])
def api_logout():
    session.pop("user", None)
    return jsonify({"ok": True})


@app.route("/api/me")
def api_me():
    user = session.get("user")
    if not user:
        return jsonify({"user": None}), 401
    return jsonify({"user": user})


# Inventory management
def load_inventory():
    """Load inventory from JSON file."""
    inventory_path = os.path.join(DATA_DIR, 'inventory.json')
    if not os.path.exists(inventory_path):
        # Initialize with default inventory
        default_inventory = [
            { 'id': 1, 'name': 'iPhone 16 Pro Max (256GB)', 'category': 'Smartphone', 'serial': 'IPH16PM-001', 'price': 1499, 'status': 'available', 'stock': 5 },
            { 'id': 2, 'name': 'iPhone 14 Pro (128GB)', 'category': 'Smartphone', 'serial': 'IPH14P-002', 'price': 899, 'status': 'available', 'stock': 8 },
            { 'id': 3, 'name': 'iPhone 13 Pro Max (128GB Sierra Blue)', 'category': 'Smartphone', 'serial': 'IPH13PM-003', 'price': 699, 'status': 'available', 'stock': 12 },
            { 'id': 4, 'name': 'Galaxy S23 Ultra', 'category': 'Smartphone', 'serial': 'SAMS23U-004', 'price': 1499, 'status': 'available', 'stock': 6 },
            { 'id': 5, 'name': 'Galaxy Z Flip 5', 'category': 'Smartphone', 'serial': 'SAMZF5-005', 'price': 1289, 'status': 'available', 'stock': 4 },
            { 'id': 6, 'name': 'Canon G7X Mark III', 'category': 'Compact', 'serial': 'CNG7X3-006', 'price': 499, 'status': 'available', 'stock': 15 },
            { 'id': 7, 'name': 'Sony ZV-1', 'category': 'Compact', 'serial': 'SNZV1-007', 'price': 599, 'status': 'available', 'stock': 10 },
            { 'id': 8, 'name': 'Fujifilm X100VI', 'category': 'Compact', 'serial': 'FJX100VI-008', 'price': 699, 'status': 'available', 'stock': 7 },
            { 'id': 9, 'name': 'Canon EOS R5', 'category': 'Mirrorless', 'serial': 'CNEOSR5-009', 'price': 1999, 'status': 'available', 'stock': 3 },
            { 'id': 10, 'name': 'Sony A7 IV', 'category': 'Mirrorless', 'serial': 'SNA74-010', 'price': 1899, 'status': 'available', 'stock': 4 },
            { 'id': 11, 'name': 'Nikon Z9', 'category': 'Mirrorless', 'serial': 'NKZ9-011', 'price': 2299, 'status': 'available', 'stock': 2 },
            { 'id': 12, 'name': 'GoPro Hero 13 Black', 'category': 'Action Camera', 'serial': 'GPH13B-012', 'price': 399, 'status': 'available', 'stock': 20 },
            { 'id': 13, 'name': 'DJI Osmo Action 5 Pro', 'category': 'Action Camera', 'serial': 'DJIOA5P-013', 'price': 449, 'status': 'available', 'stock': 15 },
            { 'id': 14, 'name': 'Insta360 Ace Pro', 'category': 'Action Camera', 'serial': 'IN360AP-014', 'price': 399, 'status': 'available', 'stock': 18 },
            { 'id': 15, 'name': 'Insta360 X5 (Bullet Time Bundle)', 'category': 'Action Camera', 'serial': 'IN360X5-015', 'price': 499, 'status': 'available', 'stock': 12 },
            { 'id': 16, 'name': 'DJI Mini 4 Pro', 'category': 'Drone', 'serial': 'DJIM4P-016', 'price': 1199, 'status': 'available', 'stock': 5 },
            { 'id': 17, 'name': 'Fujifilm Instax Square SQ1', 'category': 'Instant/Film', 'serial': 'FJISQ1-017', 'price': 299, 'status': 'available', 'stock': 25 },
            { 'id': 18, 'name': 'Ray-Ban Meta (Wayfarer)', 'category': 'Other', 'serial': 'RBMETA-018', 'price': 399, 'status': 'available', 'stock': 10 }
        ]
        save_inventory(default_inventory)
        return default_inventory
    
    try:
        with open(inventory_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []

def save_inventory(inventory):
    """Save inventory to JSON file."""
    os.makedirs(DATA_DIR, exist_ok=True)
    inventory_path = os.path.join(DATA_DIR, 'inventory.json')
    with open(inventory_path, 'w', encoding='utf-8') as f:
        json.dump(inventory, f, ensure_ascii=False, indent=2)

def find_inventory_item_by_name(name):
    """Find inventory item by product name (case-insensitive, fuzzy match)."""
    inventory = load_inventory()
    name_lower = name.lower().strip()
    
    # Try exact match first
    for item in inventory:
        if item['name'].lower() == name_lower:
            return item
    
    # Try partial match
    for item in inventory:
        if name_lower in item['name'].lower() or item['name'].lower() in name_lower:
            return item
    
    return None

@app.route('/api/inventory', methods=['GET'])
def api_inventory_get():
    """Get all inventory items."""
    try:
        inventory = load_inventory()
        return jsonify({'inventory': inventory, 'count': len(inventory)})
    except Exception as e:
        return jsonify({'inventory': [], 'error': str(e)}), 500

@app.route('/api/inventory/<int:item_id>', methods=['PUT'])
def api_inventory_update(item_id):
    """Update inventory item (stock, status, etc.)."""
    data = request.get_json(silent=True) or {}
    
    try:
        inventory = load_inventory()
        item = next((i for i in inventory if i['id'] == item_id), None)
        
        if not item:
            return jsonify({'ok': False, 'message': 'Item not found'}), 404
        
        # Update allowed fields
        if 'stock' in data:
            item['stock'] = int(data['stock'])
        if 'status' in data:
            item['status'] = data['status']
        if 'name' in data:
            item['name'] = data['name']
        if 'category' in data:
            item['category'] = data['category']
        if 'serial' in data:
            item['serial'] = data['serial']
        if 'price' in data:
            item['price'] = float(data['price'])
        
        save_inventory(inventory)
        return jsonify({'ok': True, 'item': item})
    except Exception as e:
        return jsonify({'ok': False, 'message': str(e)}), 500

@app.route('/api/orders', methods=['GET', 'POST'])
def api_orders():
    if request.method == 'GET':
        try:
            orders = load_orders()
            return jsonify({'orders': orders})
        except Exception as e:
            return jsonify({'orders': [], 'error': str(e)}), 500

    # POST: create order
    # Accept JSON or form-encoded submissions (some clients post form data)
    payload = None
    try:
        payload = request.get_json(silent=True)
    except Exception:
        payload = None

    if not payload and request.form:
        payload = {}
        for k, v in request.form.items():
            try:
                payload[k] = json.loads(v)
            except Exception:
                payload[k] = v

    if not payload:
        try:
            with open(os.path.join(DATA_DIR, 'save_orders_errors.log'), 'a', encoding='utf-8') as ef:
                ef.write(f"invalid order payload from {request.remote_addr}: headers={dict(request.headers)}\n")
        except Exception:
            pass
        return jsonify({'error': 'invalid payload'}), 400

    # basic validation
    items = payload.get('items')
    total = payload.get('total')
    if not isinstance(items, list) or total is None:
        return jsonify({'error': 'Missing items or total'}), 400

    import time
    user = session.get('user')
    start_date = payload.get('start_date')
    end_date = payload.get('end_date')
    payment_method = payload.get('payment_method')
    shipping_method = payload.get('shipping_method')
    security_deposit_status = payload.get('security_deposit_status')

    order = {
        'id': _next_order_id(),
        'userId': user.get('id') if user else None,
        'items': items,
        'total': float(total),
        'status': payload.get('status') or 'new',
        'createdAt': int(time.time()),
        'start_date': int(start_date) if start_date and str(start_date).isdigit() else start_date,
        'end_date': int(end_date) if end_date and str(end_date).isdigit() else end_date,
        'payment_method': payment_method,
        'shipping_method': shipping_method,
        'security_deposit_status': security_deposit_status
    }

    # Deduct stock from inventory for each item in the order
    try:
        inventory = load_inventory()
        inventory_updated = False
        
        for order_item in items:
            item_name = order_item.get('name', '')
            quantity = order_item.get('quantity', 1)
            
            # Find matching inventory item by index
            inv_item_index = None
            for idx, inv_item in enumerate(inventory):
                if (inv_item['name'].lower() == item_name.lower() or
                    item_name.lower() in inv_item['name'].lower() or
                    inv_item['name'].lower() in item_name.lower()):
                    inv_item_index = idx
                    break
            
            if inv_item_index is not None:
                inv_item = inventory[inv_item_index]
                if inv_item['stock'] >= quantity:
                    inventory[inv_item_index]['stock'] -= quantity
                    inventory_updated = True
                    
                    # Log stock deduction
                    try:
                        with open(os.path.join(DATA_DIR, 'stock_changes.log'), 'a', encoding='utf-8') as log:
                            log.write(json.dumps({
                                'time': time.time(),
                                'order_id': order['id'],
                                'item': item_name,
                                'quantity': quantity,
                                'old_stock': inv_item['stock'] + quantity,
                                'new_stock': inventory[inv_item_index]['stock']
                            }) + '\n')
                    except Exception:
                        pass
        
        if inventory_updated:
            save_inventory(inventory)
            print(f"✅ Inventory updated for order {order['id']}")
    except Exception as e:
        # Log error but don't fail the order
        print(f"❌ Failed to update inventory for order {order['id']}: {repr(e)}")
        try:
            with open(os.path.join(DATA_DIR, 'inventory_errors.log'), 'a', encoding='utf-8') as ef:
                ef.write(f"Failed to update inventory for order {order['id']}: {repr(e)}\n")
        except Exception:
            pass

    orders = load_orders()
    orders.insert(0, order)
    save_orders(orders)

    # write a lightweight received log for debugging
    try:
        with open(os.path.join(DATA_DIR, 'received_orders.log'), 'a', encoding='utf-8') as rf:
            rf.write(json.dumps({'time': time.time(), 'remote': request.remote_addr, 'orderId': order['id']}) + '\n')
    except Exception:
        pass

    return jsonify({'ok': True, 'order': order}), 201


@app.route('/admin/data-sources')
@require_admin_page
def admin_data_sources():
    users_exists = os.path.exists(_users_path())
    sqlite_exists = os.path.exists(_db_path())
    return render_template('admin.html', hasUsersJson=users_exists, hasSqlite=sqlite_exists)


@app.route('/admin/data-sources.json')
def admin_data_sources_json():
    return jsonify({
        'hasUsersJson': os.path.exists(_users_path()),
        'usersJsonPath': _users_path(),
        'hasSqlite': os.path.exists(_db_path()),
        'sqlitePath': _db_path(),
    })


@app.route('/admin/migrate-users', methods=['POST'])
def admin_migrate_users():
    try:
        count = migrate_users_to_sqlite()
        return jsonify({'ok': True, 'migrated': count, 'message': f'Migrated {count} users to SQLite.'})
    except Exception as e:
        return jsonify({'ok': False, 'message': str(e)}), 500


@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    # Render login page on GET
    if request.method == 'GET':
        # generate csrf token for login form if not present
        if 'csrf_token' not in session:
            import secrets
            session['csrf_token'] = secrets.token_hex(16)
        return render_template('admin_login.html', csrf_token=session.get('csrf_token'))

    # POST: accept JSON or form submit
    data = request.get_json(silent=True) or request.form or {}
    email = (data.get('email') or '').strip().lower()
    pwd = (data.get('password') or '').strip()
    next_url = request.args.get('next') or request.form.get('next') or url_for('admin_users_page')

    # If there are admin users in DB, authenticate against them
    admins = [u for u in load_users() if u.get('isAdmin')]
    if admins:
        if not email:
            if request.is_json:
                return jsonify({'ok': False, 'message': 'missing email'}), 400
            return render_template('admin_login.html', error='Missing email', csrf_token=session.get('csrf_token'))

        user = next((u for u in load_users() if u.get('email') == email and u.get('isAdmin')), None)
        if user and check_password_hash(user.get('passwordHash', ''), pwd):
            session['is_admin'] = True
            # generate csrf token
            import secrets
            session['csrf_token'] = secrets.token_hex(16)
            if request.is_json:
                return jsonify({'ok': True, 'next': next_url})
            return redirect(next_url)
        else:
            if request.is_json:
                return jsonify({'ok': False, 'message': 'invalid credentials'}), 401
            return render_template('admin_login.html', error='Invalid credentials', csrf_token=session.get('csrf_token')), 401

    # No admin users exist — fallback to environment ADMIN_PASSWORD for bootstrap
    if pwd == ADMIN_PASSWORD:
        session['is_admin'] = True
        import secrets
        session['csrf_token'] = secrets.token_hex(16)
        if request.is_json:
            return jsonify({'ok': True, 'next': next_url})
        return redirect(next_url)

    if request.is_json:
        return jsonify({'ok': False, 'message': 'invalid password'}), 401
    return render_template('admin_login.html', error='Invalid password', csrf_token=session.get('csrf_token')), 401


@app.route('/admin/logout')
def admin_logout():
    session.pop('is_admin', None)
    return redirect(url_for('index'))


@app.route('/admin/users')
@require_admin_page
def admin_users_page():
    # consolidated admin dashboard
    return render_template('admin_dashboard.html')


@app.route('/admin/users.json')
def admin_users_json():
    try:
        users = load_users()
        # include csrf token for client
        token = session.get('csrf_token')
        return jsonify({'users': users, 'csrf': token})
    except Exception as e:
        return jsonify({'users': [], 'error': str(e)}), 500


@app.route('/admin/users/delete', methods=['POST'])
def admin_users_delete():
    data = request.get_json(silent=True) or {}
    user_id = data.get('id')
    if user_id is None:
        return jsonify({'ok': False, 'message': 'Missing id'}), 400

    try:
        uid = int(user_id)
    except Exception:
        return jsonify({'ok': False, 'message': 'Invalid id'}), 400

    # Delete from SQLite if present
    db = _db_path()
    try:
        if os.path.exists(db):
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            cur.execute('DELETE FROM users WHERE id = ?', (uid,))
            conn.commit()
            conn.close()

        # Also update JSON copy
        users = load_users()
        users = [u for u in users if int(u.get('id', 0)) != uid]
        save_users(users)

        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'message': str(e)}), 500


@app.route('/admin/users/request-reset', methods=['POST'])
@require_admin_json
def admin_request_reset():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    if not email:
        return jsonify({'ok': False, 'message': 'missing email'}), 400

    users = load_users()
    user = next((u for u in users if u.get('email') == email), None)
    if not user:
        return jsonify({'ok': False, 'message': 'not found'}), 404

    # generate token and expiry (3600s)
    import secrets, time
    token = secrets.token_urlsafe(24)
    expiry = int(time.time()) + 3600
    user['resetToken'] = token
    user['resetExpiry'] = expiry
    save_users(users)

    # In production you would email the token; here we return it for admin UI
    return jsonify({'ok': True, 'token': token, 'expiry': expiry})


@app.route('/admin/users/reset', methods=['POST'])
def admin_perform_reset():
    data = request.get_json(silent=True) or {}
    token = data.get('token')
    newpw = data.get('password')
    if not token or not newpw:
        return jsonify({'ok': False, 'message': 'missing token or password'}), 400

    users = load_users()
    import time
    user = next((u for u in users if u.get('resetToken') == token and u.get('resetExpiry') and int(u.get('resetExpiry')) >= int(time.time())), None)
    if not user:
        return jsonify({'ok': False, 'message': 'invalid or expired token'}), 400

    user['passwordHash'] = generate_password_hash(newpw)
    user['resetToken'] = None
    user['resetExpiry'] = None
    save_users(users)
    return jsonify({'ok': True})


@app.route('/admin/users/create', methods=['POST'])
@require_admin_json
def admin_users_create():
    data = request.get_json(silent=True) or {}
    required = ['firstName', 'lastName', 'email', 'password']
    if not all(data.get(k) for k in required):
        return jsonify({'ok': False, 'message': 'missing fields'}), 400

    email = data['email'].strip().lower()
    users = load_users()
    if any(u.get('email') == email for u in users):
        return jsonify({'ok': False, 'message': 'email exists'}), 400

    user = {
        'id': _next_user_id(),
        'firstName': data['firstName'].strip(),
        'lastName': data['lastName'].strip(),
        'email': email,
        'phone': (data.get('phone') or '').strip(),
        'passwordHash': generate_password_hash(data['password']),
        'isAdmin': bool(data.get('isAdmin')),
        'resetToken': None,
        'resetExpiry': None
    }
    # populate compatibility fields
    user['full_name'] = (user.get('firstName','') + ' ' + user.get('lastName','')).strip()
    user['phone_number'] = user.get('phone')
    user['role'] = 'Admin' if user.get('isAdmin') else 'Customer'

    users.append(user)
    save_users(users)

    # return user without passwordHash
    safe = {k: user[k] for k in ('id', 'firstName', 'lastName', 'email', 'phone')}
    return jsonify({'ok': True, 'user': safe})


@app.route('/admin/users/edit', methods=['POST'])
@require_admin_json
def admin_users_edit():
    data = request.get_json(silent=True) or {}
    uid = data.get('id')
    if uid is None:
        return jsonify({'ok': False, 'message': 'missing id'}), 400
    try:
        uid = int(uid)
    except Exception:
        return jsonify({'ok': False, 'message': 'invalid id'}), 400

    users = load_users()
    user = next((u for u in users if int(u.get('id', 0)) == uid), None)
    if not user:
        return jsonify({'ok': False, 'message': 'not found'}), 404

    # update fields
    for k in ('firstName', 'lastName', 'email', 'phone'):
        if k in data and data[k] is not None:
            if k == 'email':
                user[k] = data[k].strip().lower()
            else:
                user[k] = data[k].strip()

    # keep compatibility fields in sync
    user['full_name'] = (user.get('firstName','') + ' ' + user.get('lastName','')).strip()
    user['phone_number'] = user.get('phone')

    if data.get('password'):
        user['passwordHash'] = generate_password_hash(data['password'])
    # update admin flag if provided
    if 'isAdmin' in data:
        user['isAdmin'] = bool(data.get('isAdmin'))

    save_users(users)
    safe = {k: user[k] for k in ('id', 'firstName', 'lastName', 'email', 'phone')}
    return jsonify({'ok': True, 'user': safe})


@app.route('/admin/orders')
@require_admin_page
def admin_orders_page():
    # consolidated admin dashboard
    return render_template('admin_dashboard.html')


@app.route('/admin/dashboard')
@require_admin_page
def admin_dashboard_page():
    return render_template('admin_dashboard.html')


@app.route('/admin/orders.json')
@require_admin_json
def admin_orders_json():
    try:
        orders = load_orders()
        token = session.get('csrf_token')
        # include safe user info for admin UI (no password hashes)
        users = load_users()
        safe_users = []
        for u in users:
            try:
                safe_users.append({
                    'id': int(u.get('id')),
                    'firstName': u.get('firstName'),
                    'lastName': u.get('lastName'),
                    'full_name': u.get('full_name') or ((u.get('firstName') or '') + ' ' + (u.get('lastName') or '')).strip(),
                    'email': u.get('email'),
                    'phone': u.get('phone') or u.get('phone_number'),
                    'address': u.get('address'),
                    'role': u.get('role')
                })
            except Exception:
                pass
        return jsonify({'orders': orders, 'csrf': token, 'users': safe_users})
    except Exception as e:
        return jsonify({'orders': [], 'error': str(e)}), 500


@app.route('/admin/orders/update', methods=['POST'])
@require_admin_json
def admin_orders_update():
    data = request.get_json(silent=True) or {}
    oid = data.get('id')
    status = data.get('status')
    if oid is None or not status:
        return jsonify({'ok': False, 'message': 'missing id or status'}), 400
    try:
        oid = int(oid)
    except Exception:
        return jsonify({'ok': False, 'message': 'invalid id'}), 400

    orders = load_orders()
    order = next((o for o in orders if int(o.get('id', 0)) == oid), None)
    if not order:
        return jsonify({'ok': False, 'message': 'not found'}), 404

    # simple allowed transitions
    allowed = ['new', 'processing', 'paid', 'shipped', 'cancelled']
    if status not in allowed:
        return jsonify({'ok': False, 'message': 'invalid status'}), 400

    order['status'] = status
    save_orders(orders)
    return jsonify({'ok': True, 'order': order})


@app.route('/admin/orders/delete', methods=['POST'])
@require_admin_json
def admin_orders_delete():
    data = request.get_json(silent=True) or {}
    oid = data.get('id')
    if oid is None:
        return jsonify({'ok': False, 'message': 'Missing id'}), 400
    try:
        oid = int(oid)
    except Exception:
        return jsonify({'ok': False, 'message': 'Invalid id'}), 400

    try:
        # remove from SQLite if present
        db = _db_path()
        if os.path.exists(db):
            conn = sqlite3.connect(db)
            cur = conn.cursor()
            cur.execute('DELETE FROM orders WHERE id = ?', (oid,))
            conn.commit()
            conn.close()

        orders = load_orders()
        orders = [o for o in orders if int(o.get('id', 0)) != oid]
        save_orders(orders)
        return jsonify({'ok': True})
    except Exception as e:
        return jsonify({'ok': False, 'message': str(e)}), 500


@app.route('/webhook/order-paid', methods=['POST'])
def webhook_order_paid():
    # Simple webhook to mark an order as paid. Requires WEBHOOK_TOKEN env var.
    token = request.headers.get('X-Webhook-Token')
    secret = os.environ.get('WEBHOOK_TOKEN')
    if not secret or token != secret:
        return jsonify({'ok': False, 'message': 'unauthorized'}), 401

    data = request.get_json(silent=True) or {}
    oid = data.get('orderId') or data.get('id')
    if oid is None:
        return jsonify({'ok': False, 'message': 'missing order id'}), 400
    try:
        oid = int(oid)
    except Exception:
        return jsonify({'ok': False, 'message': 'invalid id'}), 400

    orders = load_orders()
    order = next((o for o in orders if int(o.get('id', 0)) == oid), None)
    if not order:
        return jsonify({'ok': False, 'message': 'not found'}), 404

    order['status'] = 'paid'
    save_orders(orders)
    return jsonify({'ok': True, 'order': order})

@app.route("/order", methods=("GET", "POST"))
def order():
    if request.method == "POST":
        drink = request.form["drink"]
        print("Drink: ", drink)
        return render_template("print.html", drink=drink)

    return render_template("forms.html")


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5001)
