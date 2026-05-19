#!/usr/bin/env python3
"""Migrate data/orders.json into SQLite orders table at data/app.db"""
import os
import json
import sqlite3
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
DATA = BASE / 'data'
DB = DATA / 'app.db'
ORDERS = DATA / 'orders.json'

os.makedirs(DATA, exist_ok=True)

orders = []
if ORDERS.exists():
    try:
        orders = json.loads(ORDERS.read_text(encoding='utf-8'))
    except Exception as e:
        print('Failed to load orders.json:', e)

conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute('''
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    userId INTEGER,
    items TEXT,
    total REAL,
    status TEXT,
    createdAt INTEGER
)
''')

count = 0
for o in orders:
    cur.execute('INSERT OR REPLACE INTO orders (id, userId, items, total, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)', (
        o.get('id'),
        o.get('userId'),
        json.dumps(o.get('items') or []),
        o.get('total'),
        o.get('status'),
        o.get('createdAt')
    ))
    count += 1

conn.commit()
conn.close()
print(f'Migrated {count} orders to {DB}')
