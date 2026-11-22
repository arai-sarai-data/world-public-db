import { boot, table, bars, fmt, esc, meter, shareX } from '../assets/common.js';

const TOP = {
  ja: { OVL: '総合', SAF: '安全（暴力からの保護）', MOB: '移動の自由', WRK: '働く権利', PAY: '賃金', MAR: '結婚', PAR: '出産・育児', CHC: '保育', ENT: '起業', AST: '財産', PEN: '年金' },
  en: { OVL: 'Overall', SAF: 'Safety', MOB: 'Mobility', WRK: 'Work', PAY: 'Pay', MAR: 'Marriage', PAR: 'Parenthood', CHC: 'Childcare', ENT: 'Entrepreneurship', AST: 'Assets', PEN: 'Pension' },
  zh: { OVL: '综合', SAF: '安全', MOB: '行动自由', WRK: '工作', PAY: '薪酬', MAR: '婚姻', PAR: '生育与育儿', CHC: '托育', ENT: '创业', AST: '财产', PEN: '养老金' },
  es: { OVL: 'General', SAF: 'Seguridad', MOB: 'Movilidad', WRK: 'Trabajo', PAY: 'Salario', MAR: 'Matrimonio', PAR: 'Parentalidad', CHC: 'Cuidado infantil', ENT: 'Emprendimiento', AST: 'Bienes', PEN: 'Pensión' },
};

const dict = {
  ja: {
    title: '制度の世界地図', kicker: '知識・制度 · 06',
    lead: '女性が男性と同じように働き、稼ぎ、家族を持ち、財産を持てるか。約190か国の法律を、①法律の条文、②それを支える仕組み、③実際に守られているか（専門家の評価）の3つで比べました。「法律はあるのに守られていない」国も一目で分かります。',
    tTop: '法律の点数が満点の国', tGap: '法律と実態の差が30点以上', tJp: '日本の総合（法律／仕組み／実態）',
    rankH: '国別ランキング', rankS: '分野を選ぶと、その分野の点数で並べ替えます。点数は0〜100です。',
    gapH: '「法律はあるのに守られていない」国', gapS: '法律の点数から実態の点数を引いた差が大きい国です。',
    cCountry: '国', cLaw: '法律', cSfr: '支える仕組み', cEnf: '実態（評価）', cGap: '法律と実態の差', cParl: '女性議員の割合', cRegion: '地域',
    weakH: '世界で最も遅れている分野（法律の平均点）', shareText: '女性の権利、法律はあっても守られている？ 約190か国の「制度と実態」ランキング',
    m1: '出典は世界銀行「Women, Business and the Law」です。法律（Legal Framework）、支える仕組み（Supportive Framework）、実態の評価（Enforcement Perceptions：各国の専門家への調査）をそれぞれ0〜100で示します。',
    m2: '「法律と実態の差」は法律の点数から実態の評価を引いた値です。実態の評価がない国は空欄です。',
    m3: '女性議員の割合は列国議会同盟（IPU）のデータを世界銀行が公開しているもので、年が異なる場合があります。',
    m4: '点数は法律と制度の有無を測るもので、その国の女性の暮らし全体を表すものではありません。',
  },
  en: {
    title: 'Atlas of Rights and Rules', kicker: 'Knowledge & laws · 06',
    lead: 'Can women work, earn, start a family and own property on equal terms with men? We compare about 190 economies on three layers: what the law says, the systems that support it, and whether it is enforced in practice (expert assessment). Countries where the law exists only on paper stand out at a glance.',
    tTop: 'Countries with a perfect legal score', tGap: 'Law vs. practice gap of 30+ points', tJp: 'Japan overall (law / support / practice)',
    rankH: 'Country ranking', rankS: 'Choose a topic to rank by that topic. Scores range from 0 to 100.',
    gapH: 'Where the law exists only on paper', gapS: 'Countries with the largest gap between the legal score and enforcement in practice.',
    cCountry: 'Country', cLaw: 'Law', cSfr: 'Support systems', cEnf: 'Practice (assessed)', cGap: 'Law vs. practice gap', cParl: 'Women in parliament', cRegion: 'Region',
    weakH: 'Where the world lags most (average legal score)', shareText: 'Women’s rights: laws exist, but are they enforced? ranking of about 190 economies of law vs. practice',
    m1: 'Source: World Bank, Women, Business and the Law. Legal Framework, Supportive Framework and Enforcement Perceptions (a survey of experts in each economy) are each scored 0–100.',
    m2: '“Law vs. practice gap” is the legal score minus the enforcement score. Blank where no enforcement score exists.',
    m3: 'Women in parliament: Inter-Parliamentary Union data published by the World Bank; years may differ.',
    m4: 'Scores measure laws and institutions, not the full reality of women’s lives in each country.',
  },
  zh: {
    title: '制度世界地图', kicker: '知识与制度 · 06',
    lead: '女性能否与男性平等地工作、挣钱、组建家庭、拥有财产？我们从三个层面比较了约190个经济体：法律条文、配套制度，以及实际执行情况（专家评估）。“有法律却得不到执行”的国家一目了然。',
    tTop: '法律满分的国家', tGap: '法律与实际相差30分以上', tJp: '日本综合（法律／制度／实际）',
    rankH: '国家排名', rankS: '选择领域后按该领域分数排序。分数范围为0–100。',
    gapH: '“有法不依”的国家', gapS: '法律分数与实际执行分数差距最大的国家。',
    cCountry: '国家', cLaw: '法律', cSfr: '配套制度', cEnf: '实际（评估）', cGap: '法律与实际差距', cParl: '女性议员比例', cRegion: '地区',
    weakH: '全球最落后的领域（法律平均分）', shareText: '女性权利：有法律，但得到执行了吗？约190个经济体“制度与实际”排行',
    m1: '来源为世界银行《妇女、营商与法律》。法律框架、配套框架和执行评估（对各经济体专家的调查）分别以0–100计分。',
    m2: '“法律与实际差距”为法律分数减去执行评估分数。无执行评估的国家留空。',
    m3: '女性议员比例为世界银行公布的各国议会联盟（IPU）数据，年份可能不同。',
    m4: '分数衡量的是法律和制度，并不代表该国女性生活的全部。',
  },
  es: {
    title: 'Atlas de derechos y normas', kicker: 'Conocimiento y leyes · 06',
    lead: '¿Pueden las mujeres trabajar, ganar dinero, formar una familia y tener bienes en igualdad con los hombres? Comparamos unas 190 economías en tres niveles: lo que dice la ley, los sistemas que la respaldan y si se cumple en la práctica (evaluación de expertos). Los países donde la ley solo existe en el papel se ven de inmediato.',
    tTop: 'Países con puntuación legal perfecta', tGap: 'Brecha ley–práctica de 30 puntos o más', tJp: 'Japón en general (ley / apoyo / práctica)',
    rankH: 'Ranking de países', rankS: 'Elige un tema para ordenar por ese tema. Las puntuaciones van de 0 a 100.',
    gapH: 'Donde la ley solo existe en el papel', gapS: 'Países con mayor diferencia entre la puntuación legal y su cumplimiento en la práctica.',
    cCountry: 'País', cLaw: 'Ley', cSfr: 'Sistemas de apoyo', cEnf: 'Práctica (evaluada)', cGap: 'Brecha ley–práctica', cParl: 'Mujeres en el parlamento', cRegion: 'Región',
    weakH: 'Donde el mundo va más atrás (puntuación legal media)', shareText: 'Derechos de las mujeres: hay leyes, ¿pero se cumplen? Ranking de unas 190 economías',
    m1: 'Fuente: Banco Mundial, La Mujer, la Empresa y el Derecho. Marco legal, marco de apoyo y percepción de cumplimiento (encuesta a expertos de cada economía) se puntúan de 0 a 100.',
    m2: '“Brecha ley–práctica” es la puntuación legal menos la de cumplimiento. En blanco si no hay puntuación de cumplimiento.',
    m3: 'Mujeres en el parlamento: datos de la Unión Interparlamentaria publicados por el Banco Mundial; los años pueden variar.',
    m4: 'Las puntuaciones miden leyes e instituciones, no toda la realidad de las mujeres en cada país.',
  },
};

const cname = (c, lang) => { try { return new Intl.DisplayNames([lang], { type: 'region' }).of(c.iso2) || c.name; } catch { return c.name; } };

boot({
  id: 'rights', dict,
  render(d, t, lang, root) {
    const T = TOP[lang]; let topic = 'OVL';
    const sc = (c, tp = topic) => tp === 'OVL' ? c.overall : c.topics[tp];
    const gap = (c, tp = topic) => { const s = sc(c, tp); return s[0] != null && s[2] != null ? Math.round((s[0] - s[2]) * 10) / 10 : null; };
    const jp = d.countries.find(c => c.iso === 'JPN');
    const avg = d.topics.map(tp => ({ tp, v: d.countries.reduce((s, c) => s + (c.topics[tp][0] ?? 0), 0) / d.countries.length })).sort((a, b) => a.v - b.v);
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${fmt(d.countries.filter(c => c.overall[0] === 100).length, lang)}</b><span>${t('tTop')}</span></div>
          <div class="tile bad"><b>${fmt(d.countries.filter(c => gap(c, 'OVL') >= 30).length, lang)}</b><span>${t('tGap')}</span></div>
          ${jp ? `<div class="tile warn"><b>${jp.overall.map(v => v == null ? '–' : fmt(v, lang)).join(' / ')}</b><span>${t('tJp')}</span></div>` : ''}
        </div></section>
      <section class="block"><h2>${t('rankH')}</h2><p class="sub">${t('rankS')}</p>
        <div class="tools" id="topics">${['OVL', ...d.topics].map(k => `<button class="chip" type="button" data-t="${k}" aria-pressed="${k === topic}">${T[k]}</button>`).join('')}</div>
        <p>${shareX(t('shareText'), lang)}</p><div id="rank"></div></section>
      <section class="block grid2">
        <div class="card"><h2>${t('gapH')}</h2><p class="sub">${t('gapS')}</p>${bars(d.countries.filter(c => gap(c, 'OVL') != null).sort((a, b) => gap(b, 'OVL') - gap(a, 'OVL')).slice(0, 15).map(c => ({ label: cname(c, lang), value: gap(c, 'OVL'), text: fmt(gap(c, 'OVL'), lang), cls: 'b' })))}</div>
        <div class="card"><h2>${t('weakH')}</h2>${bars(avg.map(a => ({ label: T[a.tp], value: a.v, text: fmt(a.v, lang, { maximumFractionDigits: 1 }) })), { max: 100 })}</div>
      </section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    const draw = () => table(root.querySelector('#rank'), {
      lang, rows: d.countries, sortKey: 'law', pageSize: 30, search: c => `${cname(c, lang)} ${c.name} ${c.region}`,
      cols: [
        { k: 'name', h: t('cCountry'), s: c => cname(c, lang), f: c => `<b>${esc(cname(c, lang))}</b><div class="small">${esc(c.region)}</div>` },
        { k: 'law', h: t('cLaw'), n: true, s: c => sc(c)[0], f: c => `<b>${fmt(sc(c)[0], lang)}</b>${meter(sc(c)[0] ?? 0, 100)}` },
        { k: 'sfr', h: t('cSfr'), n: true, s: c => sc(c)[1], f: c => fmt(sc(c)[1], lang) },
        { k: 'enf', h: t('cEnf'), n: true, s: c => sc(c)[2], f: c => fmt(sc(c)[2], lang) },
        { k: 'gap', h: t('cGap'), n: true, s: c => gap(c), f: c => { const g = gap(c); return g == null ? '–' : `<span class="pill ${g >= 30 ? 'bad' : g >= 15 ? 'warn' : ''}">${g > 0 ? '+' : ''}${fmt(g, lang)}</span>`; } },
        { k: 'parl', h: t('cParl'), n: true, s: c => c.parl?.[0], f: c => c.parl ? `${fmt(c.parl[0], lang)}% <span class="small">(${c.parl[1]})</span>` : '–' },
      ],
    });
    root.querySelector('#topics').addEventListener('click', e => {
      const b = e.target.closest('button[data-t]'); if (!b) return;
      topic = b.dataset.t; root.querySelectorAll('#topics button').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.t === topic))); draw();
    });
    draw();
  },
});
