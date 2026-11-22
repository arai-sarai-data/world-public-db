// Who really owns the companies that do business with the state?
// Slovakia's Register of Public Sector Partners (RPVS): every company receiving public money must register its beneficial owners.
// Privacy rule: no private individual's name is published here. Only company names, counts and nationalities.
import { getJSON, pool, stamp } from './util.mjs';

const B = 'https://rpvs.gov.sk/opendatav2/';
const q = (set, params) => B + set + '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');

async function all(url, log, label) {
  const out = []; let next = url;
  while (next) { const j = await getJSON(next); out.push(...j.value); next = j['@odata.nextLink']; if (out.length % 2000 < 20) log(`${label}: ${out.length}`); }
  return out;
}
const count = async (set, filter) => (await getJSON(q(set, { $count: 'true', $select: 'Id', $filter: filter })))['@odata.count'];
const activeName = p => (p.PartneriVerejnehoSektora || []).find(x => !x.PlatnostDo) || (p.PartneriVerejnehoSektora || []).slice(-1)[0] || {};

export async function build({ log = console.log } = {}) {
  const activePartners = await count('PartneriVerejnehoSektora', 'PlatnostDo eq null');
  const activeOwners = await count('KonecniUzivateliaVyhod', 'PlatnostDo eq null');
  const slovakOwners = await count('KonecniUzivateliaVyhod', "PlatnostDo eq null and StatnaPrislusnost/StatistickyKod eq '703'");
  log(`partners ${activePartners}, owners ${activeOwners}`);

  // Nationality of current foreign beneficial owners.
  const foreign = await all(q('KonecniUzivateliaVyhod', { $filter: "PlatnostDo eq null and StatnaPrislusnost/StatistickyKod ne '703'", $select: 'Id', $expand: 'StatnaPrislusnost($select=Meno,StatistickyKod)' }), log, 'foreign');
  const nat = {};
  for (const k of foreign) { const s = k.StatnaPrislusnost; const key = s ? s.StatistickyKod : '?'; (nat[key] ??= { code: key, name: s?.Meno || '?', n: 0 }).n++; }

  // Current beneficial owners flagged as public officials (politically exposed persons).
  const peps = await all(q('KonecniUzivateliaVyhod', { $filter: 'JeVerejnyCinitel eq true and PlatnostDo eq null', $select: 'Id,PlatnostOd', $expand: 'Partner($select=Id)' }), log, 'pep');
  const pepBy = {};
  for (const k of peps) if (k.Partner) { const e = (pepBy[k.Partner.Id] ??= { n: 0, since: k.PlatnostOd }); e.n++; if (k.PlatnostOd < e.since) e.since = k.PlatnostOd; }
  const ids = Object.keys(pepBy).map(Number);
  const chunks = []; for (let i = 0; i < ids.length; i += 20) chunks.push(ids.slice(i, i + 20));
  const pepPartners = (await pool(chunks, 3, c => all(q('Partneri', { $filter: `Id in (${c.join(',')})`, $select: 'Id', $expand: 'PartneriVerejnehoSektora($select=ObchodneMeno,Ico,PlatnostDo)' }), () => {}, ''))).flat()
    .map(p => { const a = activeName(p); return { id: p.Id, name: a.ObchodneMeno || null, ico: a.Ico || null, active: !a.PlatnostDo, peps: pepBy[p.Id].n, since: (pepBy[p.Id].since || '').slice(0, 10) }; })
    .filter(p => p.name && p.active).sort((a, b) => b.peps - a.peps || a.since.localeCompare(b.since));

  // Fines imposed by courts for false or missing beneficial-owner data.
  const fined = (await all(q('Partneri', { $filter: 'Pokuta ne null', $select: 'Id', $expand: 'Pokuta,PartneriVerejnehoSektora($select=ObchodneMeno,Ico,PlatnostDo)' }), log, 'fined'))
    .map(p => { const a = activeName(p); return { id: p.Id, name: a.ObchodneMeno || null, ico: a.Ico || null, date: (p.Pokuta?.DatumVytvorenia || '').slice(0, 10), note: p.Pokuta?.Poznamka || '' }; })
    .sort((a, b) => b.date.localeCompare(a.date));

  return stamp({
    activePartners, activeOwners, slovakOwners, foreignOwners: activeOwners - slovakOwners,
    nationalities: Object.values(nat).sort((a, b) => b.n - a.n),
    pepCompanies: pepPartners, pepOwners: peps.length, fined,
  }, ['Register partnerov verejného sektora (RPVS), Ministerstvo spravodlivosti SR – open data https://rpvs.gov.sk/opendatav2']);
}
