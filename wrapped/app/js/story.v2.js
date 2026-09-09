// Story v2 — the internal pitch deck (city-employee audience). Selected via ?story=v2 in main.js.
// Mirrors updated-story.md + plan-story-v2.md, with OUR validated numbers (locked window
// 2026-01-30 → 2026-06-08). Title rule: findings, not campaigning.
//
// Types not yet built (barpair/denominator/paleout/applications) ride `beat` placeholders until
// their phase lands — same walkable-placeholder approach v1 used.

export const story = [
  {
    id: 'questions', type: 'overture', hue: 'ink',
    kicker: 'SF Street Conditions Pilot', title: 'What we set out to answer',
    foot: 'In early 2026, staff piloted a new way to observe street conditions. We compared what it saw against 311 over the same five months.',
    questions: [
      'Can we produce a valid baseline of street conditions — comparable across time and place?',
      'Does the app data tell us anything 311 can’t?',
      'Can these data inform policy and operations?',
    ],
    map: { rotate: -8, tilt: 50, style: 'outline' },
  },

  // ---- The Street Conditions App (coverage hero) ----
  {
    id: 'the-app', type: 'hexbin', hue: 'camera', mode: 'coverage', align: 'end',
    kicker: 'The Street Conditions App', title: 'Where staff looked',
    chip: { big: '6,094', label: 'photos' },
    chip2: { big: '2,238', label: 'blocks' },
    body: 'Staff walked routes and photographed what they saw. An AI scored every photo on 12 categories. Coverage concentrated in SoMa and the Tenderloin.',
    caption: 'Each hex ≈ 76 m across. Height = number of visits.',
    map: { rotate: 10, tilt: 56 },
  },

  // ---- 311 ----
  {
    id: 'three11', type: 'choropleth', hue: 'crowd', align: 'end',
    kicker: '311',
    stat: { label: 'complaints filed by the public' },
    map: { rotate: -12, tilt: 50, style: 'choropleth' },
  },
  {
    id: 'limits', type: 'beat', hue: 'crowd', align: 'end', drain: true,
    kicker: 'The blind spots', title: 'What 311 can’t do',
    items: [
      { t: 'No denominator.', d: '50 cases may mean a bad block — or a well-documented one.' },
      { t: 'It can’t record a clean street.', d: 'Silence isn’t evidence.' },
    ],
    map: { rotate: -6, tilt: 52, style: 'outline' },
  },

  // ---- Insights ----
  {
    id: 'insight1', type: 'barpair', hue: 'equity', align: 'end',
    kicker: 'Insight 1', title: 'Complaint volume doesn’t track conditions',
    body: 'A budget that follows complaint volume follows civic voice, not street condition.',
    map: { rotate: 6, tilt: 48, style: 'filled', hoods: ['Bayview Hunters Point', 'Mission'], leanX: 10, panY: -20 },
  },
  {
    id: 'insight2', type: 'denominator', hue: 'algorithm', align: 'end',
    kicker: 'Insight 2', title: 'A denominator changes the picture',
    leftLabel: 'the app can state a rate',
    rightLabel: '311 can’t — no denominator',
    body: '311 counts complaints. The app counts what staff saw on each visit — so it can state a rate.',
    map: { rotate: -8, tilt: 50, style: 'outline' },
  },
  {
    id: 'insight3', type: 'paleout', hue: 'camera', align: 'end',
    kicker: 'Insight 3', title: 'A lot of streets are clean',
    legend: 'Each green hex = a block where staff photographed and found nothing wrong. Dark hexes had issues flagged.',
    items: [
      { t: '311 can never give this level of insight.', d: 'A block with no complaints is indistinguishable from a block nobody called about.' },
      { t: 'Documenting conditions can establish a street is clean', d: 'in a way that documenting problems cannot.' },
      { t: 'City teams deserve credit', d: 'where credit is due — and media narratives shouldn’t be steered only by what’s wrong.' },
    ],
    map: { rotate: 0, tilt: 54, style: 'outline' },
  },

  // ---- Close ----
  {
    id: 'verdict', type: 'beat', hue: 'ink', align: 'end',
    kicker: 'The verdict', title: 'The three questions, answered',
    items: [
      { t: 'Can we produce a valid baseline over time and across space?', d: 'Yes — highly-variable blocks need special strategies, and coverage scales with deployment.' },
      { t: 'Does the app data tell us anything 311 can’t?', d: 'Yes — underserved neighborhoods, rates not just counts, and proof that streets are clean.' },
      { t: 'Can these data inform policy and operations?', d: 'Yes.' },
    ],
    map: { rotate: -4, tilt: 50, style: 'outline' },
  },
  {
    id: 'applications', type: 'beat', hue: 'turf', align: 'end',
    kicker: 'If we scale it', title: 'Potential applications',
    items: [
      { t: 'Reveal hidden inequities', d: 'where 311 understates real need.' },
      { t: 'Establish ambient baselines', d: 'for strategic resource allocation.' },
      { t: 'Surface long-range trends', d: 'to measure whether interventions work.' },
      { t: 'For DPH/RRT, DPW, infrastructure agencies, fire risk, enforcement, and the Controller’s Office', d: ' — continuous insight where only snapshots exist today.' },
    ],
    map: { rotate: 0, tilt: 46, style: 'outline' },
  },
];