// Generic "beat" card — a floating panel with kicker + title + optional count-up stat.
// Placeholder scaffolding to demo the whole-city map + varied transitions before the real
// Camera/Algorithm/Crowd cards are built. Reads stats via the data selectors (seam #1).
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

class BeatCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat');
    if (s.align) this.dataset.align = s.align;    // 'end' pins the panel low so a map marker shows above it
    if (s.fog) this.dataset.fog = '';             // dark vignette over the map (e.g., the sergeant's light)
    const panel = this.h('div', { class: 'panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));

    if (s.stat) {
      const hl = data.headline();
      const value = hl[s.stat.source] ?? s.stat.value ?? 0;
      const num = this.h('span', { class: 'stat__num' });
      num.dataset.to = String(value);
      num.textContent = '0';
      this._num = num;
      panel.append(this.h('p', { class: 'beat__stat' },
        num, this.h('span', { class: 'stat__label', text: s.stat.label || '' })));
    }
    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    if (this._num) motion.play('count-up', this._num, { to: Number(this._num.dataset.to) });
  }
}

customElements.define('card-beat', BeatCard);
