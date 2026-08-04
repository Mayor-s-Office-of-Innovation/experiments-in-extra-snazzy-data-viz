// Seam #2 — the story manifest. Reorder / add / cut / A-B cards by editing THIS array.
// Each entry: {id, type, hue, map, kicker, title, stat, body, align}. `map` drives the persistent
// tilted plane per card (whole-city framing). `type` → CARD_TAGS.
//
// TWO-VIEWPOINT ARC (viewable slice): Overture → The Complaints (311) → its blind spot (why a 2nd
// record exists) → The Snapshots (streetconditions; 71% "OK") → its two blind spots (where it looked /
// what it saw) → disagreement → Share. Some beat cards are still placeholders.

export const story = [
  {
    id: 'overture', type: 'overture', hue: 'ink',
    kicker: 'SF Street Conditions', title: 'Two ways to see a street',
    map: { rotate: -8, tilt: 50, style: 'outline' },
  },

  // ---- Viewpoint 1: The Complaints (311) ----
  {
    id: 'complaints', type: 'choropleth', hue: 'crowd', align: 'end',
    kicker: 'Viewpoint 1 · the public', title: 'The Complaints',
    stat: { label: 'reports filed to SF 311' },
    body: 'What the public reported — the usual read on how the city’s doing. A complaint ledger: it lights up where people call, and the Mission calls the loudest.',
    map: { rotate: -12, tilt: 50, style: 'choropleth' },
  },
  {
    id: 'only-problems', type: 'beat', hue: 'crowd', align: 'end',
    kicker: 'Viewpoint 1 · the blind spot', title: '…but only problems',
    body: '311 only hears complaints. It can log a block someone reported — never a block that’s fine. So most of the city, most of the time, is invisible to it. That gap is why a city worker started a second record.',
    map: { rotate: -5, tilt: 52, style: 'outline' },
  },

  // ---- Viewpoint 2: The Snapshots (streetconditions) — hexbin hero ----
  {
    id: 'snapshots', type: 'hexbin', hue: 'camera', mode: 'overview', align: 'end',
    kicker: 'Viewpoint 2 · the city', title: 'The Snapshots',
    chip: { big: '7 in 10', label: 'blocks scored “Excellent”' },
    body: 'They set out to photograph the baseline 311 can’t see — going block to block whether or not anything’s wrong, to show that most of the city, most days, is doing OK. An AI scores each anonymized photo.',
    caption: 'Height + color = where the severe photos cluster. The flat calm is the point — the “OK” that 311 never records.',
    map: { rotate: 10, tilt: 56 },
  },
  {
    id: 'where-it-looked', type: 'beat', hue: 'tenderloin', align: 'end', fog: true,
    kicker: 'Its blind spot · where it looked', title: 'A single sergeant, on his rounds',
    body: 'That downtown tower is mostly one person. 949 of the Tenderloin’s 1,336 photos came from a single sergeant on patrol — one light, one route, not a fair sample.',
    map: { rotate: 6, tilt: 58, style: 'pins', hood: 'Tenderloin', frame: 'hood', panY: -12 },
  },
  {
    id: 'what-it-saw', type: 'algorithm', hue: 'algorithm', align: 'end',
    kicker: 'Its blind spot · what it saw', title: 'Mostly, it flags graffiti',
    map: { rotate: -8, tilt: 50, style: 'outline' },
  },

  // ---- Where they disagree (hook + two directional "how" beats) ----
  {
    id: 'disagree', type: 'beat', hue: 'turf', align: 'end',
    kicker: 'Where they disagree', title: 'Loud here, quiet there',
    body: 'The two records don’t point at the same blocks. Complaints measure who complains — not always what’s there.',
    map: { rotate: 16, tilt: 46, style: 'filled', hood: 'Mission', panY: -20 },
  },
  {
    id: 'loud-mission', type: 'divergence', hue: 'crowd', mode: 'loud', hood: 'Mission', align: 'end',
    kicker: 'Loud, but calm', title: 'The Mission',
    body: 'The public files one in five of the city’s street complaints here — but the snapshots flag far fewer problems than that.',
    linkText: 'See the Mission’s 311 reports',
    map: { rotate: -14, tilt: 48, style: 'filled', hood: 'Mission', panY: -20 },
  },
  {
    id: 'quiet-bayview', type: 'divergence', hue: 'equity', mode: 'quiet', hood: 'Bayview Hunters Point',
    kicker: 'Quiet, but not fine', title: 'Bayview–Hunters Point',
    body: 'Among the fewest complaints in the city — yet its conditions rank among the worst. Under-resourced neighborhoods report less, so 311 undercounts them.',
    linkText: 'See Bayview’s 311 reports',
    map: { rotate: 18, tilt: 52, style: 'filled', hood: 'Bayview Hunters Point' },
  },

  {
    id: 'equity', type: 'equity', hue: 'equity', align: 'end',
    kicker: 'The equity read', title: 'Same street, different voice',
    map: { rotate: -8, tilt: 50, style: 'choropleth', panY: -18 },
  },
  {
    id: 'pick', type: 'pickhood', hue: 'ink', align: 'end',
    kicker: 'Neighborhood by neighborhood', title: 'Four kinds of block',
    map: { rotate: -6, tilt: 52, style: 'choropleth', panY: -18 },
  },
  {
    id: 'caveats', type: 'caveats', hue: 'bone',
    kicker: 'Before you go', title: 'What this can and can’t tell you',
    map: { rotate: 0, tilt: 46, style: 'outline' },
  },
];
