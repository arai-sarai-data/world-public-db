// Completed phase 2-4 interventional trials on ClinicalTrials.gov without posted results.
import { getJSON, stamp } from './util.mjs';

const BASE = 'https://clinicaltrials.gov/api/v2/studies';

export async function build({ log = console.log, from = '2018-01-01' } = {}) {
  // Only trials whose primary completion is at least ~13 months ago (1-year posting window + slack).
  const cutoff = new Date(Date.now() - 395 * 864e5).toISOString().slice(0, 10);
  const adv = `AREA[StudyType]INTERVENTIONAL AND AREA[PrimaryCompletionDate]RANGE[${from},${cutoff}] AND (AREA[Phase]PHASE2 OR AREA[Phase]PHASE3 OR AREA[Phase]PHASE4)`;
  const q = `${BASE}?format=json&pageSize=1000&countTotal=true&filter.overallStatus=COMPLETED&filter.advanced=${encodeURIComponent(adv)}&fields=NCTId,BriefTitle,LeadSponsorName,LeadSponsorClass,HasResults,PrimaryCompletionDate,Phase,LocationCountry`;
  const rows = []; let token = null, total = 0;
  do {
    const r = await getJSON(q + (token ? `&pageToken=${token}` : ''));
    total = r.totalCount ?? total;
    for (const s of r.studies) {
      const p = s.protocolSection;
      rows.push({
        id: p.identificationModule.nctId, title: p.identificationModule.briefTitle,
        sponsor: p.sponsorCollaboratorsModule?.leadSponsor?.name || '?', cls: p.sponsorCollaboratorsModule?.leadSponsor?.class || 'UNKNOWN',
        res: !!s.hasResults, date: p.statusModule?.primaryCompletionDateStruct?.date || '',
        phase: (p.designModule?.phases || []).join('/'),
        us: (p.contactsLocationsModule?.locations || []).some(l => l.country === 'United States'),
      });
    }
    token = r.nextPageToken; log(`trials ${rows.length}/${total}`);
  } while (token);

  const agg = (key) => {
    const m = {};
    for (const r of rows) { const k = key(r); (m[k] ??= { n: 0, res: 0 }); m[k].n++; m[k].res += r.res; }
    return Object.entries(m).map(([k, v]) => ({ k, n: v.n, res: v.res, pct: Math.round(1000 * v.res / v.n) / 10 }));
  };
  const sponsorsMap = {};
  for (const r of rows) {
    const s = (sponsorsMap[r.sponsor] ??= { name: r.sponsor, cls: r.cls, n: 0, res: 0, us: 0, missing: [] });
    s.n++; s.res += r.res; s.us += r.us;
    if (!r.res) s.missing.push(r);
  }
  const sponsors = Object.values(sponsorsMap).filter(s => s.n >= 30).map(s => ({
    name: s.name, cls: s.cls, n: s.n, res: s.res, pct: Math.round(1000 * s.res / s.n) / 10, usShare: Math.round(100 * s.us / s.n),
    oldest: s.missing.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map(r => ({ id: r.id, title: r.title, date: r.date, phase: r.phase })),
  })).sort((a, b) => a.pct - b.pct || b.n - a.n);

  return stamp({
    window: { from, to: cutoff }, total: rows.length, withResults: rows.filter(r => r.res).length,
    usSites: agg(r => r.us ? 'US' : 'nonUS'),
    byClass: agg(r => r.cls).sort((a, b) => b.n - a.n),
    byYear: agg(r => r.date.slice(0, 4)).sort((a, b) => a.k.localeCompare(b.k)),
    byPhase: agg(r => r.phase).sort((a, b) => b.n - a.n),
    sponsors,
  }, ['ClinicalTrials.gov API v2 https://clinicaltrials.gov/data-api/api']);
}
