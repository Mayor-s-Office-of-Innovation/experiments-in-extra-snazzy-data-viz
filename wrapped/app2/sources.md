# Data provenance — every figure in this deck

All numbers shown in this deck come from two real datasets, processed by the open
pipeline in this repository. Nothing is illustrative or invented.

**Coverage window:** January 30 – June 8, 2026 (both datasets clamped to the same 131 days).

## The two sources

1. **Street Conditions App pilot** (staff photos, AI-scored) — raw export
   `wrapped/data/raw/sc_export.csv`, 6,136 rows. Scrubbed to 6,094 usable observations
   (dropped out-of-SF coordinates and default-centroid rows). Ingest: `build/sources/sc.py`.
2. **SF 311 complaints** — [SF 311 service requests, dataset `vw6y-z8j6`](https://data.sfgov.org/City-Infrastructure/Case-Data-from-SF-311-vw6y-z8j6/kpgh-cg3z)
   on data.sfgov.org, aggregated at (neighborhood, category) grain, clamped to the window.
   Pull: `build/sources/sf311.py`. Categories limited to those with a
   [validated crosswalk](crosswalk_review.md) to the app's 12 scoring categories.

## Slide-by-slide figure derivations

### Slide 1 — What we set out to answer <a id="slide-1-what-we-set-out-to-answer"></a><a id="slide-1"></a>
- **6,094 street photos** — usable observations after the scrub pass (`sc.py`).
- **167,819 public complaints** — comparable 311 service requests in-window (`sf311.py`).

### Slide 2 — Where staff looked <a id="slide-2-where-staff-looked"></a><a id="slide-2"></a>
- **2,238 blocks** — distinct H3 hexagons (~76 m across, res-10) with at least one photo.
- **Height = number of visits** — photo count per hex, from the same bake.
- Coverage concentration (SoMa / Tenderloin) — per-hex observation density.

### Slide 3 — The complaints <a id="slide-3-the-complaints"></a><a id="slide-3"></a>
- **167,819** — as slide 1, by neighborhood (`crowd.total`).

### Slide 4 — What 311 can't do <a id="slide-4-what-311-can-t-do"></a><a id="slide-4"></a>
- Qualitative limitations, argued by the data on slides 5–7.

### Slide 5 — Complaint volume doesn't track conditions <a id="slide-5-complaint-volume-doesn-t-track-conditions"></a><a id="slide-5"></a>
- **335 / 492 photos** — observations in Bayview Hunters Point / Mission.
- **64% / 61% found an issue** — share of observations with any non-excluded category rated ≥ 1
  (`obs_with_signal / obs`).
- **93 / 85 severe observations** — any category rated ≥ 2 (`obs_with_severe`).
- **7,331 / 34,714 complaints** — 311 totals; Mission files **4.7×** Bayview's.

### Slide 6 — A denominator changes the picture <a id="slide-6-a-denominator-changes-the-picture"></a><a id="slide-6"></a>
- **One block, 8 visits, 4 found waste = 50%** — real hex `8a28308284affff` from the bake
  (8 observations, 4 with a severe rating). Selectable from the raw export by hex id.
- **34,714** — Mission's 311 total (same window).

### Slide 7 — A lot of streets are clean <a id="slide-7-a-lot-of-streets-are-clean"></a><a id="slide-7"></a>
- **43%** — `1 − obs_with_signal / obs` citywide = 2,617 of 6,094 photos with nothing wrong.
- **Green hexes** — hexes with zero severe observations (1,935 of 2,238).

### Slide 8 — The three questions, answered <a id="slide-8-the-three-questions-answered"></a><a id="slide-8"></a>
- Derived from the findings on slides 5–7; caveats from the pipeline's known limits
  (observer coverage, deployment scale).

### Slide 9 — Potential applications <a id="slide-9-potential-applications"></a><a id="slide-9"></a>
- No figures; operational implications drawn from the above.

## Honesty notes
- The app's 0–100 score is a flat, unweighted AI rubric (graffiti = human waste, point for
  point) — we never present it as a harm scale.
- Coverage ≠ conditions: maps show where staff looked, not where conditions are worst.
- "Found an issue" is AI-scored staff photos, not human judgment.
- Both lenses are reporting instruments, not ground truth; the divergence between them is the story.