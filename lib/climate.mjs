// Net-zero pledges vs. actual greenhouse gas trend (G20 + EU).
import { getText, parseCSV, num, round, stamp } from './util.mjs';

// Net-zero target years as stated in national long-term strategies / laws.
// status: 'set' | 'withdrawn' | 'none'. scope: 'GHG' | 'CO2'.
export const TARGETS = [
  { iso: 'ARG', year: 2050, status: 'set', scope: 'GHG' }, { iso: 'AUS', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'BRA', year: 2050, status: 'set', scope: 'GHG' }, { iso: 'CAN', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'CHN', year: 2060, status: 'set', scope: 'CO2' }, { iso: 'FRA', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'DEU', year: 2045, status: 'set', scope: 'GHG' }, { iso: 'IND', year: 2070, status: 'set', scope: 'GHG' },
  { iso: 'IDN', year: 2060, status: 'set', scope: 'GHG' }, { iso: 'ITA', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'JPN', year: 2050, status: 'set', scope: 'GHG' }, { iso: 'KOR', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'MEX', year: null, status: 'none', scope: null }, { iso: 'RUS', year: 2060, status: 'set', scope: 'GHG' },
  { iso: 'SAU', year: 2060, status: 'set', scope: 'CO2' }, { iso: 'ZAF', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'TUR', year: 2053, status: 'set', scope: 'GHG' }, { iso: 'GBR', year: 2050, status: 'set', scope: 'GHG' },
  { iso: 'USA', year: 2050, status: 'withdrawn', scope: 'GHG' }, { iso: 'EU', year: 2050, status: 'set', scope: 'GHG' },
];

// Least-squares slope over the last `span` years.
function slope(pts) {
  const n = pts.length, mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n;
  let a = 0, b = 0; for (const [x, y] of pts) { a += (x - mx) * (y - my); b += (x - mx) ** 2; }
  return a / b;
}

export async function build({ log = console.log, span = 10 } = {}) {
  const csv = await getText('https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv');
  const rows = parseCSV(csv);
  log(`owid rows ${rows.length}`);
  const out = [];
  for (const t of TARGETS) {
    const sel = rows.filter(r => t.iso === 'EU' ? r.country === 'European Union (27)' : r.iso_code === t.iso);
    const series = sel.map(r => [+r.year, num(r.total_ghg_excluding_lucf)]).filter(p => p[1] != null && p[0] >= 1990).sort((a, b) => a[0] - b[0]);
    if (!series.length) continue;
    const [lastY, lastV] = series[series.length - 1];
    const peak = series.reduce((m, p) => p[1] > m[1] ? p : m);
    const recent = series.filter(p => p[0] > lastY - span);
    const perYear = slope(recent); // Mt CO2e per year (negative = falling)
    const res = {
      iso: t.iso, name: sel[0].country, target: t.year, status: t.status, scope: t.scope,
      lastYear: lastY, last: round(lastV), peakYear: peak[0], peak: round(peak[1]),
      fromPeakPct: round(100 * (lastV - peak[1]) / peak[1]), trend: round(perYear, 2),
      series: series.filter(p => p[0] >= 2000).map(p => [p[0], round(p[1])]),
    };
    if (t.year) {
      const need = lastV / (t.year - lastY); // straight line to zero
      res.needed = round(-need, 2);
      res.paceRatio = round(-perYear / need, 2);
      res.zeroYear = perYear < 0 ? Math.round(lastY + lastV / -perYear) : null; // null = never on current trend
      res.yearsLate = res.zeroYear ? res.zeroYear - t.year : null;
    }
    out.push(res);
  }
  out.sort((a, b) => (a.paceRatio == null) - (b.paceRatio == null) || a.paceRatio - b.paceRatio);
  return stamp({ span, countries: out },
    ['Our World in Data CO2 and Greenhouse Gas Emissions (Jones et al., Global Carbon Project, CC BY) https://github.com/owid/co2-data',
     'Net-zero target years: national long-term strategies (UNFCCC LT-LEDS) https://unfccc.int/process/the-paris-agreement/long-term-strategies']);
}
