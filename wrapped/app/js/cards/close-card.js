// v2 closing beats — the verdict, the policy slide, and the agency tiles. A beat panel whose
// copy is the team's agreed wording (story.v2.js), with two structural extras:
//   items[].sub — nested bullets under an item: [{ t, d }] (the doc's sub-points)
//   tiles — a grid of { t, d } cards (the agency list); caveat — the quiet finale strip
// bg:'dots' re-draws slide 6's streets + photo dots (lit, no pop) behind the panel.
import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

class CloseCard extends CardBase {
  render() {
    const s = this.spec;
    this.classList.add('beat', 'close');
    if (s.align) this.dataset.align = s.align;
    if (s.wide) this.classList.add('close--wide');
    const panel = this.h('div', { class: 'panel close__panel' });
    panel.append(this.h('p', { class: 'kicker', text: s.kicker || '' }));
    panel.append(this.h('h2', { class: 'display', text: s.title || '' }));
    if (s.body) panel.append(this.h('p', { class: 'beat__body', text: s.body }));

    if (s.items?.length) {
      const ul = this.h('ul', { class: 'beat__items' });
      for (const it of s.items) {
        const li = this.h('li');
        const content = this.h('span');
        if (it.t) content.append(this.h('strong', { text: it.t }));
        if (it.d) content.append(this.h('span', { text: it.d }));
        if (it.sub?.length) {
          const sub = this.h('ul', { class: 'beat__sub' });
          for (const x of it.sub) {
            const c = this.h('span');
            if (x.t) c.append(this.h('strong', { text: x.t }));
            if (x.d) c.append(this.h('span', { text: x.d }));
            sub.append(this.h('li', {}, c));
          }
          content.append(sub);
        }
        li.append(content);
        ul.append(li);
      }
      panel.append(ul);
    }

    if (s.tiles?.length) {
      const grid = this.h('ul', { class: 'tiles' });
      for (const t of s.tiles) {
        grid.append(this.h('li', { class: 'tile' },
          this.h('strong', { text: t.t }), this.h('span', { text: t.d })));
      }
      panel.append(grid);
    }
    if (s.caveat) panel.append(this.h('p', { class: 'close__caveat', text: s.caveat }));
    this._panel = panel;
    this.append(panel);
  }

  onEnter() {
    motion.play('fade-up', this._panel);
    motion.play('fly-in-stagger', this._panel, { selector: '.beat__items > li, .tiles > li', step: 90 });
    if (this.spec.bg === 'dots') {
      const map = document.querySelector('condition-map');
      const gen = (this._gen2 = (this._gen2 || 0) + 1);
      Promise.all([data.loadStreets().catch(() => null), data.loadMap()]).then(([streets]) => {
        if (gen !== this._gen2 || !this.hasAttribute('active') || !map) return;
        if (streets) map.setStreets(streets.classes);
        map.setPhotoDots(data.mapHexes(), data.mapMeta()?.hexR || 5);
        map.litDots({ instant: true });                 // already-proven state: no re-pop
      }).catch(() => {});
    }
  }

  onExit() {
    if (this.spec.bg === 'dots') {
      this._gen2 = (this._gen2 || 0) + 1;
      const map = document.querySelector('condition-map');
      map?.clearStreets(); map?.clearPhotoDots();
    }
    return motion.play('fade-out', this);
  }
}

customElements.define('card-close', CloseCard);
