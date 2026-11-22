import { boot, table, bars, fmt, esc, date, shareX } from '../assets/common.js';

const dict = {
  ja: {
    title: '撤回論文の波及マップ', kicker: '知識・制度 · 01',
    lead: '不正や誤りで撤回された論文が、撤回されたあとも引用され続けています。被引用数の多い撤回論文を調べ、撤回後に何回引用されたかを順位にしました。手元の参考文献に撤回論文が混ざっていないかも確認できます。',
    tTotal: '撤回済みと記録された論文', tChecked: '調べた撤回論文（被引用数上位）', tAfter: '上位論文が撤回後に受けた引用', tLast: '昨年も引用された撤回論文',
    rankH: '撤回後も引用され続ける論文', rankS: '撤回日より後の年に数えられた引用の合計で並べています。数字が大きいほど、誤った内容が研究の中で広がり続けています。',
    cTitle: '論文', cJournal: '掲載誌', cField: '分野', cPub: '発表', cRet: '撤回', cAfter: '撤回後の引用', cLast: '昨年の引用',
    checkH: '参考文献チェッカー', checkS: 'DOIを1行に1つ貼り付けてください（最大200件）。撤回されている論文を赤で表示します。データはOpenAlexにその場で問い合わせます。',
    checkBtn: '撤回論文を調べる', checkPh: '10.1038/nature00870\n10.1016/s0140-6736(97)11096-0', okAll: '撤回論文は見つかりませんでした。', found: '件の撤回論文が見つかりました', notFound: 'OpenAlexに登録がないDOI', retracted: '撤回', fine: '問題なし', checking: '確認中…', checkErr: '問い合わせに失敗しました。少し待ってからもう一度試してください。',
    yearH: '発表年ごとの撤回論文の数', fieldH: '分野ごとの撤回論文の数', countryH: '著者の所属国ごとの撤回論文の数（共著は各国に1件ずつ）',
    shareText: '撤回された論文が今も引用され続けている。撤回後の引用数ランキング',
    m1: '撤回の判定はOpenAlexの is_retracted を使用しています。撤回日はCrossrefに登録された撤回告知（出版社とRetraction Watch）のうち最も早い日付です。',
    m2: '「撤回後の引用」は、撤回した年の翌年以降にOpenAlexが数えた引用の合計です。OpenAlexの年別引用数はおおむね直近10年分のため、古い年の引用は含まれず、実際より少なく出ます。撤回された年の引用は数えていません。',
    m3: '撤回を知ったうえで批判的に引用している論文も含まれます。引用されていること自体が不正を意味するわけではありません。',
    m4: '対象は被引用数の多い撤回論文の上位から、撤回日を確認できたものです。',
  },
  en: {
    title: 'Retraction Ripple Map', kicker: 'Knowledge & laws · 01',
    lead: 'Papers retracted for misconduct or error keep being cited after retraction. We took the most-cited retracted papers and ranked them by how often they were cited after the retraction. You can also check your own reference list for retracted papers.',
    tTotal: 'Papers recorded as retracted', tChecked: 'Retracted papers examined (most cited)', tAfter: 'Citations received after retraction (top papers)', tLast: 'Retracted papers still cited last year',
    rankH: 'Papers still cited after retraction', rankS: 'Ranked by citations counted in the years after the retraction date. Higher numbers mean the flawed work keeps spreading through research.',
    cTitle: 'Paper', cJournal: 'Journal', cField: 'Field', cPub: 'Published', cRet: 'Retracted', cAfter: 'Citations after retraction', cLast: 'Citations last year',
    checkH: 'Reference checker', checkS: 'Paste one DOI per line (up to 200). Retracted papers are shown in red. The check queries OpenAlex live.',
    checkBtn: 'Check for retractions', checkPh: '10.1038/nature00870\n10.1016/s0140-6736(97)11096-0', okAll: 'No retracted papers found.', found: 'retracted papers found', notFound: 'DOIs not found in OpenAlex', retracted: 'Retracted', fine: 'OK', checking: 'Checking…', checkErr: 'The lookup failed. Please wait a moment and try again.',
    yearH: 'Retracted papers by publication year', fieldH: 'Retracted papers by field', countryH: 'Retracted papers by author country (co-authored papers count once per country)',
    shareText: 'Retracted papers are still being cited. Ranking by citations after retraction',
    m1: 'Retraction status comes from OpenAlex (is_retracted). The retraction date is the earliest retraction notice registered in Crossref (publisher or Retraction Watch).',
    m2: '“Citations after retraction” is the sum of citations OpenAlex counted in the years after the retraction year. OpenAlex reports yearly citations for roughly the last 10 years, so older citations are missing and the figure is an undercount. Citations in the retraction year itself are excluded.',
    m3: 'Some citing papers mention the retraction critically. Being cited does not by itself mean misconduct by the citing authors.',
    m4: 'Coverage: the most-cited retracted papers for which a retraction date could be confirmed.',
  },
  zh: {
    title: '撤稿论文波及图', kicker: '知识与制度 · 01',
    lead: '因造假或错误被撤稿的论文，在撤稿后仍被持续引用。我们调查了被引次数最多的撤稿论文，并按撤稿后的被引次数排名。你也可以检查自己的参考文献中是否混入了撤稿论文。',
    tTotal: '记录为已撤稿的论文', tChecked: '调查的撤稿论文（高被引）', tAfter: '上述论文撤稿后获得的引用', tLast: '去年仍被引用的撤稿论文',
    rankH: '撤稿后仍被引用的论文', rankS: '按撤稿日期之后年份的引用总数排序。数字越大，说明错误内容在研究中传播得越广。',
    cTitle: '论文', cJournal: '期刊', cField: '领域', cPub: '发表', cRet: '撤稿', cAfter: '撤稿后引用', cLast: '去年引用',
    checkH: '参考文献检查器', checkS: '每行粘贴一个DOI（最多200个）。撤稿论文将以红色显示。检查时实时查询OpenAlex。',
    checkBtn: '检查撤稿论文', checkPh: '10.1038/nature00870\n10.1016/s0140-6736(97)11096-0', okAll: '未发现撤稿论文。', found: '篇撤稿论文', notFound: 'OpenAlex中未收录的DOI', retracted: '已撤稿', fine: '正常', checking: '检查中…', checkErr: '查询失败，请稍后再试。',
    yearH: '按发表年份统计的撤稿论文数', fieldH: '按领域统计的撤稿论文数', countryH: '按作者所属国家统计的撤稿论文数（合著论文每个国家各计1篇）',
    shareText: '已撤稿的论文仍在被引用：撤稿后被引次数排行',
    m1: '撤稿判定使用OpenAlex的is_retracted。撤稿日期为Crossref中登记的撤稿声明（出版社及Retraction Watch）中最早的日期。',
    m2: '“撤稿后引用”是撤稿年份之后各年OpenAlex统计的引用总和。OpenAlex的年度引用数据大约只覆盖最近10年，因此较早的引用不在其中，数字会偏低。撤稿当年的引用不计入。',
    m3: '其中也包括知道撤稿后进行批评性引用的论文。被引用本身并不代表引用者有不当行为。',
    m4: '对象为高被引撤稿论文中能够确认撤稿日期的论文。',
  },
  es: {
    title: 'Mapa de propagación de artículos retractados', kicker: 'Conocimiento y leyes · 01',
    lead: 'Artículos retractados por fraude o error siguen citándose después de la retractación. Tomamos los artículos retractados más citados y los ordenamos según cuántas veces se citaron después de retractarse. También puedes revisar si tu bibliografía contiene artículos retractados.',
    tTotal: 'Artículos registrados como retractados', tChecked: 'Artículos retractados analizados (más citados)', tAfter: 'Citas recibidas tras la retractación (artículos analizados)', tLast: 'Retractados que aún se citaron el año pasado',
    rankH: 'Artículos que se siguen citando tras su retractación', rankS: 'Ordenados por las citas contadas en los años posteriores a la retractación. Cuanto mayor el número, más se sigue difundiendo el trabajo erróneo.',
    cTitle: 'Artículo', cJournal: 'Revista', cField: 'Área', cPub: 'Publicado', cRet: 'Retractado', cAfter: 'Citas tras la retractación', cLast: 'Citas el año pasado',
    checkH: 'Verificador de bibliografía', checkS: 'Pega un DOI por línea (máximo 200). Los retractados aparecen en rojo. La consulta se hace en directo a OpenAlex.',
    checkBtn: 'Buscar retractaciones', checkPh: '10.1038/nature00870\n10.1016/s0140-6736(97)11096-0', okAll: 'No se encontraron artículos retractados.', found: 'artículos retractados encontrados', notFound: 'DOI no encontrados en OpenAlex', retracted: 'Retractado', fine: 'Correcto', checking: 'Comprobando…', checkErr: 'La consulta falló. Espera un momento y vuelve a intentarlo.',
    yearH: 'Artículos retractados por año de publicación', fieldH: 'Artículos retractados por área', countryH: 'Artículos retractados por país de los autores (los artículos en coautoría cuentan una vez por país)',
    shareText: 'Artículos retractados que se siguen citando: ranking de citas tras la retractación',
    m1: 'El estado de retractación procede de OpenAlex (is_retracted). La fecha es el primer aviso de retractación registrado en Crossref (editorial o Retraction Watch).',
    m2: '“Citas tras la retractación” suma las citas que OpenAlex contó en los años posteriores al de la retractación. OpenAlex da citas anuales de aproximadamente los últimos 10 años, por lo que faltan citas antiguas y la cifra es una subestimación. No se cuentan las citas del mismo año de la retractación.',
    m3: 'Algunas citas mencionan la retractación de forma crítica. Ser citado no implica por sí mismo mala conducta de quien cita.',
    m4: 'Cobertura: artículos retractados más citados cuya fecha de retractación pudo confirmarse.',
  },
};

function countryName(code, lang) {
  try { return new Intl.DisplayNames([lang], { type: 'region' }).of(code); } catch { return code; }
}

async function check(text, t, lang, out) {
  const dois = [...new Set(text.split(/[\s,;]+/).map(s => s.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:/i, '').toLowerCase()).filter(s => s.startsWith('10.')))].slice(0, 200);
  if (!dois.length) return;
  out.innerHTML = `<p class="small">${t('checking')}</p>`;
  const found = new Map();
  try {
    for (let i = 0; i < dois.length; i += 50) {
      const part = dois.slice(i, i + 50);
      const r = await fetch(`https://api.openalex.org/works?filter=doi:${part.map(encodeURIComponent).join('|')}&per-page=50&select=doi,title,is_retracted,publication_year`).then(r => r.json());
      for (const w of r.results) found.set(w.doi.replace('https://doi.org/', '').toLowerCase(), w);
    }
  } catch { out.innerHTML = `<p class="err">${t('checkErr')}</p>`; return; }
  const bad = dois.filter(d => found.get(d)?.is_retracted), missing = dois.filter(d => !found.has(d));
  out.innerHTML = `<p><b>${bad.length ? `${fmt(bad.length, lang)} ${t('found')}` : t('okAll')}</b></p>
    <div class="tbl"><table><tbody>${dois.map(d => { const w = found.get(d); return `<tr><td>${w ? (w.is_retracted ? `<span class="pill bad">${t('retracted')}</span>` : `<span class="pill">${t('fine')}</span>`) : '<span class="pill warn">?</span>'}</td><td><a href="https://doi.org/${esc(d)}" rel="noopener">${esc(d)}</a><div class="small">${esc(w?.title || '')}</div></td></tr>`; }).join('')}</tbody></table></div>
    ${missing.length ? `<p class="small">${t('notFound')}: ${fmt(missing.length, lang)}</p>` : ''}`;
}

boot({
  id: 'retractions', dict,
  render(d, t, lang, root) {
    const after = d.ranked.reduce((s, w) => s + w.citesAfter, 0), stillCited = d.ranked.filter(w => w.lastYear > 0).length;
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${fmt(d.total, lang)}</b><span>${t('tTotal')}</span></div>
          <div class="tile"><b>${fmt(d.dated, lang)}</b><span>${t('tChecked')}</span></div>
          <div class="tile bad"><b>${fmt(after, lang)}</b><span>${t('tAfter')}</span></div>
          <div class="tile warn"><b>${fmt(stillCited, lang)}</b><span>${t('tLast')}</span></div>
        </div></section>
      <section class="block"><h2>${t('rankH')}</h2><p class="sub">${t('rankS')}</p><p>${shareX(t('shareText'), lang)}</p><div id="rank"></div></section>
      <section class="block"><h2>${t('checkH')}</h2><p class="sub">${t('checkS')}</p>
        <label for="dois" class="small">DOI</label><textarea id="dois" rows="6" style="width:100%;border:1px solid var(--line);border-radius:6px;padding:8px;background:var(--card);font-family:ui-monospace,monospace;font-size:13px" placeholder="${esc(t('checkPh'))}"></textarea>
        <p><button class="chip" type="button" id="go" aria-pressed="true">${t('checkBtn')}</button></p><div id="out"></div></section>
      <section class="block grid2">
        <div class="card"><h2>${t('fieldH')}</h2>${bars(d.byField.slice(0, 15).map(g => ({ label: g.name, value: g.n, text: fmt(g.n, lang) })))}</div>
        <div class="card"><h2>${t('countryH')}</h2>${bars(d.byCountry.slice(0, 15).map(g => ({ label: countryName(g.name.length === 2 ? g.name : g.key.split('/').pop().toUpperCase(), lang), value: g.n, text: fmt(g.n, lang) })))}</div>
      </section>
      <section class="block"><div class="card"><h2>${t('yearH')}</h2>${bars(d.byYear.filter(g => +g.key >= 2000).reverse().map(g => ({ label: g.key, value: g.n, text: fmt(g.n, lang) })))}</div></section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    table(root.querySelector('#rank'), {
      lang, rows: d.ranked, sortKey: 'citesAfter', search: w => `${w.title} ${w.journal} ${w.field} ${w.doi}`,
      cols: [
        { k: 'title', h: t('cTitle'), f: w => `<a href="https://doi.org/${esc(w.doi)}" rel="noopener">${esc(w.title)}</a><div class="small">${esc(w.journal || '')}${w.field ? ' · ' + esc(w.field) : ''}</div>` },
        { k: 'year', h: t('cPub'), n: true },
        { k: 'retracted', h: t('cRet'), n: true, f: w => date(w.retracted, lang) },
        { k: 'citesAfter', h: t('cAfter'), n: true, f: w => `<b>${fmt(w.citesAfter, lang)}</b>` },
        { k: 'lastYear', h: t('cLast'), n: true, f: w => fmt(w.lastYear, lang) },
      ],
    });
    root.querySelector('#go').addEventListener('click', () => check(root.querySelector('#dois').value, t, lang, root.querySelector('#out')));
  },
});
