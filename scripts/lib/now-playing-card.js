import { C, doc, text, box, bar, sprite, normalize } from './svg.js';
import { supports } from './pixel-font.js';
import { ICONS } from './sprites.js';

const W = 840;
const H = 164;

// Truncate to the available width. Titles the pixel font can't draw (e.g. Japanese)
// fall back to a system font whose glyphs run wider, so budget more per character.
function fit(str, maxWidth, scale) {
  const chars = [...normalize(String(str || ''))];
  const perChar = supports(chars.join('')) ? 6 * scale : 8 * scale;
  const max = Math.floor((maxWidth + scale) / perChar);
  if (chars.length <= max) return chars.join('');
  return chars.slice(0, Math.max(1, max - 3)).join('').trimEnd() + '...';
}

function mmss(ms) {
  const s = Math.floor((ms || 0) / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// state: 'playing' | 'recent' | 'idle'
export function nowPlayingCard({ state, title, artist, art, progressMs, durationMs }) {
  const playing = state === 'playing';
  const tx = 168;
  const textW = W - 24 - tx;

  let artBlock;
  if (art) {
    artBlock = `<image href="${art}" x="32" y="32" width="100" height="100" preserveAspectRatio="xMidYMid slice" style="image-rendering:pixelated;image-rendering:crisp-edges"/>`;
  } else {
    const q = ICONS.mystery;
    artBlock = sprite(q.rows, q.pal, 42, 42, 5, ' class="bob"');
  }

  let eq = '';
  if (playing) {
    const durs = [0.9, 0.6, 1.1, 0.7, 0.8, 1.0];
    durs.forEach((d, i) => {
      eq += `<rect class="eq" x="${W - 108 + i * 14}" y="20" width="10" height="28" fill="${C.green}" style="animation-duration:${d}s;animation-delay:-${(i * 0.23).toFixed(2)}s"/>`;
    });
  }

  let lines;
  if (state === 'idle') {
    lines = `
${text('♪ NO SIGNAL', tx, 24, { fill: C.lavender })}
${text('INSERT COIN', tx, 56, { scale: 3, fill: C.yellow, cls: 'blink' })}
${text('NOTHING PLAYING RIGHT NOW', tx, 92, { fill: C.silver })}`;
  } else {
    const footer = playing
      ? bar(tx, 124, textW - 120, 12, durationMs ? progressMs / durationMs : 0, { fill: C.green, seg: 8, gap: 2 }) +
        text(`${mmss(progressMs)}/${mmss(durationMs)}`, W - 24, 123, { align: 'right', fill: C.silver })
      : text('SPOTIFY · RECENTLY PLAYED', tx, 123, { fill: C.slate });
    lines = `
${text(playing ? '♪ NOW PLAYING' : '♪ LAST PLAYED', tx, 24, { fill: playing ? C.green : C.lavender, cls: playing ? 'blink-slow' : '' })}
${text(fit(title, textW, 3), tx, 54, { scale: 3, fill: C.cream })}
${text(fit(artist, textW, 2), tx, 88, { fill: C.pink })}
${footer}`;
  }

  const css = `.eq{transform-box:fill-box;transform-origin:bottom;animation:eq 1s steps(4) infinite alternate}@keyframes eq{from{transform:scaleY(.25)}}`;
  const body = `
${box(0, 0, W, H, { fill: C.ink })}
${box(20, 20, 124, 124, { fill: C.black, border: playing ? C.green : C.slate })}
${artBlock}
${eq}
${lines}`;
  const label = state === 'idle' ? 'Spotify: nothing playing right now' : `Spotify ${playing ? 'now playing' : 'last played'}: ${title} by ${artist}`;
  return doc({ w: W, h: H, title: label, css, body });
}
