// Women, Business and the Law: laws on paper vs. support systems vs. how they are enforced, by country.
import { getJSON, round, stamp } from './util.mjs';

export const TOPICS = ['SAF', 'MOB', 'WRK', 'PAY', 'MAR', 'PAR', 'CHC', 'ENT', 'AST', 'PEN'];
const KINDS = ['LAW', 'SFR', 'ENF'];
const WB = 'https://api.worldbank.org/v2';

export async function build({ log = console.log } = {}) {
  const cs = await getJSON(`${WB}/country?format=json&per_page=400`);
  const meta = Object.fromEntries(cs[1].filter(c => c.region.id !== 'NA').map(c => [c.id, { iso2: c.iso2Code, name: c.name, region: c.region.value.trim(), income: c.incomeLevel.value }]));
  const ids = [...KINDS.map(k => `GD_WBL_OVL_${k}`), ...TOPICS.flatMap(t => KINDS.map(k => `GD_WBL_${t}_${k}_T`))];
  const val = {}; let year = null;
  for (const id of ids) {
    const r = await getJSON(`${WB}/country/all/indicator/${id}?format=json&per_page=20000&mrv=1&source=14`);
    for (const d of r[1] || []) if (meta[d.countryiso3code] && d.value != null) { (val[d.countryiso3code] ??= {})[id] = d.value; year = d.date; }
  }
  const parl = await getJSON(`${WB}/country/all/indicator/SG.GEN.PARL.ZS?format=json&per_page=20000&mrv=1`);
  for (const d of parl[1] || []) if (meta[d.countryiso3code] && d.value != null) (val[d.countryiso3code] ??= {}).parl = [round(d.value), d.date];
  log(`countries with data: ${Object.keys(val).length}`);
  const g = (v, t, k) => { const x = v[t === 'OVL' ? `GD_WBL_OVL_${k}` : `GD_WBL_${t}_${k}_T`]; return x == null ? null : round(x); };
  const countries = Object.entries(val).filter(([, v]) => v.GD_WBL_OVL_LAW != null).map(([iso, v]) => ({
    iso, ...meta[iso],
    overall: KINDS.map(k => g(v, 'OVL', k)),
    topics: Object.fromEntries(TOPICS.map(t => [t, KINDS.map(k => g(v, t, k))])),
    parl: v.parl || null,
  }));
  countries.sort((a, b) => b.overall[0] - a.overall[0]);
  return stamp({ year, topics: TOPICS, countries },
    ['World Bank, Women, Business and the Law (CC BY 4.0) https://wbl.worldbank.org/', 'World Bank WDI SG.GEN.PARL.ZS (IPU) https://data.worldbank.org/indicator/SG.GEN.PARL.ZS']);
}
