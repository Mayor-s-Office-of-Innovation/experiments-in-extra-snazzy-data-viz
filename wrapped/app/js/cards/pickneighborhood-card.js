// Four kinds of block — the synthesis (replaces the free-select grid; guided, not interactive).
// Four curated neighborhoods map the whole 311-vs-Snapshots spectrum: the two records AGREE at the
// extremes (both quiet = genuinely fine; both loud = everyone agrees it's rough) and DIVERGE in the
// middle (loud-but-calm; flagged-but-quiet). The conclusion states how the two records compare.
// Highlights all four on the shell map (teal = agree, gold = diverge).
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const CASES = [
  { hood: 'Sunset/Parkside',      kind: 'agree',   tag: 'Both quiet',        note: 'thousands of photos, almost nothing flagged — genuinely fine' },
  { hood: 'South of Market',      kind: 'agree',   tag: 'Both loud',         note: 'complaints and camera agree it’s rough' },
  { hood: 'Mission',              kind: 'diverge', tag: 'Loud, but calm',    note: 'the most complaints in the city, far fewer observed problems' },
  { hood: 'Bayview Hunters Point', kind: 'diverge', tag: 'Flagged, but quiet', note: 'real observed problems, far fewer complaints' },
];
const TEAL = 'var(--sf-bay-teal)', GOLD = 'var(--sf-golden-hills)';
const nfmt = (n) => (n ?? 0).toLocaleString();

class PickNeighborhoodCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'typo-card');
    this.dataset.align = 'end';

    const panel = this.h('div', { class: 'panel typo-panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || 'Neighborhood by neighborhood' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || 'Four kinds of block' }));
    panel.append(this.h('p', { class: 'typo-sub' },
      this.h('span', { class: 'typo-src typo-311', text: 'public 311 complaints' }),
      this.h('span', { text: ' vs ' }),
      this.h('span', { class: 'typo-src typo-ai', text: 'the AI’s severe photo flags' })));

    for (const c of CASES) {
      const v = data.hood(c.hood) || {};
      const c311 = (v.crowd || {}).total || 0;
      const sev = (v.camera_algorithm || {}).obs_with_severe || 0;
      const row = this.h('div', { class: `typo-row typo-row--${c.kind}` });
      row.append(this.h('span', { class: 'typo-swatch' }));
      const body = this.h('div', { class: 'typo-body' });
      body.append(this.h('p', { class: 'typo-head' },
        this.h('strong', { text: c.tag }), this.h('span', { class: 'typo-hood', text: ` · ${c.hood}` })));
      const stats = this.h('p', { class: 'typo-stats' });
      stats.append(this.h('span', { class: 'typo-src typo-311' },
        this.h('strong', { text: nfmt(c311) }), this.h('span', { text: ' to 311' })));
      stats.append(this.h('span', { class: 'typo-src typo-ai' },
        this.h('strong', { text: nfmt(sev) }), this.h('span', { text: ' flagged by the AI' })));
      body.append(stats);
      body.append(this.h('p', { class: 'typo-note', text: c.note }));
      row.append(body);
      panel.append(row);
    }

    panel.append(this.h('p', { class: 'beat__body typo-take' },
      'The two records agree at the extremes — the calmest blocks and the roughest. In between, complaints track who calls, not what’s on the street.'));

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    const fills = {};
    for (const c of CASES) {
      fills[c.hood] = c.kind === 'agree'
        ? 'color-mix(in srgb, var(--sf-bay-teal) 60%, transparent)'
        : 'color-mix(in srgb, var(--sf-sunset-coral) 60%, transparent)';
    }
    document.querySelector('condition-map')?.setChoropleth(fills);
    motion.play('fly-in-stagger', this._panel);   // cascade the rows in
  }

  onExit() {
    document.querySelector('condition-map')?.clearChoropleth();
    return motion.play('fade-out', this);
  }
}

customElements.define('card-pickneighborhood', PickNeighborhoodCard);
