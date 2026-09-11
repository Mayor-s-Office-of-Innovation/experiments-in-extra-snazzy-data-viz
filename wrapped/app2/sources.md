# Data provenance — every figure in this deck

All numbers shown in this deck come from two real datasets, processed by the open
pipeline in this repository. Nothing is illustrative or invented.

**Coverage window:** January 30 – June 8, 2026 (both datasets clamped to the same 131 days).

## The two sources

1. **Street Conditions App pilot** (staff photos, AI-scored) — raw export
   `wrapped/data/raw/sc_export.csv`, 6,136 rows. Scrubbed to 6,094 usable observations
   (dropped out-of-SF coordinates and default-centroid rows). Ingest: `build/sources/sc.py`.
   The committed export carries no submitter names or emails (those columns were removed
   2026-09-11; the pipeline never read them — observers are the opaque `user_id`, anonymized
   to u0…uN at ingest).
2. **SF 311 complaints** — [SF 311 service requests, dataset `vw6y-z8j6`](https://data.sf.gov/City-Infrastructure/Case-Data-from-SF-311-vw6y-z8j6/kpgh-cg3z)
   on data.sf.gov (formerly data.sfgov.org), aggregated at (neighborhood, category) grain, clamped to the window.
   Pull: `build/sources/sf311.py`. Categories limited to those with a
   [validated crosswalk](crosswalk_review.md) to the app's 12 scoring categories.

## Slide-by-slide figure derivations

### Slide 1 — What we set out to answer <a id="slide-1-what-we-set-out-to-answer"></a><a id="slide-1"></a>
- **6,094 street photos** — usable observations after the scrub pass (`sc.py`).
- **167,819 public complaints** — comparable 311 service requests in-window (`sf311.py`).

### Slide 2 — Where staff looked <a id="slide-2-where-staff-looked"></a><a id="slide-2"></a>
- **2,238 blocks** — distinct H3 hexagons (~76 m across, res-10) with at least one photo.
- **Height = number of visits** — photo count per hex, from the same bake. (2026-09-11:
  coverage-mode heights raised/floor'd for legibility — display scale only, values unchanged.)
- Coverage concentration (SoMa / Tenderloin) — per-hex observation density.

### Slide 3 — What 311 can't do <a id="slide-3-what-311-can-t-do"></a><a id="slide-3"></a>
- **167,819** — as slide 1, by neighborhood (`crowd.total`). (2026-09-11: former slides 3+4
  merged into one card — the choropleth, its drain animation, and the limitation bullets.)
- Qualitative limitations, argued by the data on slides 4–6.

### Slide 4 — Complaint volume doesn't track conditions <a id="slide-4-complaint-volume-doesn-t-track-conditions"></a><a id="slide-4"></a>
- **335 / 492 photos** — observations in Bayview Hunters Point / Mission.
- **64% / 61% found an issue** — share of observations with any non-excluded category rated ≥ 1
  (`obs_with_signal / obs`).
- **93 / 85 severe observations** — any category rated ≥ 2 (`obs_with_severe`).
- **7,331 / 34,714 complaints** — 311 totals; Mission files **4.7×** Bayview's.

### Slide 5 — A denominator changes the picture <a id="slide-5-a-denominator-changes-the-picture"></a><a id="slide-5"></a>
One real block, both records, one time axis. Block = H3 res-10 hex `8a28308280e7fff`
(Van Ness Ave & Market St, Tenderloin), chosen from the blocks with 10+ visit-days by
**multiple** observers (no single-observer story). Built by `build/sources/block.py`
(`data/block.json`, folded into the bake as `block_exhibit`).
- **120 complaints on 67 days** — comparable 311 service requests whose point falls inside the
  hex polygon, Jan 30 – Jun 8, same service-name whitelist and admin-churn exclusions as the
  citywide pull; pulled 2026-09-11 from data.sf.gov (the live query is `query_url` in
  `block.json`). One dot per case, stacked per day.
- **15 visit-days, 12 with nothing wrong** — staff photos in the hex (29 photos by 4 observers),
  grouped by San Francisco calendar day; a day's mark is its worst rating: green = no category
  rated ≥ 1, amber = something rated 1, red = something rated ≥ 2 (Active Drug Use excluded, as
  everywhere in the deck).
- Alternates considered: 418 Larkin (20 visit-days, 9 clean, but 33 of 35 photos by one
  observer) and 555 Larkin (39 visit-days, 143 of 154 by one observer).

### Slide 6 — A lot of streets are clean <a id="slide-6-a-lot-of-streets-are-clean"></a><a id="slide-6"></a>
- **43%** — `1 − obs_with_signal / obs` citywide = 2,617 of 6,094 photos with nothing wrong.
- **One dot per photo** — 6,094 dots scattered inside the hex each photo was taken in (positions
  are a seeded scatter, not GPS points; the hex is real). The 2,617 green dots are the same
  photos as the 43% (`n_clean` per hex from `sc.py`); grey dots had something rated ≥ 1.
  (Two photos carry no hex id and are counted but not drawn.)
- **Streets** — DataSF street centerlines (dataset `3psu-pn9h`, active segments), projected and
  simplified by `make_map.py` into `data/sf_streets.json`. Basemap only; no figures.

### Slide 7 — The three questions, answered <a id="slide-7-the-three-questions-answered"></a><a id="slide-7"></a>
- Wording is the team's agreed §7 (`updated-story.md`) verbatim, under our toned-down title.
  No figures on this slide; the answers are argued by slides 2–6.

### Slide 8 — This data can inform policy and operational decisions <a id="slide-8-this-data-can-inform-policy-and-operational-decisions"></a><a id="slide-8"></a>
- The team's agreed §8, verbatim. No figures. Background: slide 6's streets + photo dots.

### Slide 9 — What are possible applications of this data? <a id="slide-9-what-are-possible-applications-of-this-data"></a><a id="slide-9"></a>
- The team's agreed §9, verbatim, as six tiles. No figures. The caveat strip restates the
  deck's guardrails: locked window, AI-scored not human judgment, coverage ≠ conditions.

## Honesty notes
- The app's 0–100 score is a flat, unweighted AI rubric (graffiti = human waste, point for
  point) — we never present it as a harm scale.
- Coverage ≠ conditions: maps show where staff looked, not where conditions are worst.
- "Found an issue" is AI-scored staff photos, not human judgment.
- Both lenses are reporting instruments, not ground truth; the divergence between them is the story.