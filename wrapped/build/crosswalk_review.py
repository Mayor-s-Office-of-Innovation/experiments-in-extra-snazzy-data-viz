#!/usr/bin/env python3
"""Generate crosswalk_review.md — a human-friendly review aid for crosswalk.json.

Renders each SC category with its mapped 311 labels + citywide volume, flags the
judgment calls (vs obvious mappings), lists the unmapped buckets to confirm, and
embeds live query_urls for spot-checking debatable calls against real 311 records.
Regenerate after any mapping edit. Run: python3 wrapped/build/crosswalk_review.py
"""
import json
from collections import defaultdict
from pathlib import Path

BUILD = Path(__file__).resolve().parent
DATA = BUILD.parent / 'data'
CW = json.loads((DATA / 'crosswalk.json').read_text())
SF = json.loads((DATA / 'sf311.json').read_text())
OUT = DATA / 'crosswalk_review.md'

# Labels that were a genuine judgment call (not an obvious 1:1). Reviewer should focus here.
JUDGMENT = {
    ('Access Obstruction', None): 'Blocked Street & Sidewalk is ~55% dockless scooters '
        '(lime/spin) + merchandise/construction. Does the AI photo-score flag these as '
        'obstruction? If not, this comparison is apples-to-oranges.',
    ('Waste & Small Debris', 'city_garbage_can_overflowing'): 'Overflow = city-can upkeep or '
        'observed street debris? Included as debris; arguable.',
    ('Waste & Small Debris', 'transit_shelter_platform'): 'Debris at a transit shelter — is that '
        'what the AI means by small debris?',
    ('Waste & Small Debris', 'oil_paint_other_liquid_spill_wet'): 'Liquid spill — waste or a '
        'safety hazard? We call it waste.',
    ('Waste & Small Debris', 'other_contained_hazardous_waste'): 'Hazardous waste — waste bucket, '
        'or its own thing?',
}

# citywide counts by (service_name, label)
uni = defaultdict(int)
url_ex = {}
for hood in SF['neighborhoods'].values():
    for c in hood['cells']:
        key = (c['service_name'], c.get('label', ''))
        uni[key] += c['count']
        url_ex.setdefault(key, c['query_url'])   # a real live link to spot-check

lines = []
w = lines.append
w('# Crosswalk review\n')
w(f"> Generated from `crosswalk.json` (reviewed: **{CW['reviewed']}**). "
  f"Coverage: **{CW['coverage']['mapped_share']*100:.0f}%** of comparable 311 volume mapped "
  f"({CW['coverage']['mapped_311_events']:,}/{CW['coverage']['total_311_comparable_events']:,}).\n")
w("**How to review:** (1) focus on ⚠️ JUDGMENT rows — the obvious ✅ ones need no attention. "
  "(2) scan each category for a 311 label that does NOT belong (false include). "
  "(3) scan the Unmapped section for anything that SHOULD map (false exclude). "
  "(4) for any ⚠️, open its query link and read a few real records. "
  "Ask only: *are these measuring the same on-street phenomenon?*\n")

w('## Mapped categories\n')
for cat, spec in CW['crosswalk'].items():
    if spec.get('excluded') or not spec['matchers']:
        continue
    # collect the labels this category captures + counts
    caught = []
    for m in spec['matchers']:
        if 'labels' in m:
            for lbl in m['labels']:
                n = uni.get((m['service_name'], lbl), 0)
                caught.append((m['service_name'], lbl, n))
        else:
            for (sn, lbl), n in uni.items():
                if sn == m['service_name']:
                    caught.append((sn, lbl, n))
    caught.sort(key=lambda t: -t[2])
    total = sum(n for _, _, n in caught)
    w(f"### {cat} — {total:,} 311 events\n")
    if 'review_note' in spec:
        w(f"> ⚠️ **Review note:** {spec['review_note']}\n")
    w('| 311 service_name | label | events | flag |')
    w('|---|---|--:|---|')
    for sn, lbl, n in caught:
        jkey = (cat, lbl) if (cat, lbl) in JUDGMENT else ((cat, None) if (cat, None) in JUDGMENT else None)
        flag = '⚠️ judgment' if jkey else '✅'
        w(f"| {sn} | {lbl or '(none)'} | {n:,} | {flag} |")
    w('')
    # embed spot-check links for judgment calls
    jrows = [(sn, lbl, n) for sn, lbl, n in caught
             if (cat, lbl) in JUDGMENT or ((cat, None) in JUDGMENT and n == max(x[2] for x in caught))]
    for sn, lbl, n in jrows[:2]:
        note = JUDGMENT.get((cat, lbl)) or JUDGMENT.get((cat, None))
        w(f"- ⚠️ **{lbl or sn}** — {note}")
        w(f"  - spot-check: {url_ex.get((sn, lbl), '(no link)')}")
    if jrows:
        w('')

w('## Unmapped 311 buckets — confirm these SHOULD stay out\n')
w('These have no clean SC equivalent. Skim for anything you think belongs to a category above.\n')
w('| bucket | events |')
w('|---|--:|')
for lbl, n in list(CW['coverage']['unmapped_labels'].items())[:20]:
    w(f"| {lbl} | {n:,} |")
w('')

w('## Excluded by design\n')
for cat, reason in CW['excluded_categories'].items():
    w(f"- **{cat}** — {reason}\n")

w('## Decisions to record\n')
w('- [ ] Access Obstruction: keep scooters/merchandise, or narrow to blocked_sidewalk only?')
w('- [ ] Waste: keep `city_garbage_can_overflowing`, `transit_shelter_platform`, spills/hazwaste?')
w('- [ ] Any unmapped bucket that should map (esp. Sidewalk & Curb defects → a hazard category)?')
w('- [ ] Sign off → set `reviewed: true` in crosswalk.py and rebuild.')

OUT.write_text('\n'.join(lines) + '\n')
print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes)")
