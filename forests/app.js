import { boot, table, bars, fmt, esc, compact, shareX } from '../assets/common.js';

const COM = {
  ja: { Cattle: '牛（牧草地）', 'Oilseeds': '油糧作物（大豆・パーム油など）', 'Forestry': '林業', 'Forestry logging': '林業（伐採）', 'Cereals': '穀物', 'Other crops': 'その他の作物', 'Vegetables, fruit & nuts': '野菜・果物・ナッツ', 'Rice': '米', 'Fiber crops': '繊維作物', 'Sugar crops': '砂糖作物', 'Stimulant crops': '嗜好作物（カカオ・コーヒーなど）', 'Pulses': '豆類', 'Oil palm': 'パーム油' },
  zh: { Cattle: '牛（牧场）', 'Oilseeds': '油料作物（大豆、棕榈油等）', 'Forestry': '林业', 'Forestry logging': '林业（采伐）', 'Cereals': '谷物', 'Other crops': '其他作物', 'Vegetables, fruit & nuts': '蔬菜、水果和坚果', 'Rice': '稻米', 'Fiber crops': '纤维作物', 'Sugar crops': '糖料作物', 'Stimulant crops': '嗜好作物（可可、咖啡等）', 'Pulses': '豆类', 'Oil palm': '棕榈油' },
  es: { Cattle: 'Ganado (pastos)', 'Oilseeds': 'Oleaginosas (soja, palma, etc.)', 'Forestry': 'Silvicultura', 'Forestry logging': 'Silvicultura (tala)', 'Cereals': 'Cereales', 'Other crops': 'Otros cultivos', 'Vegetables, fruit & nuts': 'Verduras, frutas y frutos secos', 'Rice': 'Arroz', 'Fiber crops': 'Cultivos de fibra', 'Sugar crops': 'Cultivos de azúcar', 'Stimulant crops': 'Cultivos estimulantes (cacao, café, etc.)', 'Pulses': 'Legumbres', 'Oil palm': 'Palma aceitera' },
};

const dict = {
  ja: {
    title: '森を消した商品', kicker: '気候・環境 · 07',
    lead: '熱帯の森林が消える最大の理由は、牛肉・大豆・パーム油など、世界中で消費される商品のための開発です。森を切った国だけでなく、その商品を輸入した国にも責任があります。輸入を通じて他国の森林破壊に関わった面積を国別に並べ、各国の森林の増減も示しました。',
    tTop: '輸入を通じた森林破壊が最も多い国', tCom: '森林破壊の最大の原因となった商品', tLoss: '2015年以降に森林が減った国',
    impH: '輸入を通じて他国の森林破壊に関わった国', impS: '輸入した商品の生産のために、輸出国で失われた森林の面積（ヘクタール）です。人口100万人あたりの値でも並べ替えられます。',
    cCountry: '国', cHa: '関わった森林破壊', cPer: '人口100万人あたり', cYear: '年',
    comH: '森林破壊の原因になった商品', grossH: '森林が切られた面積（年あたり、直近の期間）',
    forH: '各国の森林の増減', forS: '1990年から最新年までと、2015年から最新年までの森林面積の変化です。',
    cArea: '森林面積', c1990: '1990年からの変化', c2015: '2015年からの変化', ha: 'ha',
    shareText: '牛肉、大豆、パーム油…輸入を通じて他国の森林を消しているのはどの国？',
    m1: '輸入を通じた森林破壊と商品別の内訳は、Pendrill ほか（2019, 2022）の推計をOur World in Dataが公開したものです。熱帯・亜熱帯の森林破壊のうち、農地・牧草地・植林地への転換によるものを、生産された商品の貿易の流れに沿って消費国へ割り当てています。推計の年はデータごとに表やグラフに示しています。',
    m2: '森林面積と森林が切られた面積は、国連食糧農業機関（FAO）の世界森林資源評価をOur World in Dataが公開したものです。森林面積の変化は植林や自然な回復による増加を差し引いた純変化です。',
    m3: '人口100万人あたりの値は、同じ年の人口（Our World in Data）で割っています。',
    m4: '輸入国への割り当ては推計であり、個々の企業や取引が森林破壊に関わったことを示すものではありません。',
  },
  en: {
    title: 'Products That Cleared the Forest', kicker: 'Climate & nature · 07',
    lead: 'The main driver of tropical deforestation is land cleared for products consumed worldwide, such as beef, soy and palm oil. Responsibility lies not only with the countries that cleared the forest but also with those that import the products. We rank countries by the deforestation embodied in their imports and show how each country’s own forests are changing.',
    tTop: 'Largest importer of deforestation', tCom: 'Product driving the most deforestation', tLoss: 'Countries losing forest since 2015',
    impH: 'Countries importing deforestation', impS: 'Forest area (hectares) cleared in exporting countries to produce the goods each country imported. You can also sort per million people.',
    cCountry: 'Country', cHa: 'Deforestation imported', cPer: 'Per million people', cYear: 'Year',
    comH: 'Products driving deforestation', grossH: 'Forest cleared per year (latest period)',
    forH: 'Change in each country’s forest', forS: 'Change in forest area from 1990 and from 2015 to the latest year.',
    cArea: 'Forest area', c1990: 'Change since 1990', c2015: 'Change since 2015', ha: 'ha',
    shareText: 'Beef, soy, palm oil… which countries clear forests abroad through their imports?',
    m1: 'Imported deforestation and the breakdown by product are estimates by Pendrill et al. (2019, 2022), published by Our World in Data. Tropical and subtropical deforestation for cropland, pasture and plantations is attributed to consuming countries along trade flows. The estimate year is shown with each figure.',
    m2: 'Forest area and forest cleared come from the FAO Global Forest Resources Assessment via Our World in Data. Forest area change is net: gains from planting and natural regrowth are subtracted.',
    m3: 'Per-million values divide by population in the same year (Our World in Data).',
    m4: 'Attribution to importing countries is an estimate; it does not show that any specific company or shipment caused deforestation.',
  },
  zh: {
    title: '消灭森林的商品', kicker: '气候与环境 · 07',
    lead: '热带森林消失的最大原因，是为生产牛肉、大豆、棕榈油等全球消费的商品而进行的开发。责任不仅在于砍伐森林的国家，也在于进口这些商品的国家。我们按通过进口牵涉他国毁林的面积对各国排名，并展示各国自身森林的增减。',
    tTop: '通过进口牵涉毁林最多的国家', tCom: '导致毁林最多的商品', tLoss: '2015年以来森林减少的国家',
    impH: '通过进口牵涉他国毁林的国家', impS: '为生产各国进口的商品，在出口国失去的森林面积（公顷）。也可按每百万人口排序。',
    cCountry: '国家', cHa: '牵涉的毁林面积', cPer: '每百万人口', cYear: '年份',
    comH: '导致毁林的商品', grossH: '每年砍伐的森林面积（最近时期）',
    forH: '各国森林的增减', forS: '从1990年和2015年到最新年份的森林面积变化。',
    cArea: '森林面积', c1990: '1990年以来变化', c2015: '2015年以来变化', ha: '公顷',
    shareText: '牛肉、大豆、棕榈油……哪些国家通过进口让他国的森林消失？',
    m1: '通过进口牵涉的毁林及按商品的细分，为Pendrill等（2019, 2022）的估算，由Our World in Data公开。将热带和亚热带因转为农田、牧场和种植园而造成的毁林，沿贸易流向分配给消费国。各数据的估算年份显示在表格和图表中。',
    m2: '森林面积和砍伐面积来自联合国粮农组织《全球森林资源评估》，经Our World in Data公开。森林面积变化为净变化，已扣除植树和自然恢复带来的增加。',
    m3: '每百万人口数值以同年人口（Our World in Data）计算。',
    m4: '对进口国的分配为估算，并不表示特定企业或交易造成了毁林。',
  },
  es: {
    title: 'Productos que talaron el bosque', kicker: 'Clima y naturaleza · 07',
    lead: 'La principal causa de la deforestación tropical es el desmonte para productos consumidos en todo el mundo, como carne de res, soja y aceite de palma. La responsabilidad no es solo de los países que talan, sino también de los que importan esos productos. Ordenamos los países según la deforestación incorporada en sus importaciones y mostramos cómo cambian sus propios bosques.',
    tTop: 'Mayor importador de deforestación', tCom: 'Producto que más deforestación causa', tLoss: 'Países que pierden bosque desde 2015',
    impH: 'Países que importan deforestación', impS: 'Superficie de bosque (hectáreas) talada en los países exportadores para producir lo que cada país importó. También puede ordenarse por millón de habitantes.',
    cCountry: 'País', cHa: 'Deforestación importada', cPer: 'Por millón de habitantes', cYear: 'Año',
    comH: 'Productos que causan deforestación', grossH: 'Bosque talado por año (último periodo)',
    forH: 'Cambio en el bosque de cada país', forS: 'Cambio de superficie forestal desde 1990 y desde 2015 hasta el último año.',
    cArea: 'Superficie forestal', c1990: 'Cambio desde 1990', c2015: 'Cambio desde 2015', ha: 'ha',
    shareText: 'Carne, soja, aceite de palma… ¿qué países talan bosques ajenos a través de sus importaciones?',
    m1: 'La deforestación importada y su desglose por producto son estimaciones de Pendrill et al. (2019, 2022) publicadas por Our World in Data. La deforestación tropical y subtropical para cultivos, pastos y plantaciones se asigna a los países consumidores según los flujos comerciales. El año de cada estimación se indica junto a cada cifra.',
    m2: 'La superficie forestal y la tala provienen de la Evaluación de los Recursos Forestales Mundiales de la FAO, vía Our World in Data. El cambio de superficie es neto: se restan las ganancias por plantación y regeneración natural.',
    m3: 'Los valores por millón dividen por la población del mismo año (Our World in Data).',
    m4: 'La asignación a los países importadores es una estimación; no demuestra que una empresa o envío concreto causara deforestación.',
  },
};

const cn = (r, lang) => { try { const dn = new Intl.DisplayNames([lang], { type: 'region' }); const a2 = r.iso2; return a2 ? dn.of(a2) : r.name; } catch { return r.name; } };

boot({
  id: 'forests', dict,
  render(d, t, lang, root) {
    const com = n => (COM[lang] || {})[n] || n;
    const top = d.imported[0], c0 = d.commodities[0];
    const sign = v => (v > 0 ? '+' : '') + fmt(v, lang);
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          ${top ? `<div class="tile bad"><b>${esc(cn(top, lang))}</b><span>${t('tTop')} (${fmt(top.ha, lang)} ${t('ha')}, ${top.year})</span></div>` : ''}
          ${c0 ? `<div class="tile warn"><b>${esc(com(c0.name))}</b><span>${t('tCom')} (${fmt(c0.ha, lang)} ${t('ha')}, ${c0.year})</span></div>` : ''}
          <div class="tile"><b>${fmt(d.forest.filter(f => f.since2015 && f.since2015.ha < 0).length, lang)}</b><span>${t('tLoss')}</span></div>
        </div></section>
      <section class="block"><h2>${t('impH')}</h2><p class="sub">${t('impS')}</p><p>${shareX(t('shareText'), lang)}</p><div id="imp"></div></section>
      <section class="block grid2">
        <div class="card"><h2>${t('comH')} (${d.commodities[0]?.year ?? ''})</h2>${bars(d.commodities.map(c => ({ label: com(c.name), value: c.ha, text: compact(c.ha, lang) + ' ' + t('ha'), cls: 'b' })))}</div>
        <div class="card"><h2>${t('grossH')}</h2>${bars(d.gross.slice(0, 15).map(g => ({ label: cn(g, lang), value: g.ha, text: compact(g.ha, lang) + ' ' + t('ha') })))}</div>
      </section>
      <section class="block"><h2>${t('forH')}</h2><p class="sub">${t('forS')}</p><div id="for"></div></section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    table(root.querySelector('#imp'), {
      lang, rows: d.imported, sortKey: 'ha', search: r => `${cn(r, lang)} ${r.name}`,
      cols: [
        { k: 'name', h: t('cCountry'), s: r => cn(r, lang), f: r => `<b>${esc(cn(r, lang))}</b>` },
        { k: 'ha', h: t('cHa'), n: true, f: r => `<b>${fmt(r.ha, lang)}</b> <span class="small">${t('ha')}</span>` },
        { k: 'perMillion', h: t('cPer'), n: true, f: r => r.perMillion == null ? '–' : `${fmt(r.perMillion, lang)} <span class="small">${t('ha')}</span>` },
        { k: 'year', h: t('cYear'), n: true },
      ],
    });
    table(root.querySelector('#for'), {
      lang, rows: d.forest, sortKey: 'loss15', sortAsc: true, search: r => `${cn(r, lang)} ${r.name}`,
      cols: [
        { k: 'name', h: t('cCountry'), s: r => cn(r, lang), f: r => `<b>${esc(cn(r, lang))}</b>` },
        { k: 'area', h: t('cArea'), n: true, f: r => `${compact(r.area, lang)} <span class="small">${t('ha')} (${r.last})</span>` },
        { k: 'loss90', h: t('c1990'), n: true, s: r => r.since1990?.ha, f: r => r.since1990 ? `<span class="${r.since1990.ha < 0 ? 'pill bad' : 'pill'}">${sign(r.since1990.pct)}%</span> <span class="small">${sign(r.since1990.ha)} ${t('ha')}</span>` : '–' },
        { k: 'loss15', h: t('c2015'), n: true, s: r => r.since2015?.ha, f: r => r.since2015 ? `<span class="${r.since2015.ha < 0 ? 'pill bad' : 'pill'}">${sign(r.since2015.pct)}%</span> <span class="small">${sign(r.since2015.ha)} ${t('ha')}</span>` : '–' },
      ],
    });
  },
});
