// Story v2 — the internal pitch deck (city-employee audience). Selected via ?story=v2 in main.js.
// Mirrors updated-story.md + plan-story-v2.md, with OUR validated numbers (locked window
// 2026-01-30 → 2026-06-08). Title rule: findings, not campaigning.
//
// 2026-09-11 post-review revisions: slides 3+4 merged into one 311 card (flood → drain → limits);
// `map: false` drops the plain idle outline map where it adds nothing (deck: 9 → 8 slides).
//
// 2026-09-11 rebuild: Insight 2 is the one-block timeline (type `timeline`, block_exhibit in the
// bake); Insight 3 draws real streets + one dot per photo (paleout-card, sf_streets.json).

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
    map: { rotate: -8, tilt: 50, style: 'outline', settle: 4000 },   // comes to rest after 4s
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

  // ---- 311 (merged slide: the flood + what it can't do — drain + limits in one beat) ----
  {
    id: 'three11', type: 'choropleth', hue: 'crowd', align: 'end', drain: true,
    kicker: '311', title: 'What 311 can’t do',
    stat: { label: 'complaints filed by the public' },
    items: [
      { t: 'No denominator.', d: '50 cases may mean a bad block — or a well-documented one.' },
      { t: 'It can’t record a clean street.', d: 'Silence isn’t evidence.' },
      { t: 'A complaint isn\'t a confirmed problem.', d: 'Many tickets closed as "No Work Needed".' },
      { t: 'No accountability trail.', d: 'No way to validate whether closed tickets equates to addressed work.' },
    ],
    map: { rotate: -12, tilt: 50, style: 'choropleth' },
  },

  // ---- Insights ----
  {
    id: 'insight1', type: 'barpair', hue: 'equity', align: 'end',
    kicker: 'Insight 1', title: 'Complaint volume doesn’t track conditions',
    body: 'Despite comparable observed conditions in the Mission and Bayview, the Mission received almost 5x the number of complaints. A budget that follows complaint volume follows civic voice, not street condition.',
    map: { rotate: 6, tilt: 48, style: 'filled', hoods: ['Bayview Hunters Point', 'Mission'], leanX: -6, panY: -20 },
  },
  {
    id: 'insight2', type: 'timeline', hue: 'algorithm', align: 'end',
    kicker: 'Insight 2 \u00b7 one block, 19 weeks', title: 'A denominator changes the picture',
    body: '311 counts what went wrong here: 120 complaints. It can\u2019t count the days nothing did. Staff visited on 15 days and found nothing wrong on 12 of them.',
    foot: 'Same block, same 19 weeks, two real records. Only one of them has a denominator.',
    map: { rotate: -6, tilt: 50, style: 'outline', hood: 'Tenderloin', lean: 0.25, panY: -12 },
  },
  {
    id: 'insight3', type: 'paleout', hue: 'camera', align: 'end',
    kicker: 'Insight 3', title: 'A lot of streets are clean',
    items: [
      { t: '311 can never show this.', d: 'A block with no complaints is indistinguishable from a block nobody called about.' },
      { t: 'City teams deserve credit', d: 'where credit is due \u2014 and narratives shouldn\u2019t be steered only by what\u2019s wrong.' },
    ],
    map: { rotate: 10, tilt: 56, style: 'outline', panY: -14 },
  },

  // ---- Close: the agreed doc's §7 / §8 / §9 (updated-story.md), wording verbatim. The one
  // deviation, by decision 2026-09-11: §7 keeps our toned-down title (findings, not campaigning).
  // Kickers are neutral labels, not doc wording. Nothing else on these slides is ours.
  {
    id: 'verdict', type: 'close', hue: 'ink', align: 'end', map: false, wide: true,
    kicker: 'The verdict', title: 'The three questions, answered',
    items: [
      { t: 'Can we generate valid baseline and overtime estimates of street conditions that are comparable across time and space?',
        sub: [
          { t: 'Baseline data: Yes!', d: 'Caveats: highly variable blocks might need special data collection strategies', },
          { t: 'Over time data: Yes!', d: 'Caveats: coverage depends on how large-scale we\u2019re deploying the app' },
        ] },
      { t: 'Does the Street Conditions App data tell us anything new compared to 311?',
        sub: [
          { t: 'There are neighborhoods that are currently being underserved', },
          { t: 'Adds a denominator that\u2019s a closer proxy for real conditions.', d: 'Rates, not just counts', },
          { t: 'Proves streets are clean,', d: 'something no complaint system can do', },
        ] },
      { t: 'Can these data inform policy and operational decisions?', d: 'Yes, see next slide' },
    ],
  },
  {
    id: 'policy', type: 'close', hue: 'camera', align: 'end', bg: 'dots',
    kicker: 'Policy and operations', title: 'This data can inform policy and operational decisions',
    body: 'SCA data can tell us:',
    items: [
      { t: 'Reveal hidden inequities:', d: 'spot areas where 311 reports understate real need, making the case for renewed investment.' },
      { t: 'Establish ambient baselines:', d: 'build the evidence base for strategic resource allocation and public-facing investment cases.' },
      { t: 'Surface long-range trends:', d: 'track outcomes over time to evaluate past decisions and measure whether interventions actually work.' },
    ],
    map: { rotate: 10, tilt: 56, style: 'outline', panY: -14 },
  },
  {
    id: 'applications', type: 'close', hue: 'ink', align: 'end', wide: true,
    kicker: 'Applications', title: 'What are possible applications of this data?',
    tiles: [
      { t: 'Give DPH/RRT teams better baselines and trends', d: 'more confident strategic deployments \u2014 based on real conditions, not ticket counts; get credit for real improvements (maintain morale, avoid wasted resources) even when 311 counts remain high; target where real problems are hidden by 311 undercounts' },
      { t: 'Free DPW from the 311 trap', d: 'help shift from reactive ticket-chasing to strategic, data-driven corridor cleaning.' },
      { t: 'Give infrastructure-owning agencies a view of trends', d: 'track conditions of city-owned assets over time, to guide maintenance and renewal.' },
      { t: 'Reduce fire risk', d: 'flag vegetation health and fire risk trends before they become emergencies.' },
      { t: 'Point enforcement where it matters', d: 'surface hotspots for blocked bike lanes, illegal parking, and bus stop obstructions.' },
      { t: 'Replace infrequent controller\u2019s office snapshots with continuous insight', d: 'provide real-time data to prioritize street and sidewalk improvements.' },
    ],
    caveat: 'Jan 30 \u2013 Jun 8, 2026 \u00b7 AI-scored, not human judgment \u00b7 coverage \u2260 conditions',
    map: { rotate: 0, tilt: 46, style: 'outline', zoom: 0.88 },
  },
];
