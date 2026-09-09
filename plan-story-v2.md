# plan — Story v2 (internal pitch deck)

Rebuild of the story arc to match the team's agreed point list
([updated-story.md](updated-story.md)), presented to a **city-employee audience**.
Same shell, same seams, same data pipeline — new manifest, three new viz moments,
some copy reworked to our validated numbers.

**Branch: `storyv2`.** v1 stays committed on `main` and browsable (see Working method).

---

## Working method (preservation contract)

- **v1 is preserved.** All v2 work is **additive** — nothing v1 touches is edited in place.
- **`?story=v2` URL flag** selects the v2 manifest in `main.js` (`story.js` default unchanged).
  Both versions stay browsable side-by-side from one build:
  - default / `main`: v1 (public Wrapped-style arc)
  - `?story=v2`: the deck in this plan
- New card types register **alongside** v1 types in `CARD_TAGS` (new tags + imports, no edits
  to existing entries). New map styles are new `style`/`mode` values on the existing
  `<condition-map>` and hexbin card.
- All numbers below come from our baked `wrapped/data/conditions.json` (locked window
  **2026-01-30 → 2026-06-08**, our scrub pass). We do **not** import the team doc's numbers.

---

## Slide list — LOCKED 2026-09-09 (do not churn titles; "let the data carry the weight")

| # | Slide | Content (our numbers) | Background visualization | Build |
|---|---|---|---|---|
| 0 | **What we set out to answer** | Two records of the same streets: 167,819 311 complaints · 6,094 staff photos. The three questions | Tilted outline map, slow idle drift | Rework `overture` |
| 1 | **The Street Conditions App** | Staff walked routes, AI scored every photo on 12 categories. **6,094 photos → 2,238 hexes**, ~19 weeks, coverage concentrated in SoMa/Tenderloin | ⭐ WebGL hexbin in **coverage mode** — all hexes lit neutral, height = visit density | Hexbin variant |
| 2 | **311** | **167,819** mapped complaints over the same window, continuous, every day | Existing choropleth (sqrt scale, sand→amber) | Reuse as-is |
| 3 | **What 311 can't do** | The 4 limitations: no denominator · can't record a clean street · complaint ≠ confirmed problem · no accountability trail | Choropleth **drains to outline** — the map goes dark where nobody calls | Beat + new map style |
| 4 | **Complaint volume doesn't track conditions** | Bayview vs Mission: near-equal observed signal (64% vs 61% with an issue; 93 vs 85 severe) but Mission files **4.7×** the complaints. Complaint volume follows civic voice, not street condition | Map leans, both hoods lit; **4-row bar-pair** — three near-identical rows, one lopsided | Rework `equity` card |
| 5 | **A denominator changes the picture** | The app can say "waste present on 4 of 8 visits — 50% of the time." 311 can only say 34,714 cases. Mission: loudest in the city, mid-pack when staff actually looked. Loud, but not the worst | ⭐ New SVG viz: hex with 8 tick marks, 4 filled (a rate) vs naked "34,714" + "?" | New card |
| 6 | **A lot of streets are clean** | **Of 6,094 photos, 2,617 — 43% — found nothing wrong at all.** No complaint system can say this. City teams get credit; narratives shouldn't be steered only by what's wrong | ⭐ Dot map **pales out** citywide | New card (SVG stipple) |
| 7 | **The three questions, answered** | Baseline: yes (caveat: highly-variable blocks need special strategies) · Over-time: yes (caveat: coverage scales with deployment) · New vs 311: yes (underserved hoods, rates not counts, proves clean) · Policy: yes | Calm outline map, hue settles toward finale | New beat card |
| 8 | **Potential applications** | What the data can do: reveal hidden inequities · establish ambient baselines · surface long-range trends — for DPH/RRT deployments, DPW corridor cleaning, infrastructure asset tracking, fire-risk trends, enforcement hotspots, Controller's-office replacement | Camera pulls way back, whole-city flood, finale energy; quiet caveat strip: *Jan 30–Jun 8 window · AI-scored, not human judgment · coverage ≠ conditions* | New finale beat card |

⭐ = bespoke viz moment. Title rule: findings yes, campaigning no — big claims must be
data-backed statements ("A lot of streets are clean"), never exhortations ("Why we scale this").

---

## Deviations from updated-story.md (the team's agreed points — conscious, defensible)

### A. Number substitutions (decision: our pipeline, our window, our integrity passes)

| Team doc | Ours | Why |
|---|---|---|
| 224,643 complaints | **167,819** | We pull only crosswalk-comparable 311 categories, clamped to our locked window (Jan 30–Jun 8). Hers appears to be full-calendar + all categories. Defensible either way; ours is what we validated |
| Jan 1 – Jun 30 | **Jan 30 – Jun 8** | Our locked window — the one both datasets are clamped to |
| 6,055 photos | **6,094** | Our scrubbed usable count (6,136 raw minus out-of-bbox/default-centroid rows) |
| 2,239 blocks | **2,238** | Our bake |
| 4.5× complaint ratio | **4.7×** | 34,714 vs 7,331 from our bake |
| Bayview/Mission: 221/352 obs, 71%/70% found issue, 10,200/45,479 cases | **335/492 obs, 64%/61% with an issue, 7,331/34,714 cases** | Same story, our numbers. Direction matches hers on every row |
| Severity 0.99 / 0.85 (out of 3) | **93 vs 85 severe observations** | Her severity metric isn't in our bake. Row becomes "severe observations" — same asymmetry, computed by us |
| 3,878 sightings → 1,511 clean (39%) | **6,094 photos → 2,617 clean (43%)** | Hers looks like unique-location dedup; ours is all usable observations. Simpler claim, defensible by our pipeline |

### B. Dropped (with reasons)

- **"15.3% closed as No Work Needed"** — needs ticket-resolution/outcome data we don't pull.
  Slide 3 keeps the claim ("a complaint isn't a confirmed problem") without the stat.
  If the team wants the number, it's a pipeline add later.
- **"96% of days with an open case"** (Insight 2) — no daily 311 time series baked. The Mission
  point survives on our numbers (loudest in the city, mid-pack when staff looked).
- **Neighborhood clean-rate ranking table** (Insight 3) — **inverts in our data** (ours: Nob Hill
  78% clean, Tenderloin 68%) because clean rate tracks *who photographed where* (observer
  confounding). Decision: citywide 43% + pale map only, no hood ranking.
- **Next Steps section** — team doc's own note cut it; confirmed.
- **Privacy/PII consideration** — audience is city staff; not our job to point it out.
- **All v1-only beats** (sergeant, graffiti/algorithm, income equity, pick-neighborhood,
  Caveats-as-slide) — not in the team doc; freed by the new arc.

### C. Merges & reframes

- Team **7 + 8** (value + policy) → slide 7, "The three questions, answered," with the doc's own
  inline caveats as small print.
- Team **8's bullets + 9's agency list** → slide 8 finale, "Potential applications" (the doc's
  own heading).
- **New, not in the doc:** quiet caveat strip on the finale (window · AI-scored ≠ human judgment ·
  coverage ≠ conditions) — v1 honesty guardrails carried over as one line, not a slide.

### D. Residual gap (noted, acceptable for now)

- Team doc: 311 across "6,054 blocks." We bake 311 at neighborhood grain only → slide 2 says
  "same window, continuous" without a block count. **Optional pipeline add:** compute 311 hex
  coverage if the parallel matters to the team.
- **Slide 3 limitations: two of the team doc's four points DROPPED (2026-09-09).** The slide now
  carries only (1) "No denominator" and (2) "It can't record a clean street" — both of which our
  own data evidences directly (the denominator cards + the 43% clean finding). Dropped:
  - *"A complaint isn't a confirmed problem"* (team doc's 15.3% closed-as-No-Work-Needed stat) —
    that number requires the 311 case-resolution field (`status`/`resolution`), which our pipeline
    deliberately doesn't pull (`sf311.py` selects neighborhood/category/counts only). Presenting
    the claim with no number behind it violates our evidence discipline; presenting HER number
    without our own verification pass violates the "our data, validated by us" rule.
  - *"No accountability trail"* (closed ≠ addressed) — a systems critique we have zero data
    touching, and effectively point 3 restated from the ops side. Two unsupported claims in a
    row weakened the slide.
  - **Path back (pipeline add, if the team wants them):** extend `sf311.py` to aggregate the
    resolution field for the window (one Socrata query; machinery exists), re-bake, verify the
    15.3% (or our equivalent) ourselves, then restore both bullets with our numbers.

---

## Build phases

1. **Skeleton.** `?story=v2` flag → manifest swap in `main.js`; `story.v2.js` with all 9 specs
   (new types may 404 until their cards land — build cards in order below). Rework `overture`
   copy (three questions). Verify v1 still boots untouched.
2. **Hexbin coverage mode** (slide 1). New `mode:'coverage'` on `hexbin-card` — neutral fill,
   height = visit density (`hexes[].n`), no severe ramp. v1's overview mode untouched.
3. **Choropleth drain** (slide 3). New map `style:'drain'` (or card-driven `clearChoropleth`
   + dim) on `<condition-map>`; beat card with the 4 limitations.
4. **Insight 1 bar-pair** (slide 4). Rework `equity-card` (new v2 type `barpair`) — rows:
   observations, % with an issue, severe obs, 311 cases; first three near-identical, last lopsided.
5. **Denominator card** (slide 5). New SVG viz: hex with 8 ticks (4 filled) vs naked "34,714" + "?".
   Optional strip below (only if the data supports it — see Open items): one hex's real visit
   timeline across the 19 weeks, flags on the visits that found waste. Shows "the app samples
   some days" with real data. (Rejected alternative: Beuadry's three-line "reality vs app vs
   311" time series — see Open items.)
6. **Pale-out map** (slide 6). Dot stipple citywide; 2,617 dots pale, count-up to 43%.
7. **Verdict + finale** (slides 7–8). Beat cards; finale with pulled-back camera + caveat strip.
8. **Verify & polish. ✅ DONE (2026-09-09).** Contrast audit (all text pairs AA; blue ? fixed
   2.50→5.94 — see Contrast audit section). Reduced-motion pass: v1 (12) + v2 (9) cards, zero
   exceptions, end-states verified. Dashboard-review audit → `wrapped/story-v2-review.md`
   (figure trace ALL PASS; findings 1+2 resolved via per-card provenance footer + anchor doc
   `app2/sources.md`; findings 3–7 open, low). Mobile pass: panels dock bottom <700px, map
   plane lifted, chevron controls centered + disabled at ends.

## Verification

- `python3 -m http.server 8000` from `wrapped/` → `/app/` (v1) and `/app/?story=v2` (v2).
- Headless screenshots per card; animation end-states via `--force-prefers-reduced-motion`
  (known caveat: time-based rAF animations don't play in headless — see plan.md).
- Every hero number re-derived from `conditions.json` by script, not copy-pasted.

## Open items

- Compute 311 hex/block coverage for slide 2? (pipeline add — only if team asks)
- "Waste present on 4 of 8 visits" example hex: pick a real hex from the bake with exactly
  8 visits / 4 waste-present if one exists (script the search); else use a real n/n pair.
- **"Reality vs app vs 311" trend-line chart** (Beuadry comment on slide 5) — concept is right
  (unbiased sampler vs biased reporter), but the empirical version fails on our data:
  (1) the "reality" line would have to be reconstructed by extrapolating the app's own sample —
  circular, and assumes the app is an unbiased sampler, which our honesty rules forbid claiming;
  (2) "311 systematically underperforms" is our least defensible claim as a time series (the
  undercount is spatial, not uniform — citywide 311 waste volumes are huge; the undercount story
  is Bayview-specific and lives on slide 4's bar-pair, where we CAN defend it);
  (3) no timestamps baked — needs a sc.py rebuild + new weekly 311 pull, for a noisy
  2–3-visits/week Bayview line. Kept the defensible pieces: slide 4 carries the undercount
  argument cross-neighborhood; slide 5 keeps the tick viz + optional real visit-timeline strip
  (clearly sparse at ~2–3 visits/week — inspect the bake before committing). Schematic
  "illustration, not data" version possible but flagged as high misread-risk.
- Hue assignments for the 9 slides (reuse token palette; finale flood color TBD).
- **Initial-load latency (user-observed, 2026-09-09):** first paint + first hexbin view are slow.
  Suspects: 3.3 MB `conditions.json` + 3.7 MB vendored deck.gl graph + sf_map.json all before
  interactivity. Address AFTER all slides are locked — candidates: split conditions.json per
  story (v1/v2 don't need the same slices), ship only needed vendor bundles (core+geo+layers ≈
  555K of the 3.7 MB), compress static assets (`gzip -k` / brotli if the host allows), defer
  sf_map until a map card is near, lazy-mount cards one-ahead. Measure with a clean profile
  before/after.
## Contrast audit (WCAG AA, 2026-09-09)
Computed pairs on the v2 deck (panel = ink 62% over each flood). All text ≥ 4.5:1 (or large-text ≥ 3:1):
- White on panels: teal 9.53 · gold 7.12 · ink 15.87
- Kicker (55% gold→paper mix): teal 6.62 · gold 4.95
- Bar tags 75% white: 6.17 · paleout legend 80% white: 6.74
- Denominator blues: `?`/denominator/`50%` were 2.50 — **fixed** → 20% bay-blue + white mix = 5.94
- Graphics pairs: green clean-hexes on the night plane 4.28 · sand coverage columns on ink 13.53 (both ≥ 3:1 non-text)
Remaining watch item: gold kicker at 4.95 on gold panels is small-text AA only via the panel's
paper mix — do not darken that panel further.
