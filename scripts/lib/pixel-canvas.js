// Tiny pixel grid used to compose sprite frames from parts.
// Frames come out as character rows + a palette, which both the SVG renderer
// (README assets) and the canvas game can draw.

export class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.px = Array.from({ length: h }, () => Array(w).fill('.'));
  }

  set(x, y, c) {
    if (c === '.' || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.px[y][x] = c;
  }

  get(x, y) {
    return x < 0 || y < 0 || x >= this.w || y >= this.h ? '.' : this.px[y][x];
  }

  // Copy an ASCII stamp; '.' is transparent.
  stamp(rows, x, y) {
    rows.forEach((row, ry) => [...row].forEach((c, rx) => this.set(x + rx, y + ry, c)));
    return this;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    return this;
  }

  // Thick line from (x0,y0) to (x1,y1); `paint(t, i)` picks the char for step t∈[0,1] and offset i across the width.
  band(x0, y0, x1, y1, width, paint) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 || 1;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const x = Math.round(x0 + (x1 - x0) * t);
      const y = Math.round(y0 + (y1 - y0) * t);
      for (let i = 0; i < width; i++) this.set(x + i, y, paint(t, i));
    }
    return this;
  }

  // 1px outline around every opaque pixel (4-neighbourhood).
  outline(c = 'x') {
    const add = [];
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        if (this.px[y][x] !== '.') continue;
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !['.', c].includes(this.get(x + dx, y + dy)))) add.push([x, y]);
      }
    for (const [x, y] of add) this.px[y][x] = c;
    return this;
  }

  rows() {
    return this.px.map((r) => r.join(''));
  }
}

export function flipRows(rows) {
  return rows.map((r) => [...r].reverse().join(''));
}
