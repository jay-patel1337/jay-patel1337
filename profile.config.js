// Everything the profile says about you lives here.
// Edit, then run `npm run assets` to regenerate the SVGs in assets/.

export default {
  login: 'jay-patel1337',
  name: 'Jay Patel',
  role: 'Computer Engineering',
  school: 'Silver Oak University',
  tagline: "I'll wait where the stars forget to shine.",
  timezone: 'Asia/Kolkata',

  about: ['Learning by building.', 'C/C++ at heart, web on the side.'],
  quest: 'Master Data Structures & Algorithms',
  sideQuest: 'Ship more web apps',

  // Player card bars (0..1). Purely for fun.
  bars: [
    { label: 'HP', note: 'SLEEP', value: 0.4, color: 'red' },
    { label: 'MP', note: 'CAFFEINE', value: 0.9, color: 'blue' },
    { label: 'XP', note: 'CODE', value: 0.7, color: 'green' },
  ],

  links: {
    linkedin: 'https://www.linkedin.com/in/jay-patel-027200377',
    instagram: 'https://www.instagram.com/jayx_xpatel',
    email: 'jaypatel2007.bp@gmail.com',
  },

  inventory: [
    { icon: 'c', label: 'C' },
    { icon: 'cpp', label: 'C++' },
    { icon: 'python', label: 'PYTHON' },
    { icon: 'html', label: 'HTML' },
    { icon: 'css', label: 'CSS' },
    { icon: 'flask', label: 'FLASK' },
    { icon: 'git', label: 'GIT' },
    { icon: 'github', label: 'GITHUB' },
    { icon: 'vscode', label: 'VSCODE' },
    { icon: 'mystery', label: '???' },
  ],

  // state: 'done' | 'active' | 'locked'. Parents must sit in the previous tier;
  // nodes are stacked in the order listed, so keep children near their parents.
  skillTree: [
    { id: 'c', label: 'C', tier: 0, state: 'done' },
    { id: 'python', label: 'PYTHON', tier: 0, state: 'done' },
    { id: 'html', label: 'HTML', tier: 0, state: 'done' },
    { id: 'cpp', label: 'C++', tier: 1, state: 'done', from: ['c'] },
    { id: 'ptr', label: 'POINTERS', tier: 1, state: 'done', from: ['c'] },
    { id: 'flask', label: 'FLASK', tier: 1, state: 'done', from: ['python', 'html'] },
    { id: 'css', label: 'CSS', tier: 1, state: 'done', from: ['html'] },
    { id: 'oop', label: 'OOP', tier: 2, state: 'done', from: ['cpp'] },
    { id: 'backtrack', label: 'BACKTRACK', tier: 2, state: 'done', from: ['cpp'] },
    { id: 'dsa', label: 'DSA', tier: 2, state: 'active', from: ['ptr'] },
    { id: 'sql', label: 'SQL', tier: 2, state: 'locked', from: ['flask'] },
    { id: 'js', label: 'JAVASCRIPT', tier: 2, state: 'locked', from: ['css'] },
    { id: 'stl', label: 'STL', tier: 3, state: 'locked', from: ['oop'] },
    { id: 'cp', label: 'COMP PROG', tier: 3, state: 'locked', from: ['backtrack', 'dsa'] },
    { id: 'react', label: 'REACT', tier: 3, state: 'locked', from: ['js'] },
  ],

  // Level-select cards, in play order. `stars` is refreshed from GitHub on live builds.
  levels: [
    {
      repo: 'C_self',
      world: '1-1',
      status: 'CLEARED',
      lang: 'C',
      desc: 'Self-taught C: 11 chapters, problem sets, logic drills and DS lab work.',
    },
    {
      repo: 'CPP_self',
      world: '1-2',
      status: 'CLEARED',
      lang: 'C++',
      desc: 'Leveling up in C++: language basics, OOP and experiments.',
    },
    {
      repo: 'codealpha_tasks',
      world: '1-3',
      status: 'BOSS',
      lang: 'C++',
      desc: 'CodeAlpha internship: CGPA calc, login system, Sudoku solver, bank system.',
    },
    {
      repo: 'FoodiePieUp',
      world: '2-1',
      status: 'CLEARED',
      lang: 'FLASK',
      desc: 'Nutrition tracker: meal planner with calorie + macro calc and a water log.',
    },
  ],

  // `when` receives live stats; omit it for always-unlocked trophies.
  achievements: [
    { title: 'INTERN', desc: 'CODEALPHA C++' },
    { title: 'BILINGUAL', desc: 'HELLO WORLD C+C++' },
    { title: 'WEB DEBUT', desc: 'SHIPPED FLASK APP' },
    { title: 'FIRST STAR', desc: 'GET A GITHUB STAR', when: (s) => s.stars >= 1 },
    { title: 'ON FIRE', desc: '7-DAY STREAK', when: (s) => s.longestStreak >= 7 },
    { title: 'CENTURION', desc: '100 CONTRIBS/YEAR', when: (s) => s.contributions >= 100 },
  ],

  // Daily dialogue box. One is picked per day (in `timezone`) and cycles through all.
  quotes: [
    { series: 'bleach', speaker: 'AIZEN', text: 'Admiration is the emotion furthest from understanding.' },
    { series: 'erased', speaker: 'KAYO', text: 'Are you stupid?' },
    { series: 'another', speaker: 'KOUICHI', text: 'First of all: Mei Misaki. You exist, right?' },
    { series: 'bleach', speaker: 'ICHIGO', text: 'Just surviving is meaningless. The only thing I want to do is... WIN!' },
    { series: 'erased', speaker: 'KAYO', text: "I feel like if I keep on acting, one day, I'll become real too." },
    { series: 'another', speaker: 'MEI', text: 'That\'s so cute. Did you think I was a ghost?' },
    { series: 'bleach', speaker: 'URAHARA', text: "That wasn't very nice... I do believe you've killed my hat." },
    { series: 'another', speaker: 'MOCHIZUKI', text: 'I feel uneasy about everything.' },
    { series: 'bleach', speaker: 'AIZEN', text: "Since when were you under the impression that I wasn't using Kyoka Suigetsu?" },
    { series: 'bleach', speaker: 'ZANGETSU', text: 'Ichigo, trust me... You are not fighting alone.' },
    { series: 'bleach', speaker: 'KENPACHI', text: "Sanity? I don't remember having such a useless thing." },
    { series: 'bleach', speaker: 'AIZEN', text: "It's very difficult for me to step on an ant without crushing it." },
  ],

  seriesNames: { bleach: 'BLEACH', erased: 'ERASED', another: 'ANOTHER' },
};
