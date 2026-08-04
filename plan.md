# Streets Wrapped — plan

A "Spotify Wrapped"-style, motion-heavy story site that compares **streetconditions.org**
(city-staff field observations) with **SF 311** (public reports), neighborhood by
neighborhood. Inspired by [311wrapped.com](https://311wrapped.com). Lives here for now;
**spins out to its own repo** later (constellation convention).

## ▶ RESUME HERE (state as of 2026-07-24)
**Working prototype exists** at `wrapped/app/` — serve `wrapped/` statically, open `/app/`
(`cd wrapped && python3 -m http.server 8000` → http://localhost:8000/app/). Data layer complete &
rebuildable via `python3 wrapped/build/build_all.py` (runs all 5 steps incl. `make_map.py`).

### Hexbin hero — BUILT BOTH WAYS, comparison pending (2026-07-24)
The *"Where it looked"* card is now a real `hexbin` card (`app/js/cards/hexbin-card.js`) hosting the
severe-density hexbin in **two swappable engines** behind one interface (Seam #6) so the long-deferred
**WebGL-vs-SVG** call gets decided from real pixels. Flip via the on-card toggle or `?hexbin=svg|webgl`.
- **Engine A — `app/js/render/hexbin-svg.js` (faux-3D SVG, zero-dep, DEFAULT).** Screen-space projection
  echoing the tilt; fixed-size hexes so cells read citywide; **hood/city outlines** under the columns
  (user asked — big legibility win); teal calm baseline; one validated ORANGE sequential ramp
  (`hexbin-scale.js`, dataviz-validated). **Verified via headless screenshots: looks great.**
- **Engine B — `app/js/render/hexbin-webgl.js` (deck.gl H3HexagonLayer, lazy). NOW RENDERS.**
  deck.gl + h3-js lazy-imported from esm.sh. Two gotchas found+fixed: (1) true res-10 cells are ~2px
  citywide → **aggregates res-10 → res-8** (summing severe) for visible columns; (2) **blank canvas +
  "not enough transform feedback buffers bound"** was deck's **GPU attribute `transitions`** (WebGL2
  transform-feedback) mis-binding on the esm.sh build — **removed the `transitions` prop → renders
  fine** (instant updates are OK). Drag-to-orbit real 3D. Verified via real-GPU headless screenshot;
  observer toggle collapses the spike here too. **Hood outlines added** (deck `PathLayer` from
  lng/lat rings that `make_map.py` now emits into `sf_map.json.outlines` — inverted from the
  simplified projected rings, so no 1.4 MB geojson shipped). Caveats: two tallest columns blow out to
  near-white under the material lighting; chunkier grain than SVG (res-8). **User leaning WebGL (likes
  the lighting).**
- **Observer toggle works** (verified `?sergeant=out`): removing the one dominant TL observer collapses
  the spike 128→14 severe and the downtown cluster shrinks — the "change who holds the phone" moment.
- **Panel is hideable** (`?panel=min` / "Hide text" btn) to study the bare viz; controls stay pinned.
- **Tuning (2026-07-24, both still in play):** WebGL grain **res-8 → res-9** (~175m, finer, matches
  SVG size better). SVG columns recolored to a **gold/amber** ramp — flat unlit orange muddied into the
  red flood; gold has more lightness climb + hue separation (light-end 8.08:1 vs surface). WebGL keeps
  the **orange** ramp (its 3D material shading already separates the mids). Two ramps now live in
  `hexbin-scale.js` (`RAMP` webgl / `RAMP_SVG`), heights/domain still shared. WebGL peak still blows to
  white (not yet softened). User: "keep tweaking both before deciding" → now **leaning WebGL**.
- **WebGL camera + polish (2026-07-24, LOVED by user):** zoom 12.65 (fills frame); **passive**
  (`controller:false`) — tap advances the card (tap-to-skip kept), no drag-to-orbit. Camera is driven by
  **one continuous programmatic rAF loop**: rotate+tilt+zoom **entrance (1.1s)** → seamless **idle drift**
  (bearing±3.5°/pitch±1.6°). NO `onViewStateChange` — that's deliberate: an earlier idle-drift attempt put
  `mode='user';stopRAF()` in `onViewStateChange`, but with a controlled viewState deck fires that callback
  on our own `setProps`, so it killed the entrance on frame 1 (regression). Passive + single loop is
  regression-proof. **viewState bottom padding (~0.42·h)** lifts the focal centre so downtown/spike clears
  the panel. **Peak blow-out fixed** — no specular (`shininess:0`, black specular) + `RAMP` top pulled to a
  saturated orange. Confirms deck matches the SVG shell's motion language.
- Scale in `hexbin-scale.js`; `make_map.py` now projects hexes into `sf_map.json`
  (`hexes[]` + `hex_r`); `data.js` gained `loadMap/mapHexes/mapHoods/mapMeta`.
- **Card simplified (2026-07-24):** removed ALL on-card buttons — the **sergeant/observer toggle is
  cut** (user: "don't need the ability to hide sergeant's photos"; the copy carries the caveat), plus
  the engine + hide-text buttons. **WebGL is now the default engine** (SVG still at `?hexbin=svg`;
  `?panel=min` still hides prose — dev escape hatches only). Card = hexbin + glass panel (kicker/title/
  body/caption), nothing else. Map shows the WITH-observer state (the dramatic spike) by design.
- **DECISION ~converged: WebGL hero** (user loves it, made it default). SVG parked behind the seam as
  the reduced-motion/low-power fallback for now; formalize/remove after the deck's other cards land.
- **RESTRUCTURE DONE (2026-07-24) — hexbin moved to The Sweep; Sergeant = light-in-fog reveal.**
  - **The Sweep** (`sweep`, hue camera/blue) is now the **hexbin overview hero** (`type:hexbin`,
    `mode:overview`, res-9). Carries a **"7 in 10" stat chip**; copy frames the flat calm as the point.
  - **A single sergeant** (`where-it-looked`) — **collapse animation CHUCKED (user, 2026-07-24):** the
    column-shrink-to-dot "wasn't adding anything." Now a **`beat` card** (hue ink) that transitions
    straight from the WebGL hexbin to a **pulsing-dot map in the fog** — the shell tilted map in `pins`
    style, `frame:'hood'` leaning into the Tenderloin, the pulsing `.map-pin` = the sergeant's light, plus
    a `fog:true` vignette (`.beat[data-fog]::before`). Copy ends "…one light, one route, not a fair
    sample." (dropped the "take him out…" line — user found it negative). Engines reverted to
    overview-only; `make_map.py` `cll` centroids retained (harmless, reusable).
  - Card fields still live: `chip` (Sweep's "7 in 10"), `caption`; `fog` on beat cards.

### The Complaints — 311 choropleth ✅ (2026-07-24)
VP1 hero: a **flat choropleth on the shared tilted plane** (deliberate contrast with the Sweep's 3D
hexbin — public *ledger* vs ambient *sweep*). New `choropleth-card.js` (`type:choropleth`) shades all
41 hoods by 311 volume via `condition-map.setChoropleth(fillByName)` / `clearChoropleth()` (generic
renderer; the card owns the data→color scale). **sqrt scale** (311 is skewed: Mission ~35k vs ~2.5k
median), **sand→amber sequential** ramp (dataviz-validated on the green flood, light-end 4.94:1),
count-up 167,819, fewer→more legend. `setStyle` drops inline fills when leaving choropleth.
Minor open: centered panel covers the Mission (the darkest / the point) — consider docking it aside.

### What it saw — flat-rubric bars ✅ (2026-07-24)
`algorithm-card.js` (`type:algorithm`). Ranked **severe-flag counts by category** from
`citywide.camera.category_totals`: **Graffiti 503** (coral, towering) vs Human Waste 8 / Sharps 2 /
Fire 0 — the flat rubric (2.78 pts each) means the "severe" signal is really a graffiti detector.
Bars grow on enter; formula line + the **fentanyl-fold exclusion** callout. No geography (faint map).
Panel `overflow-y:auto` so it never spills onto the nav.

_(Card-by-card build status lives in the **Storyboard table's Built column** below — single source of truth.)_
  - **HEADLESS CAVEAT (important for future verification):** Chrome `--virtual-time-budget` barely advances
    `performance.now()` (~0.5s in a 10s budget), so time-based rAF animations (entrance, idle drift,
    collapse) do NOT play in headless screenshots — they freeze at the start pose. Verify motion in a real
    browser; verify animation END-STATES via `--force-prefers-reduced-motion` (renders the static final).
- **Tabled ideas (user, keep):** reuse this **3D hexbin viz elsewhere** if it fits. (The blinking-light
  sergeant idea is now BUILT as the collapse reveal's beacon.)
- **Open polish:** full-panel prose scrolls at ≤66% height (readout can be below fold) — trim copy or
  raise cap; mobile-portrait tuning; WebGL hood outlines (PathLayer from geojson) not yet added.
- **Thesis: TWO complementary viewpoints** — The Complaints (311, blind to baseline) vs The Sweep
  (streetconditions ambient; "7 in 10 blocks Excellent" is the POINT). Sweep's 2 blind spots
  (where it looked / what it saw) are its sub-arc. (See Product thesis.)
- **Arc built & walkable** (beat placeholders for un-finished visuals): Overture → Complaints →
  only-problems → Sweep → Where it looked (sergeant) → What it saw → Disagree (hook) → **Loud but
  calm: Mission** → **Quiet but not fine: Bayview** → Share. The two divergence beats are REAL
  (`divergence-card.js`, `data.divergence()`, hood-level `query_url` baked into sf311.py).
- **NEXT:** turn beat placeholders into real data visuals — Complaints **311 choropleth**, Sweep
  **"7 in 10" gauge**, Where-it-looked **hexbin severe-density** (the WebGL-vs-SVG decision lives
  here, still deferred). "Where they agree" (optional) and the Equity + Pick-your-neighborhood cards
  are not built yet.
- **Copy guardrails (don't revert):** no word "wrapped" in UI; "7 in 10" (Sweep) and "949 of 1,336"
  (sergeant) are phrased differently on purpose — both ≈71% but unrelated, looked like a bug as
  matching %s. Sergeant point = *data non-comparability*, NOT "TL isn't bad." Fentanyl-fold =
  recognition gap ("sees a person, not the emergency"), not a visibility gap.

## Cold-start bootstrap (read FIRST if resuming in an empty repo)
This plan was written in another repo; none of the context below is available by default in
a fresh session. Everything needed to resume is inlined here.

**Process prefs (were in memory, won't load in a new repo):**
- The user runs all git/gh mutations himself — **give him the commands, don't run them.**
- Every planning step produces an in-repo `plan-<feature>.md` (this doc).
- Invoke skills for stack conventions: **`web-dev`** at the start of any web work,
  **`dataviz`** before writing any chart/map code, **`dashboard-review`** after a first
  build, plus `digital-inclusion` / `web-security-baseline` as relevant.

**Source repo to mine (absolute path):** `/Users/aaron.hans/dev/sf-neighborhood-concerns`
Copy/adapt these into the new repo (use the **single-source SF311 `cleanliness/` variant**,
NOT the blended 311+CFS+incidents build at repo root):
- `cleanliness/build/sources/sf311.py` — 311 puller. Aggregates via Socrata `$select`/`$group`
  on `analysis_neighborhood, service_name, service_subtype, service_details, count(*)`.
  Label preference: service_details → service_subtype → service_name. Already handles the
  **June-2025 service_name recategorization** that splits the unhoused signal mid-window
  (union the filter or you undercount).
- `cleanliness/build/aggregate.py` — builds `concerns.json`.
- `cleanliness/src/{detail,map,pivot,labels,constants,main}.js` — drill-in reference UI
  (expandable per-hood card → top-5 raw-volume bars → each count a live Socrata link).
- `data/neighborhoods.geojson` — **41** official SF Analysis Neighborhoods, `MultiPolygon`,
  name in property **`nhood`** (~1.4 MB; simplify for the tilted SVG map).

**Concrete data facts:**
- SF 311 dataset: **`vw6y-z8j6`** on `data.sfgov.org`
  (`https://data.sfgov.org/resource/vw6y-z8j6.json`). Native **`analysis_neighborhood`** column
  = the free join key. (CFS `2zdj-bwza`, SFPD incidents `wg3w-h783` exist but are NOT used here.)
- `concerns.json` schema: `{schema_version, generated_at, config, sources, stats,
  citywide_top_terms, neighborhoods{<nhood>: {total_raw_count, total_weighted_count,
  top_terms:[{term, source, count, service_name, query_url, query_soql_where, ...}]}}}`.
  Config includes `top_n_per_neighborhood: 10` and per-source min-cell thresholds. Every term
  carries a runnable `query_url` — preserve this provenance discipline.

**streetconditions.org (the SC side):** React/Redux PWA. Data is behind an auth-locked AWS
API — base `https://epdrnx5e97.execute-api.us-east-1.amazonaws.com/prod/api` returns **403 on
every path**, so it can't be scraped → **need an export from the coworker** (see Dependencies).
Defaults to the same 41 SF Analysis Neighborhoods (also offers SFPD districts). Each observation
has a category + a **severity rating (1/2/3)** rolled into a weighted **0–100** score the tool
itself labels *"a manual ops rubric, not a validated harm scale."* Coverage: **6,126** obs,
**2026-01-30 → 2026-06-08**.

**Reference screenshots (311wrapped is 403 — these local files are the only way to re-see it):**
- 311wrapped design language: `~/Desktop/311wrapped/*.png` (8 shots — story cards, the
  tilted rotating map, VS/"TURF WAR", dot-density, dumbbell resolve-time, interactive "SAYS WHO?").
- The coworker's sober SC analysis (for parity of substance): `~/Downloads/sfstreets.streamlit.app_*.png`.

## Product thesis (read this first)
Presentation **is** the product. Reference point: data experts were unimpressed by
311wrapped's *content* but shared it anyway on *presentation*. So we optimize the
**shareable moment** first, rigor second (honest, but not the hook).

**Thesis (revised 2026-07-23) — TWO viewpoints, complementary by design.** Earlier "three lenses
(Camera/Algorithm/Crowd)" conflated 2 data *sources* with 3 *biases*; a viewer counts sources and
reads it as 2. So the top level is **two viewpoints**, and streetconditions' own origin explains
*why* they're complementary rather than redundant — SC was built to fix a specific 311 blind spot:
- **The Complaints (311)** — a *complaint ledger*. Only records where someone reported a problem;
  **structurally blind to the baseline** (the blocks that are fine, and problems nobody reports).
  Biased by who complains about what.
- **The Sweep (streetconditions)** — an *ambient sample*: staff photos scored by an AI, capturing a
  block whether or not anything is wrong. **The 71% "Excellent" is the POINT, not a curiosity** —
  it's recording the "everything's OK" that 311 cannot represent.

The **divergence is directional and meaningful**: 311-loud / Sweep-calm = complaints without an
observed condition (or already cleaned); Sweep-flags / 311-quiet = conditions nobody reported — the
311 blind spot SC exists to catch. Tone: **not "both tools are broken" — "each was built for a
different job; comparing them shows what each is blind to."**

The **Sweep carries TWO blind spots** as an internal sub-arc (this is where the old Camera/Algorithm
split survives, one level down): **where it looked** (camera coverage — downtown-dense, one sergeant
= 71% of the Tenderloin) and **what it saw** (the AI — drug-use blind spot, flat unweighted rubric).
More defensible than a superlatives deck, and the data can't support the latter anyway (see Data
reality). NOTE: the Camera/Algorithm/Crowd storyboard below still needs reworking to this
2-viewpoint structure (pending).

## Data reality — verified from the actual export (2026-07-23)
Export file: `SCA-export-010126-061026(in).csv` — **confirmed the complete dataset**, 6,136 obs,
window **2026-01-30 → 2026-06-08** (LOCKED; clamp 311 to exactly this).
- **SC = AI-on-photos.** `report_evidence_type=photo` (99%), every `ratings_details` explanation
  reads "…visible in the image." 18 photographers; one (the app creator, out of the Sunset /
  City Hall) is 43% of all obs. Coverage is **citywide in extent but downtown-dense** (45% of
  obs within 2km of City Hall; densest single 100m cell = 5% of everything). Reach is broad,
  **confidence per location is wildly uneven** — caption accordingly.
- **Score formula (reverse-engineered, 100% match):**
  `total_score = round( 100 × (1 − S/36) )`, where **S = sum of the 12 category ratings** (each
  0–3, worst = 36). `non_normalized_score` = S. **The rubric is flat and unweighted** — a "3" for
  Graffiti costs exactly as much as a "3" for Human Waste or Fire Hazard (100/36 ≈ 2.78 pts each).
  Two structural distortions to name out loud: it **under-counts** what the AI can't see and
  **over-weights** the cosmetic relative to the dangerous.
- **Color maps by SEVERE-obs density, NOT mean score (verified in pipeline).** 71% of photos are
  pristine 100s, so mean score washes out to uniform green (citywide 95.9; TL 94.8 vs 95.0 without
  the sergeant — flat). The honest, high-dynamic-range signal is **count of obs with any category
  rated ≥2**: TL drops **361 → 65 severe** without its dominant observer; 303 of 2,238 hexes carry
  the red. `sc.py` emits `n_severe` per hex for exactly this.
- **12 categories** (not the 6+2 first assumed): RV/inhabited vehicle, Waste & Small Debris,
  Furniture & Large Debris, Human & Animal Waste, Sharps, Unsheltered Presence, Fire & Safety
  Hazards, Access Obstruction, **Active Drug Use**, Public Health Need, Animals, Graffiti. One
  stray row uses a different 9-label taxonomy → quarantine.
- **Active Drug Use is unreliable — EXCLUDE from all head-to-heads.** Confirmed by the creator:
  the AI doesn't recognize the fentanyl fold / hidden use as a crisis (it sees a person, not the
  emergency a human reads instantly); it was never trained for this. Use only as a
  "limits of the algorithm" teaching beat, never as a credible signal or comparison.
- **`matched_district` is dead** (100% "BAYVIEW", wrong) → assign `analysis_neighborhood`
  ourselves via point-in-polygon on the geojson (done; 6,094/6,136 assigned).
- **Data-quality scrub before any join:** drop ~30 out-of-SF-bbox coords (one is in China) and
  the 19 rows on the exact default centroid (37.7749, −122.4194). Dup photos per block are
  **intentional** (different angles) — do NOT dedupe; but remember counts reflect photo-taking
  behavior, not incident counts.
- **`status_label`** = condition grade (Excellent/Good/Fair/Poor/Very poor/Maintain), 71%
  "Excellent" — NOT a fixed/broken workflow. Confirms Card 7 cut.
- **Timestamps:** capture ≈ upload ≈ scoring, but batch uploads drift → day/night comparison is
  shaky (Card 6 is at-risk; treat as "when staff walked," not "when conditions occurred").
- **No photo access** (paths only). `people_count_est`/`shelter_footprint` only 1.4% filled.

**Neighborhood axis SURVIVES, tiered by confidence** (obs / obs-with-severe≥2):
- **Tier 1 — full deep-dive + 311 comparison:** SoMa (441/128), Bayview–Hunters Point (335/93),
  Mission (492/85), Nob Hill (277/53), Financial District (265/39).
- **Tenderloin is a special case — the star EXHIBIT, not a clean hero.** 1336 obs / 363 severe,
  BUT **a single city-staff observer** (per the creator, a police sergeant logging the app on his
  rounds — block-disturbance analysis, often from an unmarked car) is **71% of TL obs (949) and
  ~82% of its severe ratings (296)**.
  Strip that one observer → ~387 obs / ~67 severe (≈ SoMa level). So the reddest neighborhood on
  the map is red largely because *one person with an enforcement mission was told to photograph
  disturbances there.* Do NOT present TL as "worst ambient conditions." Instead make it the
  **hero card for the Camera thesis**: show the TL re-color when you add/remove that one observer —
  change who holds the phone, change the map. (Anonymize: describe the role, never the identity.)
- **All photographers are `@sfgov.org` city staff** (18 user_ids; the creator alone = 43% of all
  obs). The Camera is a *government* instrument end-to-end — sharpens Camera(staff) vs Crowd(311
  public) as genuinely different populations, not two flavors of the same thing.
- **Tier 2 — ambient score only ("quietly fine"):** Sunset/Parkside (453 / **5**),
  Inner Sunset (303/2), West of Twin Peaks (244/4), Richmond, Castro — lots of photos, almost
  nothing wrong. That absence is itself an honest finding, not a rankable "top issue."
- **Tier 3 — suppress superlatives (<~50 obs):** Japantown (7), Seacliff (14), Twin Peaks (24),
  Presidio (26) → show "too few eyes here," never a fake rank.

**Maps to the creator's foundational questions:** Q1 ambient/longitudinal → per-hood score dist +
weekly trend (gated on the uneven-confidence caveat). Q2 new-vs-311 → the crosswalk + divergence,
compared **only on blocks the camera actually covered**, excluding Active Drug Use. Q3/Q4
policy+equity → the red hotspots (Tenderloin/SoMa NE + Bayview SE) track the lowest-income areas;
where SC and 311 disagree is the operational insight. (Q5 usability is qualitative — skip.)

**Divergence — method + findings (2026-07-23).** Fairest unit-free comparison = **share of citywide
total**: what % of all 311 complaints vs what % of all Sweep-severe obs fall in each hood (both sum
to 100%). Δ = complaint_share − severe_share. Findings (hoods with ≥80 Sweep obs):
- **Loud but calm (Δ>0): the Mission** — 20.7% of all 311 complaints, 9.1% of Sweep-severe (Δ +11.6);
  the west side (Sunset 2.6% vs 0.5%, Richmond, Bernal) similar. CLEAN — lots of Sweep photos, low
  severe, high complaints. Real "complaints ≠ observed severe conditions."
- **Flagged-heavy (Δ<0): Tenderloin −31.2, SoMa −5.9, Bayview −5.6 — Sweep-severe is observer-
  confounded** (one observer dominates: TL 71%, SoMa 71%, Bayview 79% of obs). So we can't claim
  "the Sweep saw more" from our severe counts alone — the Sweep's problem-map is substantially an
  **observer-attention map**.
- **BUT Bayview is a real "flagged but silent" story via 311 UNDER-REPORTING (user, 2026-07-23):**
  known from other 311 projects — Bayview's conditions are genuinely bad yet it files fewer 311
  complaints, the classic equity under-reporting pattern (under-resourced hoods complain less
  relative to conditions). So the honest reverse claim is **about the 311 side, not the Sweep**:
  *complaints measure who complains, not what's there* — vocal hoods (Mission) over-report,
  under-resourced ones (Bayview) under-report. Ties the divergence beat straight into the Equity card.
- **Implication — the two follow-up beats:** (1) **Loud but calm → Mission** (clean: high 311, low
  Sweep-severe). (2) **Quiet, but not fine → Bayview** (311 under-reports a genuinely-bad hood —
  equity framing, NOT "the Sweep proved it"). Each carries its live 311 `query_url`.

## Locked decisions
- **Axis:** neighborhood-by-neighborhood; pick one and dive in. Citywide is the
  **overture + finale** framing only (review whether it earns its place), not a 2nd mode.
- **Time window:** *same window everywhere.* Clamp 311 to the streetconditions coverage
  (~**2026-01-30 → 2026-06-08**). Most defensible; drop 311's fuller history.
- **Motion lib:** **Motion One** (~5KB, WAAPI). Break the repo's usual no-deps rule here —
  motion is the point. `prefers-reduced-motion` honored throughout (snap, don't fly).
- **Geography:** the **41 official SF Analysis Neighborhoods**. Join is FREE — 311 has a
  native `analysis_neighborhood` column; streetconditions defaults to the same geography.

## Architecture — three layers
1. **Data engine (reuse from `../sf-neighborhood-concerns`).** Its build + `concerns.json`
   schema already pull 311 pre-aggregated by `(analysis_neighborhood, service_name,
   service_subtype, count)` with a **live `query_url` on every number**, and already handle
   the June-2025 recategorization gotcha. Reuse wholesale.
   - `cleanliness/build/sources/sf311.py` → 311 source (single-source variant — see Cold-start bootstrap).
   - `cleanliness/build/aggregate.py` → builds `concerns.json`.
   - `data/neighborhoods.geojson` → 41 hoods, name in `nhood` (1.4 MB; **simplify** to light topojson/SVG for the map).
   - `concerns.json` schema (schema_version, config, sources, stats, citywide_top_terms, neighborhoods{top_terms}).
   - `cleanliness/src/detail.js` = the drill-in reference (expandable card → top-5 bars → live Socrata links).
2. **New: streetconditions as one more `source`** (the AI-on-photos lens — see Data reality) in the
   same aggregation + the **category crosswalk** (the one genuine analytical task — see below).
   Ingest the CSV: scrub coords, point-in-polygon to the 41-hood key, apply the score formula,
   carry `user_id` + tier flags. Same locked window as 311.
3. **New: the motion skin.** The 311wrapped-style animated story front-end. Vanilla web
   components + Motion One over a tiny slide-index state machine.

## Modular architecture (built to iterate — decided 2026-07-23)
Explicit goal: **animations, visual style, and *what data each card shows* will all churn.** Decouple
them behind stable seams so any one changes in exactly one place, without cascading. Six seams:
1. **Data** — one baked `conditions.json` **superset** (all hoods, all 12 cats, both lenses, tier
   flags, `user_id`, provenance). Cards never re-bake to change what they show — they **select** via
   a thin accessor. Changing a metric = a selector edit, not a pipeline run.
2. **Story manifest** — the storyboard is **declarative config** (`story.js`: ordered array of card
   specs `{id, type, hood?, metric?, lens?, copy}`). Reorder / add / cut / A-B cards by editing the
   manifest; the shell just walks it. The file you'll touch most.
3. **Cards** — self-contained web components with a uniform interface + lifecycle hooks
   `onEnter(el,{reducedMotion})` / `onExit()`, composed from reusable **viz primitives** (count-up,
   ranked-bars, dot-map, VS, gauge, `<condition-map>`) that consume data + tokens. Add/cut a card →
   no other card notices.
4. **Motion presets** — animation lives in a **swappable registry**, not card markup. Cards declare
   *intent* (`data-anim="fly-in-stagger"`); a central module maps intent → Motion One timeline,
   reduced-motion-aware. Reskin all motion by editing presets.
5. **Style tokens** — design system as CSS custom properties (per-card hue, 3 type roles, spacing,
   accents) in one theme file. Restyle by editing tokens; per-card flood = one attribute.
6. **Renderer boundary** — heavy visuals (map, charts) sit behind a component with a data interface;
   swap WebGL↔SVG without touching the shell (see WebGL open item).

**Thin stable core:** shell = slide-index state machine + progress bar + hook dispatch; it walks the
manifest, mounts cards, calls hooks. Churn lives in manifest/cards/presets/tokens, never the core.
→ animations churn in **presets**, style in **tokens**, "what we present" in **manifest + selectors**.
`web-dev` skill governs the actual scaffolding.

## The one analytical task: category crosswalk
Map the **12 SC categories** (see Data reality) → 311 `service_name`/`service_subtype`:
RV/inhabited vehicle, Waste & Small Debris, Furniture & Large Debris, Human & Animal Waste,
Sharps, Unsheltered Presence, Fire & Safety Hazards, Access Obstruction, Public Health Need,
Animals, Graffiti — **and Active Drug Use, which is EXCLUDED from comparison** (AI blind spot).
Several (Public Health Need, Unsheltered Presence) have no clean 311 equivalent → the **"unmapped"
bucket is load-bearing**, not a footnote. Deliverable: `crosswalk.json` (SC category → [311
subtypes]) reviewed before any head-to-head ships. **Comparisons are valid only through this table,
only on blocks the Camera actually covered, and never for the excluded drug-use category.**

**311 grain confirmed (2026-07-23) — the 311 side maps at `service_details`, not `service_subtype`
(Street & Sidewalk Cleaning is one lump subtype).** Evidence-based anchors from the in-window pull:
- Human & Animal Waste → `human_waste_or_urine` (18k) · Sharps → `needles_less_than_20/_20_or_more`
- Waste & Small Debris → `other_loose_garbage_debris_yard_waste`, `other_bagged_boxed_contained_garbage`,
  `glass`, `city_garbage_can_overflowing` · Furniture & Large Debris → `furniture`, `mattress`,
  `refrigerator_appliance`, `electronics`, `shopping_cart`, `tires_less_than_10`
- Graffiti → Graffiti Public/Private (subtypes: pole, building_commercial, …) · Unsheltered Presence
  → `Encampment/encampment` · Access Obstruction → `Blocked Street and Sidewalk`, `Sidewalk and Curb`
- No clean 311 match (→ unmapped): Fire & Safety Hazards, Animals, Public Health Need, RV/inhabited
  vehicle. `sf311.py` whitelist already scopes the pull to these comparable service_names.

## Honesty rules (baked in)
- **Hero numbers = counts and divergences** (reporting-robust). The SC 0–100 score is a **flat,
  unweighted AI rubric** (graffiti = human waste, point for point) → labeled secondary lens only,
  never a flashed hero stat.
- **The Camera is not human judgment and not the public** — it's an AI scoring city-staff photos.
  Never imply "staff think X"; say "the model scored X in staff photos."
- **Coverage ≠ conditions.** Height/volume/density on any map means "where the camera looked,"
  not "where it's worst" — caption every such encoding. Confidence is uneven (downtown-dense).
- **Active Drug Use is never a credible signal** (AI blind spot) — only a "limits of the lens" beat.
- All three lenses are **reporting instruments**, not ground truth. The divergence *is* the story;
  caption "who observes/reports what," not "which place is worse."
- Every 311 number keeps its **live query_url** (repo provenance discipline).
- Reduced-motion + WCAG AA (contrast on the saturated floods needs checking).

## Design system (distilled from 311wrapped screenshots)
- **Format:** ~9–20 full-screen story cards. Segmented progress bar, auto-advance, TAP TO
  SKIP, pause. One insight per viewport.
- **Color:** each card floods one saturated hue (mustard, royal blue, near-black, forest
  green, purple, brick, bone). Hot accents: red-orange, cyan, pink, yellow. Background hue
  crossfades card→card.
- **Type (3 roles):** giant condensed heavy display (hero numbers/words) · letter-spaced
  uppercase mono (kickers/labels) · plain bold sans (body). *Fonts TBD — need free/licensed
  picks: a Druk-like condensed + a mono.*
- **Motifs:** faint city-boundary linework behind everything; one glowing highlighted
  neighborhood polygon floating behind content; pill badges (`#4 LOUDEST OF 27`, `TURF WAR`);
  rounded-black stat chips; radial clock (time-of-day); ranked 1/2/3 bars + share-of-voice
  stacked bar; dot-density maps; dumbbell plot (resolve-time); head-to-head VS; interactive
  crowd card. Voice: superlatives + wit.

## Inspired by 311wrapped, NOT a clone (guardrail — decided 2026-07-23)
Borrow the *grammar* (a shared story idiom, not theirs): full-screen cards, tilted map behind,
per-card hue floods, count-ups, chips, tap-to-skip, varied transitions. **Diverge on identity:**
1. **Whole city always in frame.** They zoom INTO isolated hood polygons; we keep SF's iconic
   compact silhouette on screen every card and glow the active hood *in context*. Signature
   difference + truer to our whole-city, three-lens thesis (and the hexbin needs the whole city).
2. **Calmer, cartographic camera** — gentle orbit/tilt/parallax + a subtle lean toward the active
   hood, not big zoom-cuts.
3. **Motifs that are ours** (data they never had): 3D hexbin coverage build-up, three-lens VS,
   Tenderloin observer-toggle.
4. **Our palette** (SF landmarks: fog/bay/presidio/cable-car) vs their neon.
5. **Our thesis** (how we measure streets) vs per-person superlatives.

## Motion spec — confirmed from the 311wrapped recording (2026-07-23)
Studied `~/Desktop/311wrapped.mov` (frame-extracted via swift/AVFoundation). **The transitions
ARE the show — and they must VARY, not repeat one canned move.** Confirmed vocabulary:
- **Persistent tilted plane behind EVERY card** (not per-card). SF borders as faint linework;
  the active hood filled + glowing. It's a shell-level layer; cards float over it.
- **Camera varies a lot per card** — rotate, tilt, zoom, pan. Seen: whole tilted polygon (card 02),
  zoomed *way* into a single address with one pinpoint (card 04 "MAIN CHARACTER"), wider filled
  polygon (card 10). Each card = its own camera framing.
- **Continuous slow idle drift** even within a card (borders/pinpoint creep frame-to-frame) — the
  plane is never fully static.
- **Contents on a SEPARATE timeline from the map**, in a floating rounded-black panel: kicker →
  big title → count-up numbers → chips fly in staggered, independent of the camera move.
- **Hue flood AND border/glow color shift per card**, crossfading (royal → olive → blue → green →
  black+red across the reel).
- **Varied map representations:** filled-glow polygon · single pinpoint (zoomed) · 2-color
  dot-density (turf war). "Pinpoints are a nice change from the same border shape" — rotate styles.
- **Transitions vary per card:** swing/rotate, zoom-through, pan, hue-crossfade-with-content-fly.
  Implementation: manifest per card carries `camera {hood,rotate,tilt,zoom,pan}`, `mapStyle`
  (outline|filled|pins|dots), and a `transition` type; the state machine orchestrates map-camera +
  outgoing-exit + incoming-enter with overlap. `prefers-reduced-motion`: snap, no drift.
- **WebGL is now allowed for the ONE hero hexbin card only** (updated 2026-07-23; supersedes the
  original blanket no-WebGL rule). Plan: deck.gl `H3HexagonLayer`, extruded green→red columns,
  **lazy-loaded** so its ~150KB never touches the rest of the deck, with a static pre-rendered
  image fallback for `prefers-reduced-motion` / low-power. Column **height must encode the card's
  variable** (observation density on the Camera card; badness on a conditions card) and be
  captioned — a tall downtown/TL spike means "most-photographed," not "worst." Everything else
  (chips, bars, count-ups, other maps) stays CSS-3D + SVG, tiny and crisp. If the WebGL prototype
  underwhelms, fall back to faux-3D SVG hex columns with no other card affected.
- The rest: CSS-3D + SVG gets the look, tiny and crisp. Motion One orchestrates.

## Storyboard — the two-viewpoint arc (revised 2026-07-23)
Spine = **The Complaints (311) vs The Sweep (streetconditions)** — two complementary records of the
same streets (see Product thesis). The Sweep's two blind spots (where it looked / what the AI saw)
are an internal sub-arc, not top-level. Whole-city tilted map throughout (SF's silhouette always in
frame). Card content is not locked — reorder/cut as prototypes teach us.

**Built column: ✅ real visual · 🟡 text-beat placeholder · ⬜ not built.** Statuses as of 2026-07-24.
Where the build deviated from this original storyboard, the *As built* note says how.
**NAMING (2026-07-24): VP2 renamed "The Sweep" → "The Snapshots"** (pairs with "The Complaints";
reported-vs-observed). Older "Sweep"/"Sweep-severe" shorthand elsewhere in this doc = the Snapshots.
Origin/purpose now told across cards 2→3 (311 is blind to the baseline → a city worker built a 2nd
record to photograph the "most of the city is fine most days" that 311 can't hold). Research-question
honesty (over-time & time-of-day not answerable; 311-vs-Snapshots = the divergence cards) to fold into
the Caveats card when built.

**CARD/MAP OVERLAP (2026-07-24):** cards with a centered panel obscured their highlighted hood. Fix =
dock/lift: the Mission cards (disagree, loud-mission) + equity + pick get a negative `panY` so the
highlighted hood rises into the clear space above/around the panel (the Snapshots-hexbin already lifts;
card 5/sergeant already did this; Bayview/quiet already pokes out at the bottom). Equity floods teal, so
its Bayview highlight was lightened (`teal 45% white`) to read against the flood.

**MOBILE (2026-07-27):** base `.panel` used `inline-size: min(38ch, 92vw)` — `92vw` ignores the card's
own padding, so on phones the panel (38ch≈383px, or 92vw) exceeded the content box and overflowed right.
Fixed → `min(38ch, 100%)` (100% = padded content box). All other card panels already used `100%`. Every
card type verified in portrait at 500px (panels dock bottom, map/hexbin fills above). NOTE: Chrome
headless clamps innerWidth≥500, so true phone widths (≤414) couldn't be screenshotted — the `100%`
constraint guarantees no overflow, but spot-check on a device/devtools emulation.

**FIXES (2026-07-24):** (1) **Backward-nav blank** — cards are appended in first-visit order, so DOM
order ≠ nav order and the outgoing card painted over the backward target. Fixed: `base-card.activate()`
bumps `z-index` each activation so the incoming card is always on top (`CardBase._z`). (2) **Slide-4
delay** — the WebGL hero lazy-loaded deck.gl+h3 on first view; now `hexbin-webgl.preload()` warms both
on idle from boot (skipped if `?hexbin=svg`). **OPEN:** sergeant dot color (user preferred earlier
maroon-bg + lighter dot for the "light in the fog" feel — currently `ink` hue); full **mobile/small-
screen pass** still needed.

| # | Built | Card | Archetype (visual) | As built / honesty note |
|---|-------|------|--------------------|-------------------------|
| 0 | ✅ | Overture — "Two ways to see a street" | title + dual count-up | **Photos lead** (6,094 street photos — AI-analyzed, every block good or bad) then 167,819 complaints; same window. Photos-first because the piece is about the snapshots; "AI-analyzed" distinguishes them from 311's photo attachments. |
| 1 | ✅ | **The Complaints** (VP1) | complaint **choropleth** on the shared plane, count-up 167,819 | Built as a flat sand→amber choropleth (sqrt scale) + fewer→more legend. Per-number `query_url` lives on the divergence cards, not all 41 hoods here. |
| 2 | 🟡 | …but only problems (VP1 blind spot) | a map that only lights where complaints exist | Text beat, but now carries the **origin copy**: 311 is blind to the baseline → "that gap is why a city worker started a second record." Could still get a "lights only where complaints exist" viz. |
| 3 | ✅ | **The Snapshots** (VP2) | **hero hexbin (WebGL)** — whole-city severe-density | **RENAMED** from "The Sweep." hexbin hero (blue flood); 71% is a **stat chip**; body now names the **purpose** (a city worker photographing the baseline 311 can't see — anonymized, AI-scored, "most days OK"). Entrance + idle drift; SVG fallback behind the seam. |
| 4 | ✅ | A single sergeant (VP2 blind spot A) | **pulsing light in the fog** (dot map) | **CHANGED:** observer toggle + column-collapse **CUT**; now a quiet `beat` — shell tilted map, `pins` pulse on the Tenderloin, fog vignette. "949 of 1,336… one light, one route." Hue = **`tenderloin` (maroon)** with a warm coral dot (same-family, lower-contrast) for the "light in the fog" feel — the earlier `ink` flood was too stark. |
| 5 | ✅ | What it saw (VP2 blind spot B) | ranked **raw-count bars** | Headline "**Mostly, it flags graffiti**" (user: emphasize raw data, not the scoring rubric). Bars: Graffiti 503 ≫ Human Waste 8 / Sharps 2 / Fire 0. Takeaway: severe flags skew cosmetic; dangerous ones barely register. Active Drug Use callout reworded → "…never trained to recognize active drug use" (dropped "the emergency a human reads"). |
| 6 | ⬜ | Where they agree | 2-color converge on a corner | Not built (optional narrow validation). |
| 7 | ✅ | Where they disagree ⚔️ | hook beat → **Mission** & **Bayview** divergence cards | Hook is a 🟡 text beat; the two divergence cards (share-of-citywide %, live 311 links) are ✅ real. |
| 8 | ✅ | The Equity read | **Bayview ↔ Mission ↔ income** grouped bars | Built. Two Tier-1 hoods: near-equal observed-severe (93 vs 85) but Mission files **4.7×** the 311 (7,331 vs 34,714) on **~2×** income ($88k vs $147k). "311 counts who calls, not what's there — and who calls tracks income." Both hoods lit on the map (teal/gold). Income from ACS 2022 (`build/sources/income.py` → committed `data/income.json`, key via env, never stored). Citywide: income↔severe r≈−0.38, income↔311/capita r≈−0.41 (noisy → the 2-hood contrast is the hero). |
| 9 | ✅ | ~~Pick your neighborhood~~ → **Four kinds of block** | guided typology synthesis | **REWORKED** (user: guide, don't free-select). Four curated hoods mapping the 311-vs-Snapshots spectrum: **Both quiet** (Sunset), **Both loud** (SoMa), **Loud-but-calm** (Mission), **Flagged-but-quiet** (Bayview), each with its 311 + severe. Map highlights all four (teal=agree, gold=diverge). Conclusion: "records agree at the extremes; in between, complaints track who calls." Each hood shows **311 (gold) vs AI-severe (blue)** with a subtitle clarifying the comparison; rows **fly-in-stagger** on enter; map highlights teal=agree / coral=diverge. |
| 10 | ✅ | Caveats, out loud | quiet bone card | Built: light bone flood, dark text, 6 honest limits (window · AI≠person · coverage≠conditions · complaint bias · **what it can't answer: over-time / time-of-day** · both partial). Folds in the creator's research-question honesty. |
| 11 | ❌ | ~~Share~~ | canvas snapshot → exportable image | **CUT (user, 2026-07-24).** Removed from manifest + registration; deck now ends on Caveats. `share-card.js` left on disk, unimported (parked) in case it returns. |
| — | ❌ | ~~While You Slept~~ | — | At risk — batch-upload timestamp drift. |
| — | ❌ | ~~SAYS WHO?~~ | — | Cut for v1 — needs Lambda+DynamoDB. |

## Stack
Vanilla web components + Web Awesome · Motion One · inline SVG map (CSS-3D) · Vite dev ·
GitHub Pages via Actions. Reuse `../sf-neighborhood-concerns` Python build. New dir here:
`wrapped/`, self-contained for later extraction.

## Dependencies / open items
- ~~HARD BLOCKER — need SC export~~ **RESOLVED 2026-07-23.** The complete SC export is in hand
  (`SCA-export-010126-061026(in).csv`, 6,136 obs — see Data reality). The staff-vs-public spine is
  now the Camera/Algorithm/Crowd spine; project is unblocked.
- **WebGL scope — DEFERRED to prototype comparison (decided 2026-07-23).** Do NOT lock now. Build
  the hero map as a self-contained `<condition-map>` component with a renderer-agnostic interface
  (data: `[{h3,lat,lng,count,score}]` + camera params; deck.gl lazy-loaded). Then WebGL-hero ↔
  faux-3D-SVG-hero ↔ flat-SVG is a **~1-day swap of one component**, not a rewrite — prototype both
  and decide from the prototypes. The shell, other cards, and the data pipeline are renderer-agnostic
  regardless. Only "full WebGL *everywhere*" is a real (additive, opt-in, later) escalation — not a
  now-decision. **Discipline to protect: no deck.gl-isms leak into the shell.**
- Font choices (condensed display + mono) — design-critical, still TBD.
- Card 6 ("While You Slept") timestamps drift with batch uploads → **at risk**; keep only if a
  day/night split proves defensible.
- Income/demographic layer for the Equity Read (Card 9) — source TBD (ACS by tract → hood).
- **911/CFS drug data — PARKED (2026-07-23), scoped to ONE use.** The user has working pull code in
  `../intervention-evaluation` (feeds the drug metrics on
  mayor-s-office-of-innovation.github.io/intervention-evaluation). Do NOT add it as a general 4th
  lens — it muddies the clean Camera/Algorithm/Crowd framing. BUT it's the one thing that fills a
  genuine gap: **Active Drug Use is the AI's confirmed blind spot and we exclude it entirely**; a
  911 drug-call overlay could make **Card 4 (The Blind Spot)** land far harder — "the algorithm
  called this block clean; 911 drug calls lit it up." Decision deferred; revisit only for that card.

## Build phases (revised — SC data in hand, so build front-to-back on real data)
1. **Data pipeline. ✅ DONE (2026-07-23).** In `wrapped/build/`: `geo.py` (point-in-polygon),
   `sources/sc.py` (Camera+Algorithm ingest — scrub, assign, score formula, tiers, anonymized
   observers u0..uN, per-hex `n`+`n_severe`, Tenderloin exhibit), `sources/sf311.py` (Crowd puller,
   window-locked, evidence-based whitelist, `service_details` grain, live `query_url` per cell,
   admin-churn excluded), `aggregate.py` → `wrapped/data/conditions.json`. Verified: 6,094 usable
   SC obs, 167,819 comparable 311 events, 39/41 hoods both lenses, Tier 1 = the six predicted hoods.
   **Phase-2 item:** `conditions.json` is 3.3 MB (3,242 `query_url` strings). Slim for the web —
   template query_urls client-side from window+filters, and/or split citywide vs per-hood chunks.
2. **Shell + the seams. ✅ DONE (2026-07-23).** `wrapped/app/` — all six seams in place, **zero
   dependencies** (web-dev §1: native WAAPI motion registry, no Web Awesome yet, canvas Share, plain
   static ES modules). Files: `js/state.js` (thin core), `js/story.js` (manifest), `js/cards/base-card.js`
   (`onEnter/onExit` hooks), `js/motion.js` (preset registry, reduced-motion-aware), `css/tokens.css`
   (built on the user's `sf-palette.css` — AA-paired hue floods) + `cards.css`, `js/data.js` (selectors
   over conditions.json). **Card 12 (Share) built first** — bespoke portrait image composed on
   `<canvas>` + download. Plus an Overture card. A11y baked in: manual advance (no auto-carousel /
   WCAG 2.2.2; optional autoplay toggle), keyboard nav, focus mgmt, live-region announce, visible
   focus, ≥44px targets, reduced-motion snapping. Preview: serve `wrapped/` statically, open `/app/`.
   Verified: JS syntax clean, all assets + data path 200. **Deferred:** Motion One / Web Awesome /
   Vite stay swappable behind the seams; 3.3 MB payload trim (per-hood chunks / templated urls).
2b. **Tilted map plane + 2-viewpoint slice + transitions. ✅ DONE (2026-07-23).**
   `build/make_map.py` → `data/sf_map.json` (projected+simplified SVG paths, per-hood centroids,
   **piers retained** at eps 0.35 — confirmed present, no overlay needed). `app/js/condition-map.js`
   = persistent tilted CSS-3D plane behind all cards (**whole-city framing** — SF silhouette always
   in frame, camera *leans* toward the active hood, never zooms into it; styles: outline/filled/pins;
   idle drift; `panY` screen-lift; camera params per card in the manifest). `state.js` orchestrates
   the between-card transition (camera swing + overlap exit/enter) — **the transition IS the show**,
   ~750ms, varied rotate/tilt per card. `beat-card.js` = generic panel card (kicker/title/stat/body,
   `align` for low panel). Manifest = the **two-viewpoint arc** (Overture → Complaints → only-problems
   → Sweep → where-it-looked/sergeant-pins → what-it-saw → disagree → Share). Fixes landed: back/forward
   race (generation guard), overflow-proofing (panel definite width + cqi numbers + overflow-wrap),
   panel dark-glass = always light text (contrast), no "wrapped" in UI, toned-down + accuracy-corrected
   copy. **NEXT: the two divergence follow-up beats (Mission loud-but-calm; Bayview quiet-but-not-fine),
   then turn beat placeholders into real visuals** (Complaints choropleth, Sweep 71% gauge, hexbin).
3. **The hero: Card 1 (The Camera).** WebGL extruded hexbin (deck.gl, lazy-loaded) + static
   fallback + the CSS-3D tilted-plane camera move. Prove the signature moment early.
4. **The Algorithm + Crowd lenses.** Cards 3–5 (flat-rubric gauge, the blind-spot beat, 311
   complaint map). `crosswalk.json` **✅ DONE early (2026-07-23)** — `wrapped/build/crosswalk.py`,
   validated at label grain: **95% (158,711/167,819) of comparable 311 events mapped**, 7 SC
   categories mapped, 4 legitimately unmapped (RV, Fire & Safety, Animals, Public Health Need),
   Active Drug Use excluded. Unmapped 311 buckets are exactly the right ones (pavement defects,
   can-maintenance, illegal postings). Wired into `conditions.json` with **`reviewed: false` —
   a human (ideally the creator) should sign off the mapping before any head-to-head card ships.**
   **Reviewed & approved 2026-07-23** (`reviewed: true`) — mappings accepted as-is including the
   judgment calls (scooters→Access Obstruction; can-overflow/spills→Waste). VS cards unblocked.
   Review aid: `wrapped/build/crosswalk_review.py` → `crosswalk_review.md`. Full data layer
   rebuilds via `python3 wrapped/build/build_all.py`.
5. **The spine: divergence + exhibit.** Cards 6–8 (agree / disagree VS / Tenderloin observer toggle)
   — the comparison, valid only on Camera-covered blocks.
6. **Frame + finish.** Cards 0 (Overture), 2 (Who Held the Phone), 9 (Equity), 10 (Pick Your
   Neighborhood), 11 (Caveats). Then a11y + contrast pass and the `dashboard-review` skill.
