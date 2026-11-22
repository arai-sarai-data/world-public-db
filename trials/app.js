import { boot, table, bars, fmt, esc, date, meter, shareX } from '../assets/common.js';

const CLS = {
  ja: { INDUSTRY: '企業', OTHER: '大学・病院など', NIH: '米国立衛生研究所', FED: '米連邦機関', OTHER_GOV: 'その他の政府機関', NETWORK: '研究ネットワーク', INDIV: '個人', UNKNOWN: '不明', AMBIG: '不明' },
  en: { INDUSTRY: 'Industry', OTHER: 'Universities, hospitals, etc.', NIH: 'US NIH', FED: 'US federal agency', OTHER_GOV: 'Other government', NETWORK: 'Research network', INDIV: 'Individual', UNKNOWN: 'Unknown', AMBIG: 'Unknown' },
  zh: { INDUSTRY: '企业', OTHER: '大学、医院等', NIH: '美国国立卫生研究院', FED: '美国联邦机构', OTHER_GOV: '其他政府机构', NETWORK: '研究网络', INDIV: '个人', UNKNOWN: '不明', AMBIG: '不明' },
  es: { INDUSTRY: 'Industria', OTHER: 'Universidades, hospitales, etc.', NIH: 'NIH de EE. UU.', FED: 'Agencia federal de EE. UU.', OTHER_GOV: 'Otros gobiernos', NETWORK: 'Red de investigación', INDIV: 'Individual', UNKNOWN: 'Desconocido', AMBIG: 'Desconocido' },
};

const dict = {
  ja: {
    title: '消えた臨床試験トラッカー', kicker: '健康 · 02',
    lead: '臨床試験は終わったのに、結果が登録簿に載っていない。そんな試験を、実施した企業・大学・病院ごとに数えました。都合の悪い結果が出てこないと、医師も患者も偏った証拠で治療を選ぶことになります。',
    tTotal: '対象の試験（第2〜4相・終了済み）', tMissing: '結果が登録されていない試験', tPct: '結果の登録率', tUS: '米国に実施施設がある試験の登録率',
    rankH: '結果を登録していない割合が高いスポンサー', rankS: '30件以上の試験を終えたスポンサーが対象です。列見出しを押すと並べ替えられます。',
    cName: 'スポンサー', cCls: '種類', cN: '終了した試験', cRes: '結果あり', cPct: '登録率', cUs: '米国施設あり', cOld: '結果が未登録の古い試験',
    classH: 'スポンサーの種類別の登録率', yearH: '終了年ごとの登録率', phaseH: '開発段階別の登録率',
    shareText: '終わった臨床試験の結果、どこへ？ スポンサー別の結果登録率ランキング',
    m1: 'ClinicalTrials.gov（米国国立医学図書館の試験登録簿）に登録された、介入試験・第2〜4相・状態が「完了」の試験が対象です。主要評価項目の完了日がこのページの期間内（下記）にあるもののみを数えています。',
    m2: '「結果あり」はClinicalTrials.gov上に結果のデータが登録されていることを指します。論文や別の登録簿（EU、日本のjRCTなど）だけで結果を公表している場合は「結果なし」になります。',
    m3: '米国の法律（FDAAA 801）で結果の登録が義務になるのは、米国の施設や米国で承認を受ける医薬品に関わる一部の試験です。米国外だけで行われた試験は、この登録簿への結果登録が義務ではない場合があります。登録率が低いことは、ただちに法令違反を意味しません。',
    m4: '結果を公表する時間を考え、完了から約13か月以上たった試験だけを数えています。',
    period: '対象期間（主要評価項目の完了日）',
  },
  en: {
    title: 'Missing Trials Tracker', kicker: 'Health · 02',
    lead: 'The trial finished, but no results were posted to the registry. We counted these trials for every company, university and hospital that ran them. When unfavourable results stay hidden, doctors and patients choose treatments based on skewed evidence.',
    tTotal: 'Trials covered (phase 2–4, completed)', tMissing: 'Trials with no results posted', tPct: 'Share with results posted', tUS: 'Share posted, trials with a US site',
    rankH: 'Sponsors with the lowest share of posted results', rankS: 'Sponsors with at least 30 completed trials. Click a column heading to re-sort.',
    cName: 'Sponsor', cCls: 'Type', cN: 'Completed trials', cRes: 'With results', cPct: 'Posted', cUs: 'Has US site', cOld: 'Oldest trials without results',
    classH: 'Posting rate by sponsor type', yearH: 'Posting rate by completion year', phaseH: 'Posting rate by phase',
    shareText: 'The trial ended. Where are the results? Ranking of sponsors by results posting rate',
    m1: 'Covers interventional, phase 2–4 trials marked “Completed” on ClinicalTrials.gov (US National Library of Medicine), with a primary completion date in the window below.',
    m2: '“With results” means results data are posted on ClinicalTrials.gov. Trials whose results appear only in journals or other registries (EU, Japan’s jRCT, etc.) count as “no results”.',
    m3: 'US law (FDAAA 801) requires results posting only for certain trials, such as those with US sites or for products regulated in the US. Trials run only outside the US may have no legal duty to post here. A low rate is not by itself a legal violation.',
    m4: 'To allow time for posting, only trials completed roughly 13 months ago or earlier are counted.',
    period: 'Window (primary completion date)',
  },
  zh: {
    title: '消失的临床试验追踪器', kicker: '健康 · 02',
    lead: '试验已经结束，结果却没有登记到注册库。我们按开展试验的企业、大学和医院统计了这类试验。不利的结果被埋没，医生和患者就只能依据有偏差的证据选择治疗。',
    tTotal: '统计对象（2–4期、已完成）', tMissing: '未登记结果的试验', tPct: '结果登记率', tUS: '在美国设有研究点的试验登记率',
    rankH: '结果登记率最低的申办方', rankS: '对象为完成30项以上试验的申办方。点击列标题可重新排序。',
    cName: '申办方', cCls: '类型', cN: '已完成试验', cRes: '有结果', cPct: '登记率', cUs: '有美国研究点', cOld: '最早的未登记结果试验',
    classH: '按申办方类型的登记率', yearH: '按完成年份的登记率', phaseH: '按试验分期的登记率',
    shareText: '试验结束了，结果去哪了？申办方结果登记率排行',
    m1: '对象为ClinicalTrials.gov（美国国家医学图书馆）上登记的干预性、2–4期、状态为“已完成”的试验，且主要终点完成日期在下方期间内。',
    m2: '“有结果”指在ClinicalTrials.gov上登记了结果数据。仅在论文或其他注册库（欧盟、日本jRCT等）公布结果的试验计为“无结果”。',
    m3: '美国法律（FDAAA 801）仅要求部分试验登记结果，例如在美国设有研究点或涉及美国监管产品的试验。仅在美国以外进行的试验可能没有在此登记的法律义务。登记率低并不直接等于违法。',
    m4: '考虑到登记所需时间，只统计完成约13个月以上的试验。',
    period: '统计期间（主要终点完成日期）',
  },
  es: {
    title: 'Rastreador de ensayos desaparecidos', kicker: 'Salud · 02',
    lead: 'El ensayo terminó, pero sus resultados no aparecen en el registro. Contamos estos ensayos para cada empresa, universidad y hospital que los realizó. Cuando los resultados desfavorables quedan ocultos, médicos y pacientes eligen tratamientos con evidencia sesgada.',
    tTotal: 'Ensayos incluidos (fase 2–4, completados)', tMissing: 'Ensayos sin resultados publicados', tPct: 'Proporción con resultados', tUS: 'Proporción con resultados, ensayos con centro en EE. UU.',
    rankH: 'Patrocinadores con menor proporción de resultados publicados', rankS: 'Patrocinadores con al menos 30 ensayos completados. Haz clic en un encabezado para reordenar.',
    cName: 'Patrocinador', cCls: 'Tipo', cN: 'Ensayos completados', cRes: 'Con resultados', cPct: 'Publicados', cUs: 'Con centro en EE. UU.', cOld: 'Ensayos más antiguos sin resultados',
    classH: 'Tasa de publicación por tipo de patrocinador', yearH: 'Tasa de publicación por año de finalización', phaseH: 'Tasa de publicación por fase',
    shareText: 'El ensayo terminó. ¿Dónde están los resultados? Ranking de patrocinadores',
    m1: 'Incluye ensayos intervencionales de fase 2–4 marcados como “Completed” en ClinicalTrials.gov (Biblioteca Nacional de Medicina de EE. UU.), con fecha de finalización primaria dentro del periodo indicado abajo.',
    m2: '“Con resultados” significa que hay datos de resultados en ClinicalTrials.gov. Los ensayos que solo publicaron en revistas u otros registros (UE, jRCT de Japón, etc.) cuentan como “sin resultados”.',
    m3: 'La ley de EE. UU. (FDAAA 801) exige publicar resultados solo en ciertos ensayos, como los que tienen centros en EE. UU. o productos regulados allí. Los ensayos realizados solo fuera de EE. UU. pueden no estar obligados a publicar aquí. Una tasa baja no implica por sí sola una infracción.',
    m4: 'Para dar tiempo a la publicación, solo se cuentan ensayos completados hace unos 13 meses o más.',
    period: 'Periodo (fecha de finalización primaria)',
  },
};

boot({
  id: 'trials', dict,
  render(d, t, lang, root) {
    const cls = CLS[lang], pct = d.total ? 100 * d.withResults / d.total : 0;
    const us = d.usSites.find(x => x.k === 'US');
    const rateBars = list => bars(list.map(x => ({ label: x.label, value: x.pct, text: `${fmt(x.pct, lang)}% · ${fmt(x.n, lang)}`, cls: x.pct < 50 ? 'b' : '' })), { max: 100 });
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${fmt(d.total, lang)}</b><span>${t('tTotal')}</span></div>
          <div class="tile bad"><b>${fmt(d.total - d.withResults, lang)}</b><span>${t('tMissing')}</span></div>
          <div class="tile warn"><b>${fmt(pct, lang, { maximumFractionDigits: 1 })}%</b><span>${t('tPct')}</span></div>
          ${us ? `<div class="tile"><b>${fmt(us.pct, lang)}%</b><span>${t('tUS')}</span></div>` : ''}
        </div><p class="small">${t('period')}: ${date(d.window.from, lang)} – ${date(d.window.to, lang)}</p></section>
      <section class="block"><h2>${t('rankH')}</h2><p class="sub">${t('rankS')}</p><p>${shareX(t('shareText'), lang)}</p><div id="rank"></div></section>
      <section class="block grid2">
        <div class="card"><h2>${t('classH')}</h2>${rateBars(d.byClass.map(x => ({ ...x, label: cls[x.k] || x.k })))}</div>
        <div class="card"><h2>${t('phaseH')}</h2>${rateBars(d.byPhase.filter(x => x.n >= 100).map(x => ({ ...x, label: x.k.replace(/PHASE/g, 'P') })))}</div>
      </section>
      <section class="block"><div class="card"><h2>${t('yearH')}</h2>${rateBars(d.byYear.map(x => ({ ...x, label: x.k })))}</div></section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    table(root.querySelector('#rank'), {
      lang, rows: d.sponsors, sortKey: 'pct', sortAsc: true, search: s => s.name,
      cols: [
        { k: 'name', h: t('cName'), f: s => `<b>${esc(s.name)}</b><div class="small">${esc(cls[s.cls] || s.cls)}</div>` },
        { k: 'n', h: t('cN'), n: true, f: s => fmt(s.n, lang) },
        { k: 'res', h: t('cRes'), n: true, f: s => fmt(s.res, lang) },
        { k: 'pct', h: t('cPct'), n: true, f: s => `<b>${fmt(s.pct, lang)}%</b>${meter(s.pct, 100, s.pct < 25 ? 'bad' : s.pct < 60 ? 'warn' : '')}` },
        { k: 'usShare', h: t('cUs'), n: true, f: s => `${fmt(s.usShare, lang)}%` },
        { k: 'oldest', h: t('cOld'), s: s => s.oldest.length, f: s => s.oldest.slice(0, 3).map(o => `<div class="small"><a href="https://clinicaltrials.gov/study/${esc(o.id)}" rel="noopener">${esc(o.id)}</a> ${date(o.date, lang)} · ${esc(o.title.slice(0, 60))}</div>`).join('') },
      ],
    });
  },
});
