import { textPath, textWidth, supports, normalize, GLYPH_H } from './pixel-font.js';

// PICO-8 palette plus a near-black "ink" for screen backgrounds.
export const C = {
  black: '#000000',
  navy: '#1d2b53',
  plum: '#7e2553',
  forest: '#008751',
  brown: '#ab5236',
  slate: '#5f574f',
  silver: '#c2c3c7',
  cream: '#fff1e8',
  red: '#ff004d',
  orange: '#ffa300',
  yellow: '#ffec27',
  green: '#00e436',
  blue: '#29adff',
  lavender: '#83769c',
  pink: '#ff77a8',
  peach: '#ffccaa',
  ink: '#0b0e1f',
};

// Base state of every animated element is its final state, so reduced motion
// (or a renderer without CSS animation) still shows the finished frame.
const BASE_CSS = `
@keyframes blink{50%{opacity:0}}
@keyframes grow{from{transform:scaleX(0)}}
@keyframes bob{50%{transform:translateY(-4px)}}
.blink{animation:blink 1s steps(1) infinite}
.blink-slow{animation:blink 2.4s steps(1) infinite}
.grow{transform-box:fill-box;transform-origin:left;animation:grow 1.2s both}
.bob{animation:bob 1s steps(1) infinite}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
`;

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function doc({ w, h, title, css = '', body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
<style>${BASE_CSS}${css}</style>
${body}
</svg>
`;
}

// Pixel text. Falls back to a system monospace <text> for characters the
// bitmap font lacks (e.g. Japanese song titles on the Spotify card).
export function text(str, x, y, { scale = 2, fill = C.cream, align = 'left', cls = '', shadow = null, style = '' } = {}) {
  const attrs = `${cls ? ` class="${cls}"` : ''}${style ? ` style="${style}"` : ''}`;
  if (!supports(str)) {
    const anchor = align === 'center' ? 'middle' : align === 'right' ? 'end' : 'start';
    const size = GLYPH_H * scale + scale;
    return `<text${attrs} x="${x}" y="${y + GLYPH_H * scale}" font-family="ui-monospace,Menlo,Consolas,monospace" font-weight="700" font-size="${size}" text-anchor="${anchor}" fill="${fill}">${esc(String(str))}</text>`;
  }
  const w = textWidth(str, scale);
  const x0 = Math.round(align === 'center' ? x - w / 2 : align === 'right' ? x - w : x);
  let out = '';
  if (shadow) out += `<path d="${textPath(str, x0 + scale, y + scale, scale)}" fill="${shadow}"/>`;
  out += `<path${attrs} d="${textPath(str, x0, y, scale)}" fill="${fill}"/>`;
  return out;
}

export { textWidth, normalize };

// Rectangle with one-unit notched corners: the classic pixel window shape.
export function notchedD(x, y, w, h, u) {
  return `M${x + u} ${y}h${w - 2 * u}v${u}h${u}v${h - 2 * u}h-${u}v${u}h-${w - 2 * u}v-${u}h-${u}v-${h - 2 * u}h${u}z`;
}

export function notched(x, y, w, h, u, fill, extra = '') {
  return `<path${extra} d="${notchedD(x, y, w, h, u)}" fill="${fill}"/>`;
}

export function rect(x, y, w, h, fill, extra = '') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"${extra}/>`;
}

// Window: black outline, colored border, filled body. Inner area starts at x+2u.
export function box(x, y, w, h, { u = 4, fill = C.navy, border = C.cream, outline = C.black } = {}) {
  return notched(x, y, w, h, u, outline) + notched(x + u, y + u, w - 2 * u, h - 2 * u, u, border) + notched(x + 2 * u, y + 2 * u, w - 4 * u, h - 4 * u, u, fill);
}

// Segmented bar that fills from the left in pixel steps.
export function bar(x, y, w, h, pct, { fill = C.green, empty = C.black, seg = 8, gap = 2, delay = 0 } = {}) {
  const n = Math.max(1, Math.floor((w + gap) / (seg + gap)));
  const lit = Math.max(0, Math.min(n, Math.round(n * pct)));
  let bg = '';
  let fg = '';
  for (let i = 0; i < n; i++) {
    const sx = x + i * (seg + gap);
    if (i < lit) fg += `M${sx} ${y}h${seg}v${h}h-${seg}z`;
    else bg += `M${sx} ${y}h${seg}v${h}h-${seg}z`;
  }
  let out = '';
  if (bg) out += `<path d="${bg}" fill="${empty}"/>`;
  if (fg) out += `<path class="grow" style="animation-timing-function:steps(${lit});animation-delay:${delay}s" d="${fg}" fill="${fill}"/>`;
  return out;
}

// Draw a character-grid sprite. Each palette key maps to a color; '.' is empty.
export function sprite(rows, palette, x, y, s, extra = '') {
  const paths = {};
  rows.forEach((row, ry) => {
    let start = -1;
    let cur = null;
    for (let rx = 0; rx <= row.length; rx++) {
      const ch = rx < row.length ? row[rx] : '.';
      const color = palette[ch];
      if (color !== cur) {
        if (cur && start >= 0) {
          const w = (rx - start) * s;
          paths[cur] = (paths[cur] || '') + `M${x + start * s} ${y + ry * s}h${w}v${s}h-${w}z`;
        }
        cur = color;
        start = rx;
      }
    }
  });
  const body = Object.entries(paths).map(([color, d]) => `<path d="${d}" fill="${color}"/>`).join('');
  return extra ? `<g${extra}>${body}</g>` : body;
}

export function spriteSize(rows, s) {
  return { w: rows[0].length * s, h: rows.length * s };
}

// Deterministic PRNG so regenerated assets do not produce noisy git diffs.
export function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function pad(n, width) {
  return String(Math.max(0, Math.floor(n))).padStart(width, '0');
}
