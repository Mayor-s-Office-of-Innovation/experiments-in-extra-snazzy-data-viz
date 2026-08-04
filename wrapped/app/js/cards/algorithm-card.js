// "What it saw" — the Snapshots' 2nd blind spot (the algorithm). The rubric is FLAT: score =
// 100×(1−S/36), every one of the 12 categories worth the same 2.78 points. So the loudest "severe"
// signal is Graffiti (503 flags) — cosmetic — while genuinely dangerous, rare categories (Human
// Waste 8, Sharps 2, Fire 0) barely register yet count the same per point. And Active Drug Use is
// EXCLUDED — the AI reads the fentanyl fold as a person standing there, not the emergency.
// Real counts from citywide.camera.category_totals; no geography, so the shell map stays faint.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

// curated to land the contrast: the loud cosmetic ones, then the striking rare hazards
const SHOW = ['Graffiti', 'Unsheltered Presence', 'Waste & Small Debris',
  'Human and Animal Waste', 'Sharps', 'Fire & Safety Hazards'];

class AlgorithmCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'algorithm-card');
    if (s.align) this.dataset.align = s.align;

    const ct = data.citywide().camera.category_totals || {};
    const sev = (k) => (ct[k]?.severe ?? 0);
    const max = Math.max(1, ...SHOW.map(sev));

    const panel = this.h('div', { class: 'panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || 'Its blind spot · what it saw' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || 'Every problem weighs the same' }));

    // ranked "severe flags" bars — Graffiti (cosmetic) towers over the real hazards
    const list = this.h('div', { class: 'rubric' });
    this._bars = [];
    for (const k of SHOW) {
      const n = sev(k);
      const row = this.h('div', { class: 'rubric__row' });
      row.append(this.h('span', { class: 'rubric__label', text: k.replace('and', '&') }));
      const track = this.h('span', { class: 'rubric__track' });
      const fill = this.h('span', { class: 'rubric__fill' });
      fill.dataset.w = (100 * n / max).toFixed(1);
      fill.style.width = '0%';
      if (k === 'Graffiti') fill.dataset.hot = '';
      this._bars.push(fill);
      track.append(fill);
      row.append(track, this.h('span', { class: 'rubric__num', text: String(n) }));
      list.append(row);
    }
    panel.append(list);

    panel.append(this.h('p', { class: 'rubric__formula',
      text: 'Its severe flags skew to graffiti — a cosmetic problem. The rarer, genuinely dangerous ones barely register.' }));

    // the fentanyl fold — the excluded blind spot
    const fold = this.h('p', { class: 'rubric__fold' });
    fold.append(this.h('strong', { text: 'Active Drug Use — excluded. ' }));
    fold.append(this.h('span', { text: 'The AI just sees a person standing there; it was never trained to recognize active drug use.' }));
    panel.append(fold);

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    // grow the bars (reduced-motion just lands them via the same width set)
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._bars.forEach((f, i) => {
      const to = `${f.dataset.w}%`;
      if (reduced) { f.style.width = to; return; }
      f.animate([{ width: '0%' }, { width: to }],
        { duration: 700, delay: 120 + i * 80, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' });
      f.style.width = to;
    });
  }

  onExit() { return motion.play('fade-out', this); }
}

customElements.define('card-algorithm', AlgorithmCard);
