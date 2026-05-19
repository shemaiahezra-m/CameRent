#!/usr/bin/env python3
"""Simple one-shot script to migrate data/users.json -> data/app.db (SQLite).

Run this from project root: `python3 scripts/migrate_users_to_sqlite.py`
"""
import json
import os
import sqlite3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
USERS_JSON = os.path.join(DATA_DIR, "users.json")
DB_PATH = os.path.join(DATA_DIR, "app.db")


def migrate():
    os.makedirs(DATA_DIR, exist_ok=True)

    users = []
    if os.path.exists(USERS_JSON):
        with open(USERS_JSON, "r", encoding="utf-8") as f:
            try:
                users = json.load(f)
            except Exception as e:
                print("Failed to read users.json:", e)
                return
    else:
        print("No users.json found at", USERS_JSON)

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
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
    """)

    # Insert or replace users
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
    print(f"Migrated {len(users)} users to SQLite DB at {DB_PATH}")


if __name__ == "__main__":
    migrate()
