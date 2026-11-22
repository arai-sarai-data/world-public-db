import { boot, table, bars, fmt, esc, compact, meter, shareX } from '../assets/common.js';

const dict = {
  ja: {
    title: '約束された支援の行方', kicker: '人道支援 · 05',
    lead: '災害や紛争のたびに国連は必要な資金を呼びかけますが、集まるのはその一部です。各国の人道支援計画ごとに、必要額と実際に届いた額、そして表明されたまま支払われていない額を並べました。',
    tReq: '必要とされた額', tFund: '実際に届いた額', tCov: '充足率', tGap: '足りなかった額',
    yearsH: '年ごとの必要額と到着額', yearsS: '濃い線が届いた額、薄い帯が必要額です。',
    rankH: '資金が足りない支援計画', rankS: '不足額（必要額−届いた額）が大きい順です。年を選べます。',
    cPlan: '支援計画', cType: '種類', cReq: '必要額', cFund: '届いた額', cCov: '充足率', cGap: '不足額', cPledge: '表明済み・未払い', cDonors: '主な拠出者',
    nPlans: '件の計画', donorsH: 'この年の主な拠出者（全計画の合計）', usd: '米ドル', shareText: '国連の人道支援、必要額のうち実際に届いたのは何割？ 支援計画ごとの資金不足ランキング',
    m1: '出典は国連人道問題調整事務所（OCHA）の資金追跡サービス（FTS）です。必要額は各計画の改訂後の必要額、届いた額はFTSにその計画向けとして報告された資金の合計です。',
    m2: '「表明済み・未払い」はFTSで pledge（拠出の約束）として報告され、まだ支払いや契約に至っていない額です。',
    m3: 'FTSは各国政府や機関からの自主的な報告に基づくため、報告の遅れや漏れがあります。特に当年分は年の途中の数字です。',
    m4: '年ごとの合計では、計画ごとの届いた額を必要額までに抑えて充足率を計算しています。',
  },
  en: {
    title: 'Where Did the Aid Go?', kicker: 'Humanitarian aid · 05',
    lead: 'Every disaster and conflict brings a UN appeal for funds, but only part of the money arrives. For each humanitarian response plan we compare the money requested, the money received, and pledges announced but not yet paid.',
    tReq: 'Requested', tFund: 'Received', tCov: 'Coverage', tGap: 'Shortfall',
    yearsH: 'Requested vs. received by year', yearsS: 'Dark bars show money received; the light track shows the amount requested.',
    rankH: 'Most underfunded response plans', rankS: 'Sorted by shortfall (requested − received). Choose a year.',
    cPlan: 'Plan', cType: 'Type', cReq: 'Requested', cFund: 'Received', cCov: 'Coverage', cGap: 'Shortfall', cPledge: 'Pledged, unpaid', cDonors: 'Main donors',
    nPlans: 'plans', donorsH: 'Main donors this year (all plans)', usd: 'US dollars', shareText: 'UN humanitarian appeals: how much of the money requested actually arrived? Underfunding ranking',
    m1: 'Source: UN OCHA Financial Tracking Service (FTS). “Requested” is each plan’s revised requirement; “received” is all funding reported to FTS against that plan.',
    m2: '“Pledged, unpaid” is money reported to FTS as a pledge that has not yet become a commitment or payment.',
    m3: 'FTS relies on voluntary reporting by governments and agencies, so delays and gaps occur. Figures for the current year are partial.',
    m4: 'In yearly totals, each plan’s funding is capped at its requirement when computing coverage.',
  },
  zh: {
    title: '承诺的援助去哪了', kicker: '人道援助 · 05',
    lead: '每次灾害和冲突，联合国都会呼吁所需资金，但实际到位的只是一部分。我们按各国人道应对计划，比较了所需金额、实际到位金额，以及已承诺但尚未支付的金额。',
    tReq: '所需金额', tFund: '实际到位', tCov: '满足率', tGap: '资金缺口',
    yearsH: '各年所需金额与到位金额', yearsS: '深色条为到位金额，浅色底为所需金额。',
    rankH: '资金缺口最大的应对计划', rankS: '按缺口（所需−到位）排序，可选择年份。',
    cPlan: '计划', cType: '类型', cReq: '所需金额', cFund: '到位金额', cCov: '满足率', cGap: '缺口', cPledge: '已承诺未支付', cDonors: '主要出资方',
    nPlans: '个计划', donorsH: '本年度主要出资方（全部计划合计）', usd: '美元', shareText: '联合国人道援助，所需资金实际到位了几成？应对计划资金缺口排行',
    m1: '来源为联合国人道主义事务协调厅（OCHA）资金追踪服务（FTS）。所需金额为各计划修订后的需求，到位金额为向FTS报告的针对该计划的资金总额。',
    m2: '“已承诺未支付”为在FTS中以认捐（pledge）报告、尚未转为承付或支付的金额。',
    m3: 'FTS依赖各国政府和机构的自愿报告，存在延迟和遗漏。当年数据为年中数据。',
    m4: '计算年度满足率时，各计划的到位金额以其所需金额为上限。',
  },
  es: {
    title: '¿Adónde fue la ayuda?', kicker: 'Ayuda humanitaria · 05',
    lead: 'Cada desastre o conflicto trae un llamamiento de la ONU, pero solo llega una parte del dinero. Para cada plan de respuesta humanitaria comparamos lo solicitado, lo recibido y lo prometido aún sin pagar.',
    tReq: 'Solicitado', tFund: 'Recibido', tCov: 'Cobertura', tGap: 'Déficit',
    yearsH: 'Solicitado frente a recibido por año', yearsS: 'La barra oscura es lo recibido; la franja clara, lo solicitado.',
    rankH: 'Planes de respuesta con más déficit', rankS: 'Ordenados por déficit (solicitado − recibido). Elige un año.',
    cPlan: 'Plan', cType: 'Tipo', cReq: 'Solicitado', cFund: 'Recibido', cCov: 'Cobertura', cGap: 'Déficit', cPledge: 'Prometido, sin pagar', cDonors: 'Principales donantes',
    nPlans: 'planes', donorsH: 'Principales donantes del año (todos los planes)', usd: 'dólares estadounidenses', shareText: 'Llamamientos humanitarios de la ONU: ¿cuánto del dinero solicitado llegó? Ranking de déficit',
    m1: 'Fuente: Servicio de Seguimiento Financiero (FTS) de OCHA. “Solicitado” es el requerimiento revisado de cada plan; “recibido” es la financiación reportada al FTS para ese plan.',
    m2: '“Prometido, sin pagar” es el dinero reportado al FTS como promesa que aún no se ha comprometido ni pagado.',
    m3: 'El FTS depende de informes voluntarios de gobiernos y organismos, por lo que hay retrasos y omisiones. Las cifras del año en curso son parciales.',
    m4: 'En los totales anuales, la financiación de cada plan se limita a su requerimiento al calcular la cobertura.',
  },
};

boot({
  id: 'aid', dict,
  render(d, t, lang, root) {
    const full = d.totals.filter(x => x.year < new Date().getFullYear());
    const ref = full[full.length - 1] || d.totals[d.totals.length - 1];
    let year = ref.year;
    const usd = v => `$${compact(v, lang)}`;
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${usd(ref.req)}</b><span>${t('tReq')} (${ref.year})</span></div>
          <div class="tile"><b>${usd(ref.funded)}</b><span>${t('tFund')} (${ref.year})</span></div>
          <div class="tile warn"><b>${fmt(ref.cov, lang)}%</b><span>${t('tCov')} (${ref.year})</span></div>
          <div class="tile bad"><b>${usd(ref.req - ref.funded)}</b><span>${t('tGap')} (${ref.year})</span></div>
        </div></section>
      <section class="block"><div class="card"><h2>${t('yearsH')}</h2><p class="sub">${t('yearsS')}</p>
        ${d.totals.map(x => `<div class="brow"><span class="lab">${x.year}</span><span class="track" style="background:var(--accent-soft)"><em style="width:${100 * x.funded / Math.max(...d.totals.map(y => y.req))}%"></em></span><span class="val">${fmt(x.cov, lang)}%</span></div><div class="small" style="margin:-2px 0 8px">${usd(x.funded)} / ${usd(x.req)} · ${fmt(x.plans, lang)} ${t('nPlans')}</div>`).join('')}
      </div></section>
      <section class="block"><h2>${t('rankH')}</h2><p class="sub">${t('rankS')}</p>
        <div class="tools" id="years">${d.years.map(y => `<button class="chip" type="button" data-y="${y}" aria-pressed="${y === year}">${y}</button>`).join('')}</div>
        <p>${shareX(t('shareText'), lang)}</p><div id="rank"></div></section>
      <section class="block"><div class="card"><h2>${t('donorsH')} <span id="dy"></span></h2><div id="donors"></div></div></section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    const draw = () => {
      table(root.querySelector('#rank'), {
        lang, rows: d.plans.filter(p => p.year === year && p.req > 0), sortKey: 'gap', search: p => `${p.name} ${p.iso.join(' ')} ${p.donors.map(x => x[0]).join(' ')}`,
        cols: [
          { k: 'name', h: t('cPlan'), f: p => `<a href="https://fts.unocha.org/plans/${p.id}/summary" rel="noopener"><b>${esc(p.name)}</b></a><div class="small">${esc(p.type || '')}</div>` },
          { k: 'req', h: t('cReq'), n: true, f: p => usd(p.req) },
          { k: 'funded', h: t('cFund'), n: true, f: p => usd(p.funded) },
          { k: 'cov', h: t('cCov'), n: true, f: p => `<b>${fmt(p.cov, lang)}%</b>${meter(p.cov, 100, p.cov < 30 ? 'bad' : p.cov < 60 ? 'warn' : '')}` },
          { k: 'gap', h: t('cGap'), n: true, f: p => `<b>${usd(p.gap)}</b>` },
          { k: 'pledged', h: t('cPledge'), n: true, f: p => p.pledged ? usd(p.pledged) : '–' },
          { k: 'donors', h: t('cDonors'), s: p => p.donors.length, f: p => p.donors.slice(0, 3).map(x => `<div class="small">${esc(x[0])} · ${usd(x[1])}</div>`).join('') },
        ],
      });
      const dn = d.donors[year];
      root.querySelector('#dy').textContent = `(${year})`;
      root.querySelector('#donors').innerHTML = dn ? bars(dn.funding.slice(0, 20).map(x => ({ label: x[0], value: x[1], text: usd(x[1]) }))) : '–';
    };
    root.querySelector('#years').addEventListener('click', e => {
      const b = e.target.closest('button[data-y]'); if (!b) return;
      year = +b.dataset.y; root.querySelectorAll('#years button').forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.y === year))); draw();
    });
    draw();
  },
});
