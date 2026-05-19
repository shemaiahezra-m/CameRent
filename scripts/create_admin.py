#!/usr/bin/env python3
"""Create an admin user in data/app.db (and users.json).

Usage:
  python3 scripts/create_admin.py --email admin@example.com --password secret --first Admin --last User
"""
import argparse
import os
import json
import sqlite3
from werkzeug.security import generate_password_hash

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
USERS_JSON = os.path.join(DATA_DIR, 'users.json')
DB_PATH = os.path.join(DATA_DIR, 'app.db')


def ensure_table():
    os.makedirs(DATA_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        passwordHash TEXT,
        isAdmin INTEGER DEFAULT 0
    )
    ''')
    conn.commit()
    conn.close()


def load_json():
    try:
        with open(USERS_JSON, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return []


def save_json(users):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(USERS_JSON, 'w', encoding='utf-8') as f:
        json.dump(users, f, ensure_ascii=False, indent=2)


if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('--email', required=True)
    p.add_argument('--password', required=True)
    p.add_argument('--first', default='Admin')
    p.add_argument('--last', default='User')
    p.add_argument('--phone', default='')
    args = p.parse_args()

    email = args.email.strip().lower()
    pwd = args.password

    ensure_table()

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # find existing id
    cur.execute('SELECT id FROM users WHERE email = ?', (email,))
    row = cur.fetchone()
    if row:
        uid = row[0]
        cur.execute('UPDATE users SET firstName=?, lastName=?, phone=?, passwordHash=?, isAdmin=1 WHERE id=?', (
            args.first, args.last, args.phone, generate_password_hash(pwd), uid
        ))
        print('Updated existing user as admin:', email)
    else:
        # compute next id
        cur.execute('SELECT MAX(id) FROM users')
        r = cur.fetchone()
        next_id = (r[0] or 0) + 1
        cur.execute('INSERT INTO users (id, firstName, lastName, email, phone, passwordHash, isAdmin) VALUES (?, ?, ?, ?, ?, ?, 1)', (
            next_id, args.first, args.last, email, args.phone, generate_password_hash(pwd)
        ))
        print('Created admin user:', email)

    conn.commit()
    conn.close()

    # sync JSON
    users = load_json()
    users = [u for u in users if u.get('email') != email]
    users.append({
        'id': next_id,
        'firstName': args.first,
        'lastName': args.last,
        'email': email,
        'phone': args.phone,
        'passwordHash': generate_password_hash(pwd),
        'isAdmin': True
    })
    save_json(users)
    print('Synchronized users.json')
