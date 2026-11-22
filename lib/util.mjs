// Shared helpers. Works in Node 20+ and in browsers (no Node-only APIs).
export const UA = { 'User-Agent': 'world-public-db/1.0 (+https://github.com/arai-sarai-data/world-public-db)' };

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function getJSON(url, { tries = 5, headers = {} } = {}) {
  let last;
  for (let k = 0; k < tries; k++) {
    try {
      const r = await fetch(url, { headers: { Accept: 'application/json', ...headers } });
      if (r.status === 429 || r.status >= 500) { last = new Error(`HTTP ${r.status} ${url}`); await sleep(1500 * (k + 1)); continue; }
      if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
      return await r.json();
    } catch (e) { last = e; await sleep(1000 * (k + 1)); }
  }
  throw last;
}

export async function getText(url, { tries = 4 } = {}) {
  let last;
  for (let k = 0; k < tries; k++) {
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
      return await r.text();
    } catch (e) { last = e; await sleep(1500 * (k + 1)); }
  }
  throw last;
}

// Run fn over items with limited concurrency.
export async function pool(items, n, fn) {
  const out = new Array(items.length); let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const j = i++; out[j] = await fn(items[j], j); }
  }));
  return out;
}

// Minimal RFC4180 CSV parser -> array of objects.
export function parseCSV(text) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; }
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f !== '' || row.length) { row.push(f); rows.push(row); }
  const head = rows.shift();
  return rows.filter(r => r.length === head.length).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]])));
}

export const num = v => (v === '' || v == null || isNaN(+v)) ? null : +v;
export const round = (v, d = 1) => v == null ? null : Math.round(v * 10 ** d) / 10 ** d;

export function quantile(sorted, p) {
  if (!sorted.length) return null;
  const i = (sorted.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

export function stamp(obj, sources) {
  return { generated: new Date().toISOString(), sources, ...obj };
}
