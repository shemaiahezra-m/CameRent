#!/usr/bin/env python3
"""Run the application's schema initializer."""
from pathlib import Path
import sys

BASE = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE))

import first_app

if __name__ == '__main__':
    first_app._ensure_schema()
    print('Schema ensured in', first_app._db_path())
