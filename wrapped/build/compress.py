#!/usr/bin/env python3
"""Precompress the served text assets (app/ + data/) as sibling .gz files so hosts that honor
precompressed assets skip gzip at request time (GitHub Pages' CDN gzips on its own; the .gz
files are for hosts that don't). Deterministic output (mtime 0) so rebuilds don't churn git.

Run:  python3 wrapped/build/compress.py   (last build step)
"""
import gzip
from pathlib import Path

BUILD = Path(__file__).resolve().parent
ROOT = BUILD.parent
EXTS = {'.js', '.mjs', '.css', '.html', '.json'}
SKIP_DIRS = {'raw', 'build'}


def main():
    n = raw = gz = 0
    for base in (ROOT / 'app', ROOT / 'app2', ROOT / 'data'):
        for p in sorted(base.rglob('*')):
            if p.suffix not in EXTS or any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts):
                continue
            data = p.read_bytes()
            with open(p.with_name(p.name + '.gz'), 'wb') as f:
                with gzip.GzipFile(fileobj=f, mode='wb', compresslevel=9, mtime=0) as z:
                    z.write(data)
            n += 1; raw += len(data); gz += p.with_name(p.name + '.gz').stat().st_size
    print(f"Compressed {n} assets: {raw / 1e6:.2f} MB → {gz / 1e6:.2f} MB")


if __name__ == '__main__':
    main()
