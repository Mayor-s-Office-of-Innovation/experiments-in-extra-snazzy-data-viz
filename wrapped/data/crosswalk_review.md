# Crosswalk review

> Generated from `crosswalk.json` (reviewed: **True**). Coverage: **95%** of comparable 311 volume mapped (158,711/167,819).

**How to review:** (1) focus on ⚠️ JUDGMENT rows — the obvious ✅ ones need no attention. (2) scan each category for a 311 label that does NOT belong (false include). (3) scan the Unmapped section for anything that SHOULD map (false exclude). (4) for any ⚠️, open its query link and read a few real records. Ask only: *are these measuring the same on-street phenomenon?*

## Mapped categories

### Waste & Small Debris — 64,138 311 events

> ⚠️ **Review note:** Litter Receptacle Maintenance deliberately excluded — can upkeep (add/remove/repair/toters), not observed debris. The real overflow signal is Street & Sidewalk Cleaning/city_garbage_can_overflowing, included above.

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Street and Sidewalk Cleaning | other_loose_garbage_debris_yard_waste | 37,198 | ✅ |
| Street and Sidewalk Cleaning | other_bagged_boxed_contained_garbage | 15,783 | ✅ |
| Street and Sidewalk Cleaning | city_garbage_can_overflowing | 6,897 | ⚠️ judgment |
| Street and Sidewalk Cleaning | glass | 1,893 | ✅ |
| Street and Sidewalk Cleaning | transit_shelter_platform | 936 | ⚠️ judgment |
| Street and Sidewalk Cleaning | oil_paint_other_liquid_spill_wet | 869 | ⚠️ judgment |
| Street and Sidewalk Cleaning | other_contained_hazardous_waste | 381 | ⚠️ judgment |
| Street and Sidewalk Cleaning | auto_accident_debris | 93 | ✅ |
| Street and Sidewalk Cleaning | event_parade_mess | 88 | ✅ |

- ⚠️ **city_garbage_can_overflowing** — Overflow = city-can upkeep or observed street debris? Included as debris; arguable.
  - spot-check: https://data.sfgov.org/resource/vw6y-z8j6.json?%24where=requested_datetime+%3E%3D+%272026-01-30T00%3A00%3A00%27+AND+requested_datetime+%3C+%272026-06-09T00%3A00%3A00%27+AND+analysis_neighborhood+IS+NOT+NULL+AND+service_name+IN+%28%27Street+and+Sidewalk+Cleaning%27%2C+%27Graffiti+Public%27%2C+%27Graffiti+Private%27%2C+%27Encampment%27%2C+%27Blocked+Street+and+Sidewalk%27%2C+%27Sidewalk+and+Curb%27%2C+%27Litter+Receptacle+Maintenance%27%2C+%27Illegal+Postings%27%29+AND+analysis_neighborhood+%3D+%27Mission%27+AND+service_name+%3D+%27Street+and+Sidewalk+Cleaning%27+AND+service_subtype+%3D+%27garbage_and_debris%27+AND+service_details+%3D+%27city_garbage_can_overflowing%27&%24order=requested_datetime+DESC&%24limit=1000
- ⚠️ **transit_shelter_platform** — Debris at a transit shelter — is that what the AI means by small debris?
  - spot-check: https://data.sfgov.org/resource/vw6y-z8j6.json?%24where=requested_datetime+%3E%3D+%272026-01-30T00%3A00%3A00%27+AND+requested_datetime+%3C+%272026-06-09T00%3A00%3A00%27+AND+analysis_neighborhood+IS+NOT+NULL+AND+service_name+IN+%28%27Street+and+Sidewalk+Cleaning%27%2C+%27Graffiti+Public%27%2C+%27Graffiti+Private%27%2C+%27Encampment%27%2C+%27Blocked+Street+and+Sidewalk%27%2C+%27Sidewalk+and+Curb%27%2C+%27Litter+Receptacle+Maintenance%27%2C+%27Illegal+Postings%27%29+AND+analysis_neighborhood+%3D+%27Mission%27+AND+service_name+%3D+%27Street+and+Sidewalk+Cleaning%27+AND+service_subtype+%3D+%27garbage_and_debris%27+AND+service_details+%3D+%27transit_shelter_platform%27&%24order=requested_datetime+DESC&%24limit=1000

### Furniture & Large Debris — 20,642 311 events

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Street and Sidewalk Cleaning | furniture | 12,246 | ✅ |
| Street and Sidewalk Cleaning | mattress | 3,968 | ✅ |
| Street and Sidewalk Cleaning | electronics | 1,828 | ✅ |
| Street and Sidewalk Cleaning | refrigerator_appliance | 1,485 | ✅ |
| Street and Sidewalk Cleaning | shopping_cart | 1,030 | ✅ |
| Street and Sidewalk Cleaning | tires_less_than_10 | 85 | ✅ |

### Human and Animal Waste — 18,074 311 events

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Street and Sidewalk Cleaning | human_waste_or_urine | 18,074 | ✅ |

### Sharps — 890 311 events

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Street and Sidewalk Cleaning | needles_less_than_20 | 890 | ✅ |
| Street and Sidewalk Cleaning | needles_20_or_more | 0 | ✅ |

### Unsheltered Presence — 13,295 311 events

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Encampment | encampment | 11,939 | ✅ |
| Encampment | (none) | 1,356 | ✅ |

### Access Obstruction — 5,639 311 events

> ⚠️ **Review note:** Blocked Street & Sidewalk is scooter/merchandise/construction-heavy; confirm the AI flags those as obstruction. Sidewalk & Curb (pavement defects) deliberately NOT included — surface damage, not obstruction.

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Blocked Street and Sidewalk | lime_standing_scooter | 1,997 | ⚠️ judgment |
| Blocked Street and Sidewalk | scooter_without_license_plate | 783 | ⚠️ judgment |
| Blocked Street and Sidewalk | spin_standing_scooter | 699 | ⚠️ judgment |
| Blocked Street and Sidewalk | display_merchandise | 470 | ⚠️ judgment |
| Blocked Street and Sidewalk | construction_equipment | 387 | ⚠️ judgment |
| Blocked Street and Sidewalk | construction_materials | 158 | ⚠️ judgment |
| Blocked Street and Sidewalk | other_scooter_bike | 158 | ⚠️ judgment |
| Blocked Street and Sidewalk | cafe_table_and_chairs | 155 | ⚠️ judgment |
| Blocked Street and Sidewalk | dumpster | 142 | ⚠️ judgment |
| Blocked Street and Sidewalk | lime_seated_scooter | 126 | ⚠️ judgment |
| Blocked Street and Sidewalk | blocked_sidewalk | 110 | ⚠️ judgment |
| Blocked Street and Sidewalk | a_frame_construction | 94 | ⚠️ judgment |
| Blocked Street and Sidewalk | tree_shrub_bush_privately_maintained | 89 | ⚠️ judgment |
| Blocked Street and Sidewalk | port_a_potty | 78 | ⚠️ judgment |
| Blocked Street and Sidewalk | residential_totter | 73 | ⚠️ judgment |
| Blocked Street and Sidewalk | a_frame | 58 | ⚠️ judgment |
| Blocked Street and Sidewalk | mobile_storage_container | 28 | ⚠️ judgment |
| Blocked Street and Sidewalk | scaffolding | 22 | ⚠️ judgment |
| Blocked Street and Sidewalk | bench | 6 | ⚠️ judgment |
| Blocked Street and Sidewalk | news_rack | 4 | ⚠️ judgment |
| Blocked Street and Sidewalk | spin_seated_scooter | 1 | ⚠️ judgment |
| Blocked Street and Sidewalk | large_vehicle | 1 | ⚠️ judgment |

- ⚠️ **lime_standing_scooter** — Blocked Street & Sidewalk is ~55% dockless scooters (lime/spin) + merchandise/construction. Does the AI photo-score flag these as obstruction? If not, this comparison is apples-to-oranges.
  - spot-check: https://data.sfgov.org/resource/vw6y-z8j6.json?%24where=requested_datetime+%3E%3D+%272026-01-30T00%3A00%3A00%27+AND+requested_datetime+%3C+%272026-06-09T00%3A00%3A00%27+AND+analysis_neighborhood+IS+NOT+NULL+AND+service_name+IN+%28%27Street+and+Sidewalk+Cleaning%27%2C+%27Graffiti+Public%27%2C+%27Graffiti+Private%27%2C+%27Encampment%27%2C+%27Blocked+Street+and+Sidewalk%27%2C+%27Sidewalk+and+Curb%27%2C+%27Litter+Receptacle+Maintenance%27%2C+%27Illegal+Postings%27%29+AND+analysis_neighborhood+%3D+%27Mission%27+AND+service_name+%3D+%27Blocked+Street+and+Sidewalk%27+AND+service_subtype+%3D+%27blocked_sidewalk%27+AND+service_details+%3D+%27lime_standing_scooter%27&%24order=requested_datetime+DESC&%24limit=1000

### Graffiti — 36,033 311 events

| 311 service_name | label | events | flag |
|---|---|--:|---|
| Graffiti Public | pole | 9,191 | ✅ |
| Graffiti Private | building_commercial | 5,286 | ✅ |
| Graffiti Public | signal_box | 2,650 | ✅ |
| Graffiti Public | other | 2,350 | ✅ |
| Graffiti Public | sidewalk_structure | 2,307 | ✅ |
| Graffiti Private | sidewalk_in_front_of_property | 1,961 | ✅ |
| Graffiti Public | mail_box | 1,718 | ✅ |
| Graffiti Private | building_residential | 1,592 | ✅ |
| Graffiti Private | building_other | 1,422 | ✅ |
| Graffiti Public | street | 1,418 | ✅ |
| Graffiti Public | transit_shelter_platform | 1,133 | ✅ |
| Graffiti Public | sidewalk_in_front_of_property | 938 | ✅ |
| Graffiti Public | fire_hydrant | 823 | ✅ |
| Graffiti Public | city_receptacle | 709 | ✅ |
| Graffiti Public | fire_police_callbox | 673 | ✅ |
| Graffiti Public | bike_rack | 530 | ✅ |
| Graffiti Public | bridge | 528 | ✅ |
| Graffiti Public | att_property | 356 | ✅ |
| Graffiti Public | parking_meter | 297 | ✅ |
| Graffiti Public | news_rack | 106 | ✅ |
| Graffiti Public | sign | 24 | ✅ |
| Graffiti Public | building_other | 8 | ✅ |
| Graffiti Public | building_commercial | 7 | ✅ |
| Graffiti Public | building_residential | 5 | ✅ |
| Graffiti Private | mail_box | 1 | ✅ |

## Unmapped 311 buckets — confirm these SHOULD stay out

These have no clean SC equivalent. Skim for anything you think belongs to a category above.

| bucket | events |
|---|--:|
| Sidewalk and Curb/pavement_defect | 1,458 |
| Litter Receptacle Maintenance/other_including_abandoned_toter | 1,282 |
| Litter Receptacle Maintenance/toters_left_out_24x7 | 930 |
| Sidewalk and Curb/collapsed_sidewalk | 748 |
| Sidewalk and Curb/lifted_sidewalk_tree_roots | 494 |
| Sidewalk and Curb/lifted_sidewalk_other | 480 |
| Illegal Postings/affixed_improperly | 464 |
| Sidewalk and Curb/curb_or_curb_ramp_defect | 463 |
| Sidewalk and Curb/other | 437 |
| Litter Receptacle Maintenance/door_lock_issue | 334 |
| Sidewalk and Curb/missing_side_sewer_vent_cover | 251 |
| Litter Receptacle Maintenance/transit_shelter_platform | 235 |
| Litter Receptacle Maintenance/add_garbage_can | 220 |
| Litter Receptacle Maintenance/liner_issue_damaged_missing | 195 |
| Litter Receptacle Maintenance/other_garbage_can_repair | 187 |
| Illegal Postings/multiple_postings | 175 |
| Sidewalk and Curb/damaged_side_sewer_vent_cover | 173 |
| Litter Receptacle Maintenance/remove_garbage_can | 110 |
| Litter Receptacle Maintenance/tipped_over | 105 |
| Sidewalk and Curb/manhole_cover_off | 68 |

## Excluded by design

- **Active Drug Use** — AI vision model cannot reliably detect hidden/fold drug use (confirmed by the tool creator). Never comparable.

## Decisions to record

- [ ] Access Obstruction: keep scooters/merchandise, or narrow to blocked_sidewalk only?
- [ ] Waste: keep `city_garbage_can_overflowing`, `transit_shelter_platform`, spills/hazwaste?
- [ ] Any unmapped bucket that should map (esp. Sidewalk & Curb defects → a hazard category)?
- [ ] Sign off → set `reviewed: true` in crosswalk.py and rebuild.
