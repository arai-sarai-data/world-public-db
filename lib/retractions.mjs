// Retracted papers that keep being cited.
// OpenAlex (retraction flag, citations by year) + Crossref (retraction notice dates, incl. Retraction Watch).
import { getJSON, pool, stamp, UA } from './util.mjs';

const OA = 'https://api.openalex.org/works';

async function groupBy(key) {
  const r = await getJSON(`${OA}?filter=is_retracted:true&group_by=${key}&per-page=200`);
  return r.group_by.map(g => ({ key: g.key, name: g.key_display_name, n: g.count }));
}

async function retractionDate(doi) {
  const r = await getJSON(`https://api.crossref.org/works?filter=updates:${encodeURIComponent(doi)}&rows=20`, { headers: UA });
  let date = null, notice = null;
  for (const it of r.message.items) for (const u of it['update-to'] || []) {
    if (u.type === 'retraction' && u.DOI.toLowerCase() === doi.toLowerCase()) {
      const d = u.updated['date-parts'][0].map((x, i) => i ? String(x).padStart(2, '0') : String(x)).join('-');
      if (!date || d < date) { date = d; notice = it.DOI; }
    }
  }
  return { date, notice };
}

export async function build({ log = console.log, topN = 400 } = {}) {
  const meta = await getJSON(`${OA}?filter=is_retracted:true&per-page=1`);
  const [byYear, byField, byCountry] = await Promise.all([
    groupBy('publication_year'), groupBy('primary_topic.field.id'), groupBy('authorships.countries')]);
  log(`retracted works: ${meta.meta.count}`);

  const works = [];
  for (let p = 1; p <= Math.ceil(topN / 200); p++) {
    const r = await getJSON(`${OA}?filter=is_retracted:true,type:article&sort=cited_by_count:desc&per-page=200&page=${p}&select=id,doi,title,publication_year,cited_by_count,counts_by_year,primary_topic,primary_location`);
    for (const w of r.results) if (w.doi) works.push({
      id: w.id.split('/').pop(), doi: w.doi.replace('https://doi.org/', ''), title: w.title, year: w.publication_year,
      cites: w.cited_by_count, byYear: Object.fromEntries((w.counts_by_year || []).map(x => [x.year, x.cited_by_count])),
      field: w.primary_topic?.field?.display_name || null, journal: w.primary_location?.source?.display_name || null,
    });
  }
  log(`top works: ${works.length}`);
  await pool(works, 3, async w => { try { Object.assign(w, await retractionDate(w.doi)); } catch { w.date = null; } });

  const thisYear = new Date().getUTCFullYear();
  const ranked = works.filter(w => w.date).map(w => {
    const ry = +w.date.slice(0, 4);
    const after = Object.entries(w.byYear).filter(([y]) => +y > ry).reduce((s, [, c]) => s + c, 0);
    return { ...w, retracted: w.date, citesAfter: after, lastYear: w.byYear[thisYear - 1] || 0, byYear: undefined };
  }).filter(w => w.citesAfter > 0).sort((a, b) => b.citesAfter - a.citesAfter).slice(0, 150);

  return stamp({
    total: meta.meta.count, checked: works.length, dated: works.filter(w => w.date).length,
    byYear: byYear.filter(g => +g.key >= 1990).sort((a, b) => a.key - b.key),
    byField: byField.slice(0, 26), byCountry: byCountry.slice(0, 30), ranked,
  }, ['OpenAlex (CC0) https://openalex.org', 'Crossref + Retraction Watch Database https://www.crossref.org/']);
}
