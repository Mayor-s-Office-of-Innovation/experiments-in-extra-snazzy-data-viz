# Streets 

A snazzy, motion-heavy story site that compares **streetconditions.org**
(city-staff field photos, AI-scored) with **SF 311** (public reports) over the same San
Francisco streets and window (2026-01-30 → 2026-06-08), neighborhood by neighborhood.

<img width="1130" height="806" alt="Screenshot 2026-08-04 at 4 47 30 PM" src="https://github.com/user-attachments/assets/8083cbe2-841f-42a4-a3d3-9f5d3a630b72" />

The app is a zero-dependency static site (vanilla web components + native WAAPI motion). All
data is pre-baked and committed under `wrapped/data/`, so **running it locally needs nothing
but a static file server** — no build step, no npm install, no API keys.

## Run it locally

```sh
npm install
npm start          # serves wrapped/ on :8000 and opens /app2/ (the internal pitch deck)
npm run start:v1   # same, opens /app/ (the public story)
```

The only dependency is `http-server` (dev). It runs with `-g`, which serves the precompressed
`.gz` siblings the build writes, and `-c-1` (no caching) so edits show on reload. Both
versions are the same code with different manifests; see `plan-story-v2.md`.

Any static server works — e.g. `cd wrapped && python3 -m http.server 8000`. Serve the
`wrapped/` directory (not `wrapped/app/`) so the app can load `../data/*.json`.

### Dev URL flags

- `?hexbin=svg` — use the SVG hexbin engine instead of the default WebGL one (also the
  reduced-motion / low-power fallback).
- `?panel=min` — hide the prose panel to study the bare visualization.

## Rebuilding the data (optional)

You only need this if you want to regenerate the JSON the app reads. It's already committed,
so skip this to just run the site.

```sh
npm run build:data     # = python3 wrapped/build/build_all.py
```

This runs the steps in order (`sources/sc.py` → `sources/sf311.py` → `crosswalk.py` →
`aggregate.py` → `make_map.py` → `slice_v2.py` → `compress.py`) and writes
`wrapped/data/conditions.json`, `sf_map.json`, `sf_streets.json`, the v2 deck's slice
`data/v2/conditions.json`, and the `.gz` siblings.

- `sources/sf311.py` pulls live from SF's Socrata API at data.sf.gov (needs network). Note the
  committed `data/sf311.json` is the locked Jan 30 – Jun 8 pull; re-pulling changes the counts.
- `sources/sc.py` reads the local export CSV.
- Optional inputs whose outputs are committed (run by hand when they need refreshing):
  - `sources/block.py` → `data/block.json`, the one-block exhibit on the pitch deck's slide 5
    (needs `pip install h3` for the hex boundary, plus network for the 311 pull).
  - `sources/streets.py` → `data/raw/streets.geojson` (git-ignored, ~16 MB); `make_map.py`
    turns it into `data/sf_streets.json`.
  - `sources/income.py` → `data/income.json` (Equity card; needs a Census API key:
    `CENSUS_API_KEY=... python3 wrapped/build/sources/income.py`).

## Layout

```
wrapped/
  app/     static front-end (open /app/ in the browser)
  build/   Python data pipeline
  data/    baked JSON the app reads (committed)
plan.md    full design + data notes
```

See [plan.md](plan.md) for the product thesis, data caveats, and card-by-card build status.
