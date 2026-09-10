// Boot v2 (the pitch deck). main.js (v1) defaults to story.js; this boot file is imported FIRST
// (via modulepreload + a plain script before main.js) and plants the v2 manifest + data URL where
// main.js / data.js read them. app2/index.html is therefore a URL, not a code fork — all JS/CSS
// stays in app/. The v2 data slice drops the 3,283 provenance query_urls + full top_terms
// (v2 cards read totals only): 3.3MB → 0.34MB payload.
import { story as storyV2 } from './story.v2.js';
window.BOOT_MANIFEST = storyV2;
window.BOOT_DATA_URL = '../data/v2/conditions.json';