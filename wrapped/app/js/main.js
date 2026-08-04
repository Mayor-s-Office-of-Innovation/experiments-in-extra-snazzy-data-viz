// Bootstrap: load data (seam #1), register cards, hand the manifest (seam #2) to the
// thin state-machine core. Adding a card = import its module + add a CARD_TAGS entry +
// a manifest entry. Nothing else changes.

import { story } from './story.js';
import * as data from './data.js';
import { StoryMachine } from './state.js';
import './condition-map.js';

// card modules self-register their custom elements on import
import './cards/overture-card.js';
import './cards/beat-card.js';
import './cards/divergence-card.js';
import './cards/hexbin-card.js';
import './cards/choropleth-card.js';
import './cards/algorithm-card.js';
import './cards/equity-card.js';
import './cards/pickneighborhood-card.js';
import './cards/caveats-card.js';

// manifest `type` -> custom element tag
const CARD_TAGS = {
  overture: 'card-overture',
  beat: 'card-beat',
  divergence: 'card-divergence',
  hexbin: 'card-hexbin',
  choropleth: 'card-choropleth',
  algorithm: 'card-algorithm',
  equity: 'card-equity',
  pickhood: 'card-pickneighborhood',
  caveats: 'card-caveats',
};

const tagFor = (type) => {
  const tag = CARD_TAGS[type];
  if (!tag) throw new Error(`No card registered for type "${type}" (add to CARD_TAGS)`);
  return tag;
};

async function boot() {
  try {
    await data.load();
    await data.loadIncome().catch((e) => console.warn('income.json unavailable (Equity card):', e));
  } catch (err) {
    document.getElementById('cards').innerHTML =
      `<p style="padding:2rem">Couldn't load data: ${err.message}. ` +
      `Serve from the <code>wrapped/</code> directory so <code>../data/conditions.json</code> resolves.</p>`;
    return;
  }

  // persistent tilted map plane, inserted behind the cards
  const map = document.createElement('condition-map');
  document.getElementById('stage').prepend(map);
  try { await map.ready(); } catch (e) { console.warn('map geometry failed to load', e); }

  const machine = new StoryMachine({
    manifest: story,
    tagFor,
    map,
    mount: document.getElementById('cards'),
    progress: document.getElementById('progress'),
    announcer: document.getElementById('announcer'),
    controls: {
      prev: document.getElementById('prev'),
      next: document.getElementById('next'),
      autoplay: document.getElementById('autoplay'),
    },
  });

  // Warm the WebGL hero's libs during idle so "The Snapshots" doesn't stall on first view.
  // Skip if the SVG engine is forced (?hexbin=svg) — then deck.gl is never needed.
  if (new URL(location.href).searchParams.get('hexbin') !== 'svg') {
    const warm = () => import('./render/hexbin-webgl.js').then((m) => m.preload?.()).catch(() => {});
    (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(warm);
  }
}

boot();
