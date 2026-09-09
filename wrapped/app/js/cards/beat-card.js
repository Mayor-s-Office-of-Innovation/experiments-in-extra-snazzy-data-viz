// Generic "beat" card — a floating panel with kicker + title + optional count-up stat.
// Placeholder scaffolding to demo the whole-city map + varied transitions before the real
// Camera/Algorithm/Crowd cards are built. Reads stats via the data selectors (seam #1).
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';
import { complaintFills } from './choropleth-card.js';

class BeatCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat');
    if (s.align) this.dataset.align = s.align;    // 'end' pins the panel low so a map marker shows above it
    if (s.fog) this.dataset.fog = '';             // dark vignette over the map (e.g., the sergeant's light)
    if (s.drain) this._drain = true;              // v2: fade the choropleth toward linework on enter
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
    // bullet list: items is [{ t: 'bold lead', d: 'rest' }] or plain strings.
    // strong+span are wrapped in ONE span so the li grid is strictly [counter | content] —
    // otherwise strong lands in the auto column and blows the counter's width wide open.
    if (s.items?.length) {
      const ul = this.h('ul', { class: 'beat__items' });
      this._items = [];
      for (const it of s.items) {
        const li = this.h('li');
        if (typeof it === 'string') {
          li.append(this.h('span', { text: it }));
        } else {
          const content = this.h('span');
          if (it.t) content.append(this.h('strong', { text: it.t }));
          if (it.d) content.append(this.h('span', { text: it.d }));
          li.append(content);
        }
        this._items.push(li);
        ul.append(li);
      }
      panel.append(ul);
    }

    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    if (this._num) motion.play('count-up', this._num, { to: Number(this._num.dataset.to) });
    if (this._items) motion.play('fly-in-stagger', this._panel, { selector: '.beat__items > li' });
    if (this._drain) {
      // re-apply the 311 fills first (this card may be entered directly / after a style change),
      // then drain them — "the map goes dark where nobody calls"
      const map = document.querySelector('condition-map');
      map?.setChoropleth(this._fills ||= complaintFills());
      map?.drainChoropleth();
    }
  }

  onExit() {
    if (this._drain) {
      const map = document.querySelector('condition-map');
      map?.undrainChoropleth();
      // clear ONLY if the incoming card isn't the choropleth (it re-applies fills itself on enter,
      // but its onEnter runs BEFORE this onExit — clearing here would wipe them)
      const choroActive = [...document.querySelectorAll('card-choropleth')].some((c) => c.hasAttribute('active'));
      if (!choroActive) map?.clearChoropleth();
    }
    return motion.play('fade-out', this);
  }
}

customElements.define('card-beat', BeatCard);
