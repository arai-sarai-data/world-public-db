// Which countries' imports drive deforestation abroad, which products, and where forests are shrinking.
import { getText, getJSON, parseCSV, num, round, stamp } from './util.mjs';

const G = s => `https://ourworldindata.org/grapher/${s}.csv?useColumnShortNames=true`;
const real = r => r.code && !r.code.startsWith('OWID');

export async function build({ log = console.log } = {}) {
  const [imp, com, area, defo, co2] = await Promise.all([
    getText(G('imported-deforestation')), getText(G('deforestation-by-commodity')), getText(G('forest-area-km')),
    getText(G('annual-deforestation')), getText('https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv')]);
  const wb = await getJSON('https://api.worldbank.org/v2/country?format=json&per_page=400');
  const a2 = Object.fromEntries(wb[1].map(c => [c.id, c.iso2Code]));
  const pop = {};
  for (const r of parseCSV(co2)) if (r.iso_code && r.population) pop[r.iso_code + ':' + r.year] = +r.population;

  const latest = (rows, col) => {
    const m = {};
    for (const r of rows) { const v = num(r[col]); if (v == null || !real(r)) continue; if (!m[r.code] || +r.year > m[r.code].year) m[r.code] = { iso: r.code, name: r.entity, year: +r.year, v }; }
    return Object.values(m);
  };

  const imported = latest(parseCSV(imp), 'imported_deforestation_ha').map(x => ({
    iso: x.iso, iso2: a2[x.iso] || null, name: x.name, year: x.year, ha: Math.round(x.v),
    perMillion: pop[x.iso + ':' + x.year] ? round(x.v / (pop[x.iso + ':' + x.year] / 1e6)) : null,
  })).sort((a, b) => b.ha - a.ha);

  const commodities = parseCSV(com).map(r => ({ name: r.entity, year: +r.year, ha: Math.round(+r.forest_loss__ha) })).sort((a, b) => b.ha - a.ha);

  const areaRows = parseCSV(area), byIso = {};
  for (const r of areaRows) { const v = num(r._1a_forestarea); if (v == null || !real(r)) continue; (byIso[r.code] ??= { name: r.entity, s: {} }).s[+r.year] = v; }
  const forest = Object.entries(byIso).map(([iso, { name, s }]) => {
    const ys = Object.keys(s).map(Number).sort((a, b) => a - b), last = ys[ys.length - 1];
    const ch = from => s[from] != null ? { ha: Math.round(s[last] - s[from]), pct: s[from] ? round(100 * (s[last] - s[from]) / s[from]) : null } : null;
    return { iso, iso2: a2[iso] || null, name, last, area: Math.round(s[last]), since1990: ch(1990), since2015: ch(2015) };
  }).filter(f => f.since1990);

  const gross = latest(parseCSV(defo), '_1d_deforestation').map(x => ({ iso: x.iso, iso2: a2[x.iso] || null, name: x.name, year: x.year, ha: Math.round(x.v) })).sort((a, b) => b.ha - a.ha);
  log(`imported ${imported.length}, forest ${forest.length}`);
  return stamp({ imported, commodities, forest, gross: gross.slice(0, 40) }, [
    'Our World in Data – Deforestation and Forest Loss (Pendrill et al. 2019/2022; FAO Global Forest Resources Assessment; CC BY) https://ourworldindata.org/deforestation',
  ]);
}
