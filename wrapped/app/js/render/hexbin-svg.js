// Hexbin engine A — faux-3D extruded hex columns, zero-dependency SVG.
// Screen-space projection that ECHOES the shell's tilted plane: rotate the footprint by the
// card's camera.rotate, foreshorten Y by cos(tilt) so the grid lies back like a floor, then
// raise each column straight UP in screen-space by its severe count — so the tall downtown/TL
// spike clears the bottom-docked panel. Height AND color both encode n_severe (double-encoded →
// CVD-safe). Projects into actual container pixels (size-aware, re-renders on resize) so there's
// no letterbox guesswork and it stays responsive.
//
// Same public interface as the WebGL engine (hexbin-webgl.js) so the card can swap them:
//   mount(container, opts) -> { setObserver(includeDominant), destroy() }

import { colorForSVG as colorFor, CALM, heightFrac } from './hexbin-scale.js';

const NS = 'http://www.w3.org/2000/svg';
const HEX_ANGLES = [0, 60, 120, 180, 240, 300].map((d) => (d * Math.PI) / 180);

const darken = (css, k) => {
  const [r, g, b] = css.match(/\d+/g).map(Number);
  return `rgb(${(r * k) | 0},${(g * k) | 0},${(b * k) | 0})`;
};

export function mount(container, { hexes, hoods = {}, hexR = 5, viewBox, camera = {}, reducedMotion = false }) {
  const W = viewBox?.w || 1000, H = viewBox?.h || 1002;
  const rot = ((camera.rotate || 0) * Math.PI) / 180;
  const tilt = ((camera.tilt || 55) * Math.PI) / 180;
  const cosR = Math.cos(rot), sinR = Math.sin(rot), cosT = Math.cos(tilt);
  const max = Math.max(1, ...hexes.map((h) => h.n_severe || 0));

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('preserveAspectRatio', 'none');   // viewBox tracks px 1:1, so no distortion
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('hexbin-svg');
  const drift = document.createElementNS(NS, 'g');
  drift.setAttribute('class', reducedMotion ? 'hexbin-plane' : 'hexbin-plane is-drifting');
  svg.append(drift);
  container.append(svg);

  function render() {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) { requestAnimationFrame(render); return; }
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

    // fit the tilted map into the container; anchor its base plane a bit above centre and let
    // columns rise into the clear top third; the bottom-docked panel overlaps only short columns.
    const s = Math.min(w / W, h / (H * cosT)) * 0.92;
    const anchorY = h * 0.44;      // base plane above centre so columns rise clear of the bottom panel
    const maxRise = h * 0.30;
    const project = (x, y) => {
      const cx = x - W / 2, cy = y - H / 2;
      const rx = cx * cosR - cy * sinR;
      const ry = cx * sinR + cy * cosR;
      return [w / 2 + rx * s, anchorY + ry * cosT * s];
    };
    const footprint = (hx) => HEX_ANGLES.map((a) => project(hx.x + hexR * Math.cos(a), hx.y + hexR * Math.sin(a)));

    drift.textContent = '';

    // neighborhood/city outlines — the exact same projection expressed as one affine matrix, so
    // the raw hood paths (viewBox coords) land under the columns for geographic legibility.
    // screen = S·R·(p − centre) + (w/2, anchorY), with S = scale(s, s·cosT), R = rot(rotDeg).
    const a11 = s * cosR, a12 = -s * sinR, a21 = s * cosT * sinR, a22 = s * cosT * cosR;
    const e = w / 2 - (a11 * W / 2 + a12 * H / 2);
    const f = anchorY - (a21 * W / 2 + a22 * H / 2);
    const hoodG = document.createElementNS(NS, 'g');
    hoodG.setAttribute('class', 'hexbin-hoods');
    hoodG.setAttribute('transform', `matrix(${a11.toFixed(4)} ${a21.toFixed(4)} ${a12.toFixed(4)} ${a22.toFixed(4)} ${e.toFixed(2)} ${f.toFixed(2)})`);
    for (const hd of Object.values(hoods)) {
      if (!hd.d) continue;
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', hd.d);
      p.setAttribute('class', 'hexbin-hood');
      hoodG.append(p);
    }
    drift.append(hoodG);
    // ground: every cell's flat footprint — the calm baseline (broad coverage, mostly Excellent)
    const ground = document.createElementNS(NS, 'g');
    ground.setAttribute('class', 'hexbin-ground');
    for (const hx of hexes) {
      const p = document.createElementNS(NS, 'polygon');
      p.setAttribute('points', footprint(hx).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
      p.setAttribute('fill', CALM);
      ground.append(p);
    }
    drift.append(ground);

    // columns: painter's order back→front so nearer columns paint over
    const rows = hexes
      .map((hx) => ({ hx, v: hx.n_severe || 0 }))
      .filter((r) => r.v > 0)
      .map((r) => ({ ...r, base: project(r.hx.x, r.hx.y) }))
      .sort((a, b) => a.base[1] - b.base[1]);

    const cols = document.createElementNS(NS, 'g');
    cols.setAttribute('class', 'hexbin-columns');
    for (const { hx, v, base } of rows) {
      const rise = maxRise * heightFrac(v, max);
      const fp = footprint(hx);
      const cap = fp.map(([x, y]) => [x, y - rise]);
      const fillC = colorFor(v, max);
      const side = darken(fillC, 0.62);
      const g = document.createElementNS(NS, 'g');
      for (let i = 0; i < 6; i++) {
        const j = (i + 1) % 6;
        if ((fp[i][1] + fp[j][1]) / 2 < base[1] + 0.5) continue;   // back edge — skip
        const q = document.createElementNS(NS, 'polygon');
        q.setAttribute('points',
          `${fp[i][0].toFixed(1)},${fp[i][1].toFixed(1)} ${fp[j][0].toFixed(1)},${fp[j][1].toFixed(1)} ` +
          `${cap[j][0].toFixed(1)},${cap[j][1].toFixed(1)} ${cap[i][0].toFixed(1)},${cap[i][1].toFixed(1)}`);
        q.setAttribute('fill', side);
        g.append(q);
      }
      const top = document.createElementNS(NS, 'polygon');
      top.setAttribute('points', cap.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
      top.setAttribute('fill', fillC);
      top.setAttribute('class', 'hexbin-cap');
      g.append(top);
      cols.append(g);
    }
    drift.append(cols);
  }

  render();
  if (!reducedMotion) {
    svg.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 620, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }).finished.catch(() => {});
  }
  const ro = new ResizeObserver(() => render());
  ro.observe(container);

  return {
    setObserver() {},   // observer toggle was cut; kept for interface parity
    destroy() { ro.disconnect(); svg.remove(); },
  };
}
