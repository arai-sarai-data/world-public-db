// Shared runtime for all sites: language switch, data loading, tables, bars, formatting.
export const LANGS = [['ja', '日本語'], ['en', 'English'], ['zh', '中文'], ['es', 'Español']];
const LOC = { ja: 'ja-JP', en: 'en-US', zh: 'zh-CN', es: 'es-ES' };

const C = {
  ja: { home: '世界の公共データベース', search: '検索', more: 'さらに表示', sources: 'データの出典', updated: 'データ更新日', method: '計算方法と注意点', loading: '読み込み中…', error: 'データを読み込めませんでした。時間をおいて再読み込みしてください。', share: 'Xで共有', rank: '順位', all: 'すべて', code: 'ソースコードと再現手順', license: '各データの利用条件は出典に従います。このサイトの集計結果は CC BY 4.0 で再利用できます。', noMatch: '該当するデータはありません' },
  en: { home: 'World Public Databases', search: 'Search', more: 'Show more', sources: 'Data sources', updated: 'Data updated', method: 'Method and caveats', loading: 'Loading…', error: 'Could not load the data. Please reload in a moment.', share: 'Share on X', rank: 'Rank', all: 'All', code: 'Source code and how to reproduce', license: 'Each dataset keeps its own licence. The aggregated results on this site may be reused under CC BY 4.0.', noMatch: 'No matching data' },
  zh: { home: '世界公共数据库', search: '搜索', more: '显示更多', sources: '数据来源', updated: '数据更新日期', method: '计算方法与注意事项', loading: '加载中…', error: '无法加载数据，请稍后刷新。', share: '分享到X', rank: '排名', all: '全部', code: '源代码与复现方法', license: '各数据遵循其来源的使用条款。本站的统计结果可依 CC BY 4.0 再利用。', noMatch: '没有符合条件的数据' },
  es: { home: 'Bases de datos públicas del mundo', search: 'Buscar', more: 'Mostrar más', sources: 'Fuentes de datos', updated: 'Datos actualizados', method: 'Método y advertencias', loading: 'Cargando…', error: 'No se pudieron cargar los datos. Vuelve a cargar en un momento.', share: 'Compartir en X', rank: 'Puesto', all: 'Todas', code: 'Código fuente y cómo reproducirlo', license: 'Cada conjunto de datos mantiene su licencia. Los resultados agregados de este sitio pueden reutilizarse con CC BY 4.0.', noMatch: 'No hay datos que coincidan' },
};

export const REPO = 'https://github.com/arai-sarai-data/world-public-db';

export function getLang() {
  const h = location.hash.slice(1);
  if (C[h]) return h;
  try { const s = localStorage.getItem('wpdb-lang'); if (C[s]) return s; } catch { }
  const n = (navigator.language || 'en').slice(0, 2);
  return C[n] ? n : 'en';
}

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function fmt(n, lang, opt = {}) {
  if (n == null || Number.isNaN(n)) return '–';
  return new Intl.NumberFormat(LOC[lang], opt).format(n);
}
export function compact(n, lang) {
  if (n == null) return '–';
  return new Intl.NumberFormat(LOC[lang], { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}
export function date(s, lang) {
  if (!s) return '–';
  const d = new Date(s); if (isNaN(d)) return s;
  return new Intl.DateTimeFormat(LOC[lang], { year: 'numeric', month: 'short', day: 'numeric' }).format(d);
}

export function meter(v, max, cls = '') {
  const w = Math.max(0, Math.min(100, (v / max) * 100));
  return `<span class="meter ${cls}"><i><em style="width:${w}%"></em></i></span>`;
}

// rows: [{label, value, text, cls}] -> horizontal bars sharing one scale.
export function bars(rows, { max } = {}) {
  const m = max ?? Math.max(...rows.map(r => r.value), 1);
  return `<div class="bars">${rows.map(r => `<div class="brow"><span class="lab" title="${esc(r.label)}">${esc(r.label)}</span><span class="track"><em class="${r.cls || ''}" style="width:${Math.max(0.5, 100 * r.value / m)}%"></em></span><span class="val">${r.text ?? r.value}</span></div>`).join('')}</div>`;
}

export function shareX(text, lang) {
  const u = `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(location.href.split('#')[0] + '#' + lang)}`;
  return `<a class="share" href="${u}" target="_blank" rel="noopener">𝕏 ${C[lang].share}</a>`;
}

// Sortable, searchable table. cols: [{k, h, n:bool, f:(row)=>html, s:(row)=>sortValue}]
export function table(host, { cols, rows, lang, search = r => '', pageSize = 25, sortKey = null, sortAsc = false, rank = true }) {
  let q = '', k = sortKey, asc = sortAsc, shown = pageSize;
  const c = C[lang];
  host.innerHTML = `<div class="tools"><input type="search" placeholder="${c.search}" aria-label="${c.search}"></div><div class="tbl"><table><thead></thead><tbody></tbody></table></div><div class="more"></div>`;
  const inp = host.querySelector('input'), thead = host.querySelector('thead'), tbody = host.querySelector('tbody'), more = host.querySelector('.more');
  const val = (col, r) => col.s ? col.s(r) : r[col.k];
  function draw() {
    let list = rows.filter(r => !q || search(r).toLowerCase().includes(q));
    if (k) { const col = cols.find(x => x.k === k); list = [...list].sort((a, b) => { const x = val(col, a), y = val(col, b); if (x == null) return 1; if (y == null) return -1; return (x > y ? 1 : x < y ? -1 : 0) * (asc ? 1 : -1); }); }
    thead.innerHTML = `<tr>${rank ? `<th class="n">${c.rank}</th>` : ''}${cols.map(col => `<th data-k="${col.k}" class="${col.n ? 'n' : ''} ${col.k === k ? 'sorted' + (asc ? ' asc' : '') : ''}" scope="col">${col.h}</th>`).join('')}</tr>`;
    tbody.innerHTML = list.slice(0, shown).map((r, i) => `<tr>${rank ? `<td class="rank n">${i + 1}</td>` : ''}${cols.map(col => `<td class="${col.n ? 'n' : ''}">${col.f ? col.f(r) : esc(r[col.k])}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${cols.length + 1}" class="small">${c.noMatch}</td></tr>`;
    more.innerHTML = list.length > shown ? `<button class="chip" type="button">${c.more} (${fmt(list.length - shown, lang)})</button>` : '';
  }
  inp.addEventListener('input', () => { q = inp.value.trim().toLowerCase(); shown = pageSize; draw(); });
  thead.addEventListener('click', e => { const th = e.target.closest('th[data-k]'); if (!th) return; if (k === th.dataset.k) asc = !asc; else { k = th.dataset.k; asc = false; } draw(); });
  more.addEventListener('click', e => { if (e.target.closest('button')) { shown += pageSize * 2; draw(); } });
  draw();
}

// Boot a site. dict: {ja:{...},en:{...},...}; render(data, t, lang, root)
export async function boot({ id, dict, render, siteSources = [] }) {
  let lang = getLang(), data = null;
  const root = document.getElementById('app');
  const t = k => dict[lang]?.[k] ?? C[lang][k] ?? dict.en?.[k] ?? k;
  const header = document.createElement('header'); header.className = 'top';
  document.body.prepend(header);
  const footer = document.createElement('footer'); document.body.append(footer);

  function chrome() {
    const c = C[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : lang;
    document.title = `${t('title')} | ${c.home}`;
    header.innerHTML = `<div class="wrap bar"><a class="home" href="../#${lang}">◂ <span>${c.home}</span></a><div class="langs" role="group" aria-label="Language">${LANGS.map(([k, n]) => `<button type="button" data-l="${k}" aria-pressed="${k === lang}">${n}</button>`).join('')}</div></div>`;
    const src = data?.sources || siteSources;
    footer.innerHTML = `<div class="wrap"><b>${c.sources}</b><ul>${src.map(s => { const m = s.match(/(.*?)\s(https?:\/\/\S+)$/); return m ? `<li>${esc(m[1])} – <a href="${esc(m[2])}" rel="noopener">${esc(m[2].replace(/^https?:\/\//, ''))}</a></li>` : `<li>${esc(s)}</li>`; }).join('')}</ul>
      ${data ? `<p>${c.updated}: ${date(data.generated, lang)}</p>` : ''}<p>${c.license}</p><p><a href="${REPO}">${c.code}</a></p></div>`;
  }
  function draw() {
    chrome();
    if (!data) return;
    try { render(data, t, lang, root); } catch (e) { root.innerHTML = `<div class="wrap"><p class="err">${C[lang].error}</p></div>`; console.error(e); }
  }
  header.addEventListener('click', e => {
    const b = e.target.closest('button[data-l]'); if (!b) return;
    lang = b.dataset.l; try { localStorage.setItem('wpdb-lang', lang); } catch { }
    history.replaceState(null, '', '#' + lang); draw();
  });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (C[h] && h !== lang) { lang = h; draw(); } });
  chrome();
  root.innerHTML = `<div class="wrap loading">${C[lang].loading}</div>`;
  try {
    const r = await fetch(`../data/${id}.json`, { cache: 'no-cache' });
    if (!r.ok) throw new Error(r.status);
    data = await r.json();
  } catch (e) { root.innerHTML = `<div class="wrap"><p class="err">${C[lang].error}</p></div>`; return; }
  draw();
}
