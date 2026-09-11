// Insight 3 — "A lot of streets are clean." A real street map, and ONE DOT PER PHOTO: all 6,094
// drop onto the blocks where they were taken, then the 2,617 that found nothing wrong turn green
// as the 43% counts up. Picture and number are the same measure (photos with no category rated
// ≥ 1, Active Drug Use excluded — identical to the citywide clean share). Streets come from
// sf_streets.json (DataSF centerlines, baked by make_map.py); dots from sf_map.json hexes (n,
// n_clean). Same camera as slide 2 so this reads as "the same map, now showing what was found."
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

class PaleoutCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'paleout');
    if (s.align) this.dataset.align = s.align;

    const tot = Object.values(data.hoods()).reduce((a, v) => a + (v.camera_algorithm?.obs || 0), 0);
    const sig = Object.values(data.hoods()).reduce((a, v) => a + (v.camera_algorithm?.obs_with_signal || 0), 0);
    const clean = tot - sig;
    const cleanShare = tot ? Math.round(100 * clean / tot) : 0;

    const panel = this.h('div', { class: 'panel paleout__panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));
    // big number + inline sentence, one flowing line-pair — no orphan % at a section break.
    // Printed, not counted up: the map (dots dropping, then greening) carries the motion here.
    const num = this.h('span', { class: 'stat__num paleout__num', text: `${cleanShare}%` });
    panel.append(this.h('p', { class: 'paleout__stat' },
      num,
      this.h('span', { class: 'paleout__statline' },
        `of ${tot.toLocaleString()} photos found `,
        this.h('strong', { text: 'nothing wrong at all' }))));
    // legend: the two dot colors on the map, with their counts — one dot per photo
    panel.append(this.h('p', { class: 'paleout__legend' },
      this.h('span', { class: 'paleout__key paleout__key--clean', text: `${clean.toLocaleString()} photos, nothing wrong` }),
      this.h('span', { class: 'paleout__key paleout__key--flag', text: `${sig.toLocaleString()} photos, something flagged` })));
    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));
    if (s.items?.length) {
      const ul = this.h('ul', { class: 'beat__items' });
      for (const it of s.items) {
        const li = this.h('li');
        const content = this.h('span');
        if (it.t) content.append(this.h('strong', { text: it.t }));
        if (it.d) content.append(this.h('span', { text: it.d }));
        li.append(content);
        ul.append(li);
      }
      panel.append(ul);
    }
    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    const map = document.querySelector('condition-map');
    motion.play('fade-up', this._panel);
    motion.play('fly-in-stagger', this._panel, { selector: '.beat__items > li', step: 120 });
    const reduced = motion.prefersReducedMotion();
    if (!map) return;
    const gen = (this._gen2 = (this._gen2 || 0) + 1);
    // streets first (the ground), then the dots drop, then the clean ones turn green with the %
    Promise.all([data.loadStreets().catch((e) => { console.warn('streets unavailable', e); return null; }), data.loadMap()])
      .then(([streets]) => {
        if (gen !== this._gen2 || !this.hasAttribute('active')) return;
        if (streets) map.setStreets(streets.classes);
        map.setPhotoDots(data.mapHexes(), data.mapMeta()?.hexR || 5);
        if (reduced) { map.litDots({ instant: true }); return; }
        this._t = setTimeout(() => { this._t = null; map.litDots(); }, 1500);
      })
      .catch((e) => console.warn('clean-streets map failed', e));
  }

  onExit() {
    if (this._t) { clearTimeout(this._t); this._t = null; }
    this._gen2 = (this._gen2 || 0) + 1;
    const map = document.querySelector('condition-map');
    map?.clearStreets();
    map?.clearPhotoDots();
    return motion.play('fade-out', this);
  }
}

customElements.define('card-paleout', PaleoutCard);
