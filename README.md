# Streets 

A snazzy, motion-heavy story site that compares **streetconditions.org**
(city-staff field photos, AI-scored) with **SF 311** (public reports) over the same San
Francisco streets and window (2026-01-30 → 2026-06-08), neighborhood by neighborhood.

<img width="1130" height="806" alt="Screenshot 2026-08-04 at 4 47 30 PM" src="https://github.com/user-attachments/assets/8083cbe2-841f-42a4-a3d3-9f5d3a630b72" />

The app is a zero-dependency static site (vanilla web components + native WAAPI motion). All
data is pre-baked and committed under `wrapped/data/`, so **running it locally needs nothing
but a static file server** — no build step, no npm install, no API keys.

## Run it locally

From the repo root:

```sh
cd wrapped
python3 -m http.server 8000
```

Then open **http://localhost:8000/app/**

Any static server works — e.g. `npx http-server wrapped -p 8000` (open the same `/app/` path).
Serve the `wrapped/` directory (not `wrapped/app/`) so the app can load `../data/*.json`.

### Dev URL flags

- `?hexbin=svg` — use the SVG hexbin engine instead of the default WebGL one (also the
  reduced-motion / low-power fallback).
- `?panel=min` — hide the prose panel to study the bare visualization.

## Rebuilding the data (optional)

You only need this if you want to regenerate the JSON the app reads. It's already committed,
so skip this to just run the site.

```sh
python3 wrapped/build/build_all.py
```

This runs all five steps in order (`sources/sc.py` → `sources/sf311.py` → `crosswalk.py` →
`aggregate.py` → `make_map.py`) and writes `wrapped/data/conditions.json` and `sf_map.json`.

- `sources/sf311.py` pulls live from SF's Socrata API (needs network).
- `sources/sc.py` reads the local export CSV.
- The Equity card's income data (`sources/income.py`) is committed as `data/income.json`;
  regenerating it needs a Census API key: `CENSUS_API_KEY=... python3 wrapped/build/sources/income.py`.

## Layout

```
wrapped/
  app/     static front-end (open /app/ in the browser)
  build/   Python data pipeline
  data/    baked JSON the app reads (committed)
plan.md    full design + data notes
```

See [plan.md](plan.md) for the product thesis, data caveats, and card-by-card build status.
