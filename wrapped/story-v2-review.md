# story-v2 — dashboard review (2026-09-09)

Audit of `/app2/` (the pitch deck) per the dashboard-review skill. Inventory taken from the live
DOM; every figure re-verified against `wrapped/data/v2/conditions.json` (the primary source this
deck ships) before findings were written.

**Figure trace: ALL PASS.** 6,094 photos · 167,819 complaints · 335/492 obs · 64%/61% issue ·
93/85 severe · 7,331/34,714 (4.7×) · 43% clean (2,617/6,094) · 4-of-8 example hex — every displayed
number matches the bake exactly. No card displays a number that differs between slides.

**2026-09-11 renumbering:** slides 3+4 merged into one 311 card and the plain background map
dropped on two slides — the deck is 8 slides now. Slide references below reflect the
**pre-merge** deck; open findings 3–7 map to slides 3/4/4/5/2 of the new deck respectively
(denominator example → 5, bar labels → 4, blocks chip → 2). All figures unchanged.

## Ranked findings

| # | finding | dimension | severity | status |
|---|---------|-----------|----------|--------|
| 1 | **No source links anywhere in v2.** v1's provenance discipline (3,283 live `query_url`s) was stripped from the v2 data slice for speed; no card carries any link. A skeptic can't check 167,819 or 4.7× from the deck itself. | 4 (source links) | HIGH | **Resolved 2026-09-09** — per-card footer link "figures: source & method" → `app2/sources.md#slide-N` (anchor document with per-slide derivations, both dataset sources incl. live Socrata link, scrub + honesty notes). v1 unaffected; `data-no-advance` so tapping doesn't advance the deck. |
| 2 | **Date window only on slide 1.** Slides 2/6 show counts (167,819 / 43% / 6,094) with no "Jan 30–Jun 8" qualifier visible; a reader who enters via deep-link (`#insight2`) sees no window at all. | 3 (recency) | MEDIUM | **Resolved 2026-09-09** — the provenance footer on every card now carries the window: "figures: source & method · Jan 30 – Jun 8, 2026". Every figure is date-stamped at the card level. |
| 3 | Slide 5's example block is real (hex `8a28308284affff`) but the card doesn't say so — "One block, 8 visits" reads as an illustrative example. That's *more* verifiable than it claims to be. | 1 (primary-source) | LOW | Open — one-line caption fix |
| 4 | Slide 5 right label says "the Mission's rate would go here" but the count shown (34,714) is Mission's — correct — while the left example is a SoMa-adjacent block. Pairing an SoMa example with a Mission count on one slide invites a same-neighborhood misread. | 2 (population integrity) | MEDIUM | Open — reword label or pick a Mission hex |
| 5 | Slide 8 bullet 4 crams six agencies into one item ("For DPH/RRT, DPW… — continuous insight…"); reads as a run-on vs the crisp three above it. | 8 (cognitive load) | LOW | Open — optional split |
| 6 | "Found an issue" bar label (slide 4) describes a *rate* (64%/61%) but the row shows a percent without saying "of visits with photos" — the label says "found an issue" only. | 6 (referent legibility) | LOW | Open — label tweak |
| 7 | Chip "2,238 blocks" (slide 1) counts hexes; strictly, hexes ≈ block faces, and some blocks have multiple hexes. Team doc uses the same framing ("2,239 blocks, roughly one block face") — defensible, but "blocks" is doing slight work. | 2 (denominator) | LOW | Open — keep or say "hexes" |

## Verified clean (no action)
- All 10 figures trace to `v2/conditions.json` (numbers above).
- Tone: titles are findings, not advocacy — matches the agreed title rule. No intensifiers found
  ("only/just/even" absent from all card copy).
- Headline–data fidelity: each title describes its card's content ("Where staff looked" over the
  coverage map; "A lot of streets are clean" over the clean-share viz) — no promise/content mismatches.
- No truncated axes, no 3D tricks; bar lengths proportional (verified: Bayview 7,331 bar = 21% of
  Mission's, matching 7,331/34,714).
- Date window present once (slide 1); counts consistent across cards (no same-metric conflicts).
