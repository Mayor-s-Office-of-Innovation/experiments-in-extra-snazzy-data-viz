#!/usr/bin/env python3
"""Category crosswalk — the one genuine analytical task (plan.md).

Maps each streetconditions (SC) category to the SF311 (service_name, service_details)
cells that represent the same on-street condition. Comparisons between the Camera/
Algorithm lens and the Crowd lens are valid ONLY through this table, ONLY on blocks the
Camera covered, and NEVER for Active Drug Use (the AI's confirmed blind spot).

This file IS the reviewable artifact: it emits crosswalk.json with `reviewed: false` and a
coverage report (how much 311 comparable volume each SC category captures, and what stays
unmapped). A human should review the mapping before any head-to-head card ships.

Matching rule per SC category = a list of matchers:
  {"service_name": X}                    -> every cell of that service_name
  {"service_name": X, "labels": [l1,...]} -> only those labels (coalesced
      service_details or service_subtype — the grain the 311 pull buckets on)

Run:  python3 wrapped/build/crosswalk.py   (after sf311.py)
"""
import json
from collections import defaultdict
from pathlib import Path

BUILD = Path(__file__).resolve().parent
DATA = BUILD.parent / 'data'
SF311 = DATA / 'sf311.json'
OUT = DATA / 'crosswalk.json'

EXCLUDED = {
    'Active Drug Use': 'AI vision model cannot reliably detect hidden/fold drug use '
                       '(confirmed by the tool creator). Never comparable.',
}

# SC category -> list of 311 matchers. Ordered by SC display order.
CROSSWALK = {
    'RV or other inhabited vehicle': {'matchers': [], 'unmapped_reason':
        '311 has no "inhabited vehicle" concept; Abandoned Vehicle lives under Parking '
        'Enforcement (out of scope) and is not the same as a lived-in RV.'},
    'Waste & Small Debris': {'matchers': [
        {'service_name': 'Street and Sidewalk Cleaning', 'labels': [
            'other_loose_garbage_debris_yard_waste', 'other_bagged_boxed_contained_garbage',
            'glass', 'city_garbage_can_overflowing', 'oil_paint_other_liquid_spill_wet',
            'other_contained_hazardous_waste', 'auto_accident_debris', 'event_parade_mess',
            'transit_shelter_platform']},
    ], 'review_note': 'Litter Receptacle Maintenance deliberately excluded — can upkeep '
                      '(add/remove/repair/toters), not observed debris. The real overflow signal '
                      'is Street & Sidewalk Cleaning/city_garbage_can_overflowing, included above.'},
    'Furniture & Large Debris': {'matchers': [
        {'service_name': 'Street and Sidewalk Cleaning', 'labels': [
            'furniture', 'mattress', 'electronics', 'refrigerator_appliance',
            'shopping_cart', 'tires_less_than_10']},
    ]},
    'Human and Animal Waste': {'matchers': [
        {'service_name': 'Street and Sidewalk Cleaning', 'labels': ['human_waste_or_urine']},
    ]},
    'Sharps': {'matchers': [
        {'service_name': 'Street and Sidewalk Cleaning',
         'labels': ['needles_less_than_20', 'needles_20_or_more']},  # _20_or_more absent this window (ok)
    ]},
    'Unsheltered Presence': {'matchers': [{'service_name': 'Encampment'}]},
    'Fire & Safety Hazards': {'matchers': [], 'unmapped_reason':
        'No 311 service captures a photo-visible fire/safety hazard as such.'},
    'Access Obstruction': {'matchers': [{'service_name': 'Blocked Street and Sidewalk'}],
        'review_note': 'Blocked Street & Sidewalk is scooter/merchandise/construction-heavy; '
                       'confirm the AI flags those as obstruction. Sidewalk & Curb (pavement '
                       'defects) deliberately NOT included — surface damage, not obstruction.'},
    'Active Drug Use': {'matchers': [], 'excluded': True, 'unmapped_reason': EXCLUDED['Active Drug Use']},
    'Public Health Need': {'matchers': [], 'unmapped_reason':
        'Broad SC acuity signal with no discrete 311 equivalent.'},
    'Animals': {'matchers': [], 'unmapped_reason':
        'Animal issues route to Animal Care & Control (separate dataset), not this 311 feed.'},
    'Graffiti': {'matchers': [
        {'service_name': 'Graffiti Public'}, {'service_name': 'Graffiti Private'}]},
}


def cell_matches(cell, matcher):
    if cell['service_name'] != matcher['service_name']:
        return False
    if 'labels' in matcher:
        return cell.get('label', '') in matcher['labels']
    return True


def main():
    sf = json.loads(SF311.read_text())
    # citywide label universe: (service_name, label) -> count  (label = the pull's grain)
    universe = defaultdict(int)
    for hood in sf['neighborhoods'].values():
        for c in hood['cells']:
            universe[(c['service_name'], c.get('label', ''))] += c['count']
    total_311 = sum(universe.values())

    # validate + score
    mapped_keys = set()
    report = {}
    absent_refs = []   # referenced label not in THIS window (benign — contributes 0)
    for cat, spec in CROSSWALK.items():
        mapped = 0
        for m in spec['matchers']:
            if 'labels' in m:
                for lbl in m['labels']:
                    if (m['service_name'], lbl) not in universe:
                        absent_refs.append((cat, m['service_name'], lbl))
            for (sn, lbl), n in universe.items():
                if cell_matches({'service_name': sn, 'label': lbl}, m):
                    mapped += n
                    mapped_keys.add((sn, lbl))
        report[cat] = {'mapped_311_events': mapped, 'excluded': spec.get('excluded', False)}

    unmapped = {f"{sn}/{lbl or '(none)'}": n for (sn, lbl), n in universe.items()
                if (sn, lbl) not in mapped_keys}
    mapped_total = sum(r['mapped_311_events'] for r in report.values())

    out = {
        'schema_version': 1,
        'reviewed': True,
        'reviewed_note': 'Approved 2026-07-23 as-is, including the judgment calls '
                         '(scooters/merchandise -> Access Obstruction; city_garbage_can_overflowing '
                         'and transit_shelter/spills/hazwaste -> Waste & Small Debris).',
        'note': 'SC category -> SF311 (service_name, service_details). Comparisons valid only '
                'through this table, only on Camera-covered blocks, never for Active Drug Use.',
        'excluded_categories': EXCLUDED,
        'crosswalk': CROSSWALK,
        'coverage': {
            'total_311_comparable_events': total_311,
            'mapped_311_events': mapped_total,
            'mapped_share': round(mapped_total / total_311, 3),
            'unmapped_labels': dict(sorted(unmapped.items(), key=lambda kv: -kv[1])),
        },
    }
    OUT.write_text(json.dumps(out, indent=2) + '\n')

    print(f"Wrote {OUT.relative_to(BUILD.parent.parent)} ({OUT.stat().st_size:,} bytes)")
    if absent_refs:
        print("  note: referenced labels absent this window (benign, contribute 0):")
        for cat, sn, lbl in absent_refs:
            print(f"      {cat}: {sn}/{lbl}")
    else:
        print("  ✓ every referenced 311 label exists in the data")
    print(f"\n  311 comparable events mapped: {mapped_total:,}/{total_311:,} "
          f"({100*mapped_total/total_311:.0f}%)")
    print("  Per SC category (citywide 311 events captured):")
    for cat, r in report.items():
        tag = ' [EXCLUDED]' if r['excluded'] else (' [unmapped]' if r['mapped_311_events'] == 0 else '')
        print(f"    {r['mapped_311_events']:>7,}  {cat}{tag}")
    print("\n  Largest UNMAPPED 311 buckets (no SC equivalent / not comparable):")
    for lbl, n in list(out['coverage']['unmapped_labels'].items())[:8]:
        print(f"    {n:>7,}  {lbl}")


if __name__ == '__main__':
    main()
