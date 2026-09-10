// Insight 3 — "A lot of streets are clean." The dawn sweep: the plane starts near-black
// ("what a complaint ledger sees: nothing"), then calm neighborhoods light up west→east as
// the 43% counts up — clean-ness washing across the city. Nightfall on enter, dawn mid-card,
// everything restored on exit. (The dot-stipple version is parked in git history.)
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
    // big number + inline sentence, one flowing line-pair: "43% of 6,094 photos found
    // nothing wrong at all" — no orphan % stranded at a section break.
    const num = this.h('span', { class: 'stat__num paleout__num' });
    num.dataset.to = String(cleanShare);
    num.textContent = '0';
    this._num = num;
    panel.append(this.h('p', { class: 'paleout__stat' },
      num,
      this.h('span', { class: 'paleout__statline' },
        `of ${tot.toLocaleString()} photos found `,
        this.h('strong', { text: 'nothing wrong at all' }))));
    if (s.legend) panel.append(this.h('p', { class: 'paleout__legend', text: s.legend }));
    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));
    // bullet list (same shape as beat-card): [{ t: 'bold lead', d: 'rest' }]
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
    if (this._num) motion.play('count-up', this._num, { to: Number(this._num.dataset.to), format: (v) => `${Math.round(v)}%` });
    motion.play('fly-in-stagger', this._panel, { selector: '.beat__items > li', step: 120 });
    if (!map) return;
    // 1) night falls, 2) the dawn sweep washes west→east, 3) green clean-hexes pop in behind it
    map.nightfall();
    if (motion.prefersReducedMotion()) {
      // reduced motion: land directly on the lit end-state, no sweep
      map.clearDawn();
      map.apply({ rotate: 0, tilt: 54, style: 'filled' });
      data.loadMap().then(() => map.dawnHexes(data.mapHexes())).catch(() => {});
    } else {
      setTimeout(() => map.dawnSweep(), 900);   // let nightfall land first
      data.loadMap()
        .then(() => setTimeout(() => map.dawnHexes(data.mapHexes()), 900))   // same wave, hex grain
        .catch((e) => console.warn('dawn hexes failed', e));
    }
  }

  onExit() {
    const map = document.querySelector('condition-map');
    map?.clearDawn();
    map?.clearDawnHexes();
    return motion.play('fade-out', this);
  }
}

customElements.define('card-paleout', PaleoutCard);