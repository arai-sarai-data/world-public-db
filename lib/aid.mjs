// Humanitarian appeals: money requested vs. money received, and pledges not yet paid (OCHA FTS).
import { getJSON, pool, stamp } from './util.mjs';

const API = 'https://api.hpc.tools/v1/public';
const top = (objs, n = 10) => (objs || []).slice().sort((a, b) => b.totalFunding - a.totalFunding).slice(0, n).map(o => [o.name, Math.round(o.totalFunding)]);

export async function build({ log = console.log, years = null } = {}) {
  const y = new Date().getUTCFullYear();
  years ??= [y - 3, y - 2, y - 1, y];
  const plans = [], donors = {};
  for (const yr of years) {
    const list = (await getJSON(`${API}/plan/year/${yr}`)).data;
    log(`${yr}: ${list.length} plans`);
    await pool(list, 4, async p => {
      try {
        const d = (await getJSON(`${API}/fts/flow?planId=${p.id}&groupby=organization`)).data;
        const ft = d.report1?.fundingTotals, pt = d.report1?.pledgeTotals;
        plans.push({
          id: p.id, year: yr, name: p.planVersion?.name, code: p.planVersion?.code,
          type: (p.categories || []).find(c => c.group === 'planType')?.name || null,
          iso: (p.locations || []).filter(l => l.adminLevel === 0).map(l => l.iso3).filter(Boolean),
          req: Math.round(p.revisedRequirements || 0), funded: Math.round(ft?.total || 0), pledged: Math.round(pt?.total || 0),
          donors: top(ft?.objects?.[0]?.singleFundingObjects, 6), pledgers: top(pt?.objects?.[0]?.singleFundingObjects, 6),
        });
      } catch (e) { log(`plan ${p.id} failed: ${e.message}`); }
    });
    try {
      const g = (await getJSON(`${API}/fts/flow?year=${yr}&groupby=organization`)).data;
      donors[yr] = { funding: top(g.report1?.fundingTotals?.objects?.[0]?.singleFundingObjects, 25), total: Math.round(g.report1?.fundingTotals?.total || 0) };
    } catch (e) { log(`donors ${yr} failed: ${e.message}`); }
  }
  for (const p of plans) { p.gap = Math.max(0, p.req - p.funded); p.cov = p.req ? Math.round(1000 * p.funded / p.req) / 10 : null; }
  plans.sort((a, b) => b.year - a.year || b.gap - a.gap);
  const totals = years.map(yr => {
    const ps = plans.filter(p => p.year === yr);
    const req = ps.reduce((s, p) => s + p.req, 0), funded = ps.reduce((s, p) => s + Math.min(p.funded, p.req || p.funded), 0);
    return { year: yr, plans: ps.length, req, funded, pledged: ps.reduce((s, p) => s + p.pledged, 0), cov: req ? Math.round(1000 * funded / req) / 10 : null };
  });
  return stamp({ years, totals, plans, donors }, ['UN OCHA Financial Tracking Service (FTS) https://fts.unocha.org/ (API: https://api.hpc.tools/docs/v1/)']);
}
