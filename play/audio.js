// Chiptune sound effects and an original looping track, synthesized with WebAudio.
let ac = null;
let master;
let musicBus;
let muted = false;
try {
  muted = localStorage.getItem('hollowrush.muted') === '1';
} catch {}

export function initAudio() {
  if (ac) return;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return;
  ac = new Ctx();
  master = ac.createGain();
  master.gain.value = muted ? 0 : 0.5;
  master.connect(ac.destination);
  musicBus = ac.createGain();
  musicBus.gain.value = 0.32;
  musicBus.connect(master);
}

export function resumeAudio() {
  if (ac && ac.state === 'suspended') ac.resume();
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  try {
    localStorage.setItem('hollowrush.muted', muted ? '1' : '0');
  } catch {}
  if (master) master.gain.setTargetAtTime(muted ? 0 : 0.5, ac.currentTime, 0.02);
  return muted;
}

// 12.5% duty pulse wave: the classic NES lead sound.
let pulse = null;
function pulseWave() {
  if (pulse) return pulse;
  const n = 32;
  const re = new Float32Array(n);
  const im = new Float32Array(n);
  for (let k = 1; k < n; k++) im[k] = (2 / (k * Math.PI)) * Math.sin(k * Math.PI * 0.125);
  pulse = ac.createPeriodicWave(re, im);
  return pulse;
}

function tone({ type = 'square', f0, f1 = f0, dur = 0.1, vol = 0.2, at = 0, bus = master }) {
  if (!ac) return;
  const t = ac.currentTime + at;
  const o = ac.createOscillator();
  const g = ac.createGain();
  if (type === 'pulse') o.setPeriodicWave(pulseWave());
  else o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g).connect(bus);
  o.start(t);
  o.stop(t + dur + 0.02);
}

let noiseBuf = null;
function noise({ dur = 0.1, vol = 0.2, freq = 3000, q = 1, at = 0, bus = master, sweepTo = null }) {
  if (!ac) return;
  if (!noiseBuf) {
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = ac.currentTime + at;
  const src = ac.createBufferSource();
  src.buffer = noiseBuf;
  const f = ac.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  f.Q.value = q;
  const g = ac.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  src.connect(f).connect(g).connect(bus);
  src.start(t);
  src.stop(t + dur + 0.02);
}

export const sfx = {
  jump: () => tone({ type: 'square', f0: 260, f1: 620, dur: 0.12, vol: 0.12 }),
  shunpo: () => {
    tone({ type: 'triangle', f0: 500, f1: 1400, dur: 0.14, vol: 0.18 });
    noise({ dur: 0.12, vol: 0.12, freq: 6000, sweepTo: 2000 });
  },
  slash: () => {
    noise({ dur: 0.09, vol: 0.22, freq: 5000, sweepTo: 1200, q: 2 });
    tone({ type: 'square', f0: 220, f1: 90, dur: 0.08, vol: 0.08 });
  },
  hit: () => {
    tone({ type: 'square', f0: 160, f1: 50, dur: 0.14, vol: 0.2 });
    noise({ dur: 0.1, vol: 0.2, freq: 900 });
  },
  kill: () => {
    noise({ dur: 0.25, vol: 0.25, freq: 1800, sweepTo: 200 });
    tone({ type: 'square', f0: 330, f1: 80, dur: 0.2, vol: 0.12 });
  },
  orb: () => {
    tone({ type: 'pulse', f0: 988, dur: 0.05, vol: 0.12 });
    tone({ type: 'pulse', f0: 1319, dur: 0.08, vol: 0.12, at: 0.05 });
  },
  heart: () => [523, 659, 784].forEach((f, i) => tone({ type: 'pulse', f0: f, dur: 0.1, vol: 0.14, at: i * 0.07 })),
  hurt: () => {
    tone({ type: 'sawtooth', f0: 300, f1: 70, dur: 0.3, vol: 0.18 });
    noise({ dur: 0.2, vol: 0.15, freq: 600 });
  },
  parry: () => {
    tone({ type: 'square', f0: 1760, f1: 1320, dur: 0.12, vol: 0.14 });
    tone({ type: 'triangle', f0: 2640, dur: 0.15, vol: 0.1, at: 0.02 });
  },
  getsuga: () => {
    noise({ dur: 0.5, vol: 0.28, freq: 400, sweepTo: 5000, q: 0.8 });
    tone({ type: 'sawtooth', f0: 110, f1: 880, dur: 0.35, vol: 0.14 });
    tone({ type: 'square', f0: 220, f1: 1760, dur: 0.3, vol: 0.08, at: 0.05 });
  },
  cero: () => tone({ type: 'sawtooth', f0: 90, f1: 400, dur: 0.4, vol: 0.12 }),
  bankai: () => {
    [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => tone({ type: 'pulse', f0: f, dur: 0.12, vol: 0.15, at: i * 0.06 }));
    noise({ dur: 0.8, vol: 0.2, freq: 200, sweepTo: 3000, at: 0.1 });
  },
  gameOver: () => [523, 494, 440, 392, 330, 262].forEach((f, i) => tone({ type: 'pulse', f0: f, dur: 0.2, vol: 0.15, at: i * 0.16 })),
  start: () => [392, 523, 659, 784].forEach((f, i) => tone({ type: 'pulse', f0: f, dur: 0.1, vol: 0.14, at: i * 0.07 })),
  select: () => tone({ type: 'pulse', f0: 880, dur: 0.05, vol: 0.1 }),
};

// ── Music: an original 4-bar loop in A minor (Am – F – G – E) ────────────────
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const BPM = 144;
const STEP = 60 / BPM / 2; // eighth notes
const BASS = [45, 45, 57, 45, 45, 57, 45, 52, 41, 41, 53, 41, 41, 53, 41, 48, 43, 43, 55, 43, 43, 55, 43, 50, 40, 40, 52, 40, 40, 52, 44, 47];
const LEAD = [69, 0, 72, 76, 74, 72, 71, 72, 69, 0, 65, 69, 72, 0, 69, 0, 71, 0, 74, 79, 77, 76, 74, 71, 68, 0, 71, 76, 0, 74, 72, 71];

let timer = null;
let nextTime = 0;
let step = 0;

export function startMusic() {
  if (!ac || timer) return;
  nextTime = ac.currentTime + 0.05;
  step = 0;
  timer = setInterval(() => {
    while (nextTime < ac.currentTime + 0.15) {
      const at = nextTime - ac.currentTime;
      const i = step % BASS.length;
      tone({ type: 'triangle', f0: hz(BASS[i]), dur: STEP * 0.9, vol: 0.5, at, bus: musicBus });
      if (LEAD[i]) tone({ type: 'pulse', f0: hz(LEAD[i]), dur: STEP * 0.85, vol: 0.16, at, bus: musicBus });
      if (i % 4 === 0) tone({ type: 'sine', f0: 150, f1: 40, dur: 0.12, vol: 0.6, at, bus: musicBus });
      if (i % 2 === 1) noise({ dur: 0.03, vol: 0.12, freq: 8000, q: 1.5, at, bus: musicBus });
      if (i % 8 === 4) noise({ dur: 0.1, vol: 0.18, freq: 1800, q: 0.8, at, bus: musicBus });
      nextTime += STEP;
      step++;
    }
  }, 25);
}

export function stopMusic() {
  clearInterval(timer);
  timer = null;
}
