// Card 12 — Share. Built FIRST (shareability carries it). Composes a bespoke portrait
// share image on a <canvas> (zero dependency, full control — no DOM screenshotting) and
// offers a download. The on-screen card is a scaled preview + a real download button.

import { CardBase } from './base-card.js';
import * as data from '../data.js';
import * as motion from '../motion.js';

const W = 1080, H = 1350;   // portrait share card

class ShareCard extends CardBase {
  render() {
    const d = data.headline();
    this._d = d;

    this._canvas = this.h('canvas', { class: 'share__canvas', width: W, height: H });
    this._canvas.setAttribute('role', 'img');
    this._canvas.setAttribute('aria-label',
      `SF street conditions share image: two records of the same streets — ` +
      `${d.reports311.toLocaleString()} public 311 complaints and ` +
      `${d.scPhotos.toLocaleString()} AI-scored street photos, ` +
      `${d.windowStart} to ${d.windowEnd}.`);

    this._download = this.h('a', { class: 'btn share__dl', text: '↓ Download image',
      download: 'sf-street-conditions.png', 'data-no-advance': '' });

    this.append(
      this.h('p', { class: 'kicker', text: this.spec.kicker || 'Share' }),
      this.h('div', { class: 'share__frame' }, this._canvas),
      this._download,
    );
  }

  onEnter() {
    this._paint();
    motion.play('fade-up', this.querySelector('.share__frame'));
  }

  _paint() {
    const ctx = this._canvas.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const ink = css.getPropertyValue('--ink').trim() || '#14171a';
    const paper = '#eef1f4';
    const hot = css.getPropertyValue('--sf-sunset-coral').trim() || '#E9764F';
    const blue = css.getPropertyValue('--sf-bay-blue').trim() || '#1B6CA8';
    const green = css.getPropertyValue('--sf-presidio-green').trim() || '#3E6B4F';
    const gold = css.getPropertyValue('--sf-imperial-gold').trim() || '#E0A526';
    const d = this._d;

    ctx.fillStyle = ink; ctx.fillRect(0, 0, W, H);

    const pad = 90;
    ctx.textBaseline = 'alphabetic';

    // kicker
    ctx.fillStyle = hot;
    ctx.font = '600 34px ui-monospace, Menlo, monospace';
    ctx.fillText('S F   S T R E E T   C O N D I T I O N S', pad, 150);

    // title
    ctx.fillStyle = paper;
    ctx.font = '800 96px system-ui, sans-serif';
    ctx.fillText('Two ways', pad, 300);
    ctx.fillText('to see a street', pad, 400);

    // two viewpoints + window
    const rows = [
      ['THE COMPLAINTS · 311', `${d.reports311.toLocaleString()} reports filed`, green],
      ['THE SNAPSHOTS', `${d.scPhotos.toLocaleString()} photos, AI-scored`, blue],
      ['SAME WINDOW', `${d.windowStart} → ${d.windowEnd}`, gold],
    ];
    let y = 620;
    for (const [label, value, color] of rows) {
      ctx.fillStyle = color; ctx.fillRect(pad, y - 46, 14, 60);
      ctx.fillStyle = css.getPropertyValue('--muted').trim() || '#aab2ba';
      ctx.font = '700 30px ui-monospace, Menlo, monospace';
      ctx.fillText(label, pad + 40, y - 12);
      ctx.fillStyle = paper;
      ctx.font = '700 52px system-ui, sans-serif';
      ctx.fillText(value, pad + 40, y + 44);
      y += 170;
    }

    // footer line
    ctx.fillStyle = paper;
    ctx.font = '600 34px system-ui, sans-serif';
    ctx.fillText('One logs complaints.', pad, H - 150);
    ctx.fillStyle = hot;
    ctx.fillText('The other photographs everything.', pad, H - 100);

    this._canvas.toBlob((blob) => {
      if (this._url) URL.revokeObjectURL(this._url);
      this._url = URL.createObjectURL(blob);
      this._download.href = this._url;
    }, 'image/png');
  }
}

customElements.define('card-share', ShareCard);
