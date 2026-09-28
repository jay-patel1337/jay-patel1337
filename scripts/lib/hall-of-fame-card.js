import { C, doc, text, box, sprite, pad } from './svg.js';
import { TROPHY, TROPHY_PAL } from './sprites.js';

const W = 840;

// README card for the Hollow Rush leaderboard. `scores` is [{ name, score }], best first.
export function hallOfFameCard(scores, { enabled = true } = {}) {
  const rows = scores.slice(0, 5);
  const H = 76 + Math.max(1, rows.length) * 30;
  let body = `
${box(0, 0, W, H, { fill: C.ink, border: C.orange })}
${sprite(TROPHY, TROPHY_PAL, 24, 18, 2)}
${text('HOLLOW RUSH · HALL OF FAME', 60, 24, { fill: C.orange })}
${text('▶ CLICK TO PLAY', W - 24, 24, { align: 'right', fill: C.yellow, cls: 'blink' })}`;
  if (!rows.length) {
    body += text(enabled ? 'NO SCORES YET. BE THE FIRST!' : 'LEADERBOARD WARMING UP...', W / 2, 70, { align: 'center', fill: C.lavender });
  }
  const medal = [C.yellow, C.silver, C.orange];
  rows.forEach((r, i) => {
    const y = 64 + i * 30;
    const color = medal[i] || C.cream;
    body += text(`${i + 1}.`, 60, y, { scale: 3, fill: color });
    body += text(r.name, 130, y, { scale: 3, fill: color });
    body += text(pad(r.score, 6), W - 24, y, { scale: 3, align: 'right', fill: C.cream });
  });
  const title = rows.length ? `Hollow Rush hall of fame: ${rows.map((r, i) => `${i + 1}. ${r.name} ${r.score}`).join(', ')}` : 'Hollow Rush hall of fame';
  return doc({ w: W, h: H, title, body });
}
