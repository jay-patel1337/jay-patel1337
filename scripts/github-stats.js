// Collects the numbers behind the HUD, language XP bars and live achievements.
// With GITHUB_TOKEN (GitHub Actions) it uses GraphQL; without one it falls back to
// the public REST API plus the public contribution calendar, which is enough locally.

const UA = { 'User-Agent': 'jay-patel1337-profile' };

export async function fetchStats(login, token) {
  const data = token ? await viaGraphQL(login, token) : await viaPublic(login);
  const { current, longest } = streaks(data.days);
  const langBytes = {};
  for (const repo of data.repos) {
    if (repo.name.toLowerCase() === login.toLowerCase()) continue; // this repo's scripts are not "my" code
    for (const [name, bytes] of Object.entries(repo.languages)) langBytes[name] = (langBytes[name] || 0) + bytes;
  }
  return {
    contributions: data.days.reduce((a, d) => a + d.count, 0),
    currentStreak: current,
    longestStreak: longest,
    stars: data.repos.reduce((a, r) => a + r.stars, 0),
    repos: data.repos.length,
    languages: Object.entries(langBytes)
      .map(([name, bytes]) => ({ name, bytes }))
      .sort((a, b) => b.bytes - a.bytes),
    repoStars: Object.fromEntries(data.repos.map((r) => [r.name, r.stars])),
  };
}

// Current streak ends today, or yesterday if today has no contributions yet.
export function streaks(days) {
  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let i = days.length - 1;
  if (i >= 0 && days[i].count === 0) i--;
  let current = 0;
  while (i >= 0 && days[i].count > 0) {
    current++;
    i--;
  }
  return { current, longest };
}

async function getJSON(url, headers = {}) {
  const res = await fetch(url, { headers: { ...UA, Accept: 'application/vnd.github+json', ...headers } });
  if (!res.ok) throw new Error(`${url} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function viaGraphQL(login, token) {
  const query = `query($login:String!){user(login:$login){
    repositories(first:100,ownerAffiliations:OWNER,privacy:PUBLIC,isFork:false){
      nodes{name stargazerCount languages(first:20){edges{size node{name}}}}}
    contributionsCollection{contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}`;
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...UA, Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { login } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) throw new Error(`GraphQL failed: ${JSON.stringify(json.errors || json)}`);
  const user = json.data.user;
  return {
    repos: user.repositories.nodes.map((r) => ({
      name: r.name,
      stars: r.stargazerCount,
      languages: Object.fromEntries(r.languages.edges.map((e) => [e.node.name, e.size])),
    })),
    days: user.contributionsCollection.contributionCalendar.weeks
      .flatMap((w) => w.contributionDays)
      .map((d) => ({ date: d.date, count: d.contributionCount })),
  };
}

async function viaPublic(login) {
  const list = await getJSON(`https://api.github.com/users/${login}/repos?per_page=100&type=owner`);
  const repos = [];
  for (const r of list.filter((r) => !r.fork && !r.private)) {
    repos.push({ name: r.name, stars: r.stargazers_count, languages: await getJSON(r.languages_url) });
  }
  return { repos, days: await scrapeCalendar(login) };
}

async function scrapeCalendar(login) {
  const res = await fetch(`https://github.com/users/${login}/contributions`, { headers: UA });
  if (!res.ok) throw new Error(`contributions page -> ${res.status}`);
  const html = await res.text();
  const dates = {};
  for (const m of html.matchAll(/<td[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"/g)) dates[m[2]] = m[1];
  const days = [];
  for (const m of html.matchAll(/<tool-tip[^>]*for="([^"]+)"[^>]*>\s*(No|\d+) contributions?/g)) {
    if (dates[m[1]]) days.push({ date: dates[m[1]], count: m[2] === 'No' ? 0 : Number(m[2]) });
  }
  if (!days.length) throw new Error('could not parse contribution calendar');
  return days.sort((a, b) => a.date.localeCompare(b.date));
}
