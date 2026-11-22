// Sanity checks on built data. Prints a report; exits 1 only when a file is present but clearly broken.
import { readFile } from 'node:fs/promises';

const rules = {
  retractions: d => [d.total > 10000, d.ranked.length > 20, d.ranked.every(w => w.citesAfter >= 0 && w.citesAfter <= w.cites)],
  trials: d => [d.total > 5000, d.withResults <= d.total, d.sponsors.every(s => s.res <= s.n && s.pct >= 0 && s.pct <= 100)],
  climate: d => [d.countries.length >= 19, d.countries.every(c => c.last > 0)],
  procurement: d => [d.orders > 1000, d.items.length > 10, d.items.every(i => i.p10 <= i.p50 && i.p50 <= i.p90)],
  aid: d => [d.plans.length > 20, d.plans.every(p => p.req >= 0 && p.funded >= 0)],
  rights: d => [d.countries.length > 150, d.countries.every(c => c.overall[0] >= 0 && c.overall[0] <= 100)],
  forests: d => [d.imported.length > 50, d.commodities.length > 3, d.forest.length > 150],
  owners: d => [d.activePartners > 1000, d.activeOwners >= d.slovakOwners, d.pepCompanies.every(p => p.name)],
};

let broken = 0;
for (const [name, rule] of Object.entries(rules)) {
  let d;
  try { d = JSON.parse(await readFile(new URL(`../data/${name}.json`, import.meta.url), 'utf8')); }
  catch { console.log(`- ${name}: no data file yet`); continue; }
  let ok;
  try { ok = rule(d); } catch (e) { ok = [false]; console.log(`  ${e.message}`); }
  const pass = ok.every(Boolean);
  if (!pass) broken++;
  console.log(`${pass ? '✓' : '✗'} ${name}: ${ok.map(x => x ? 'ok' : 'FAIL').join(' ')} (generated ${d.generated})`);
}
process.exit(broken ? 1 : 0);
