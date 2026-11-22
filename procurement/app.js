import { boot, table, fmt, esc, date, compact, shareX } from '../assets/common.js';

const dict = {
  ja: {
    title: '同じ物、いくらで買った？', kicker: 'お金と権力 · 04',
    lead: 'コロンビア政府のオンライン調達店（Tienda Virtual del Estado Colombiano）では、全国の役所が同じカタログから物品を買っています。同じ品目なのに、役所によって支払った単価が大きく違うものを一覧にしました。最初の対象国はコロンビアで、ほかの国のデータも同じ方法で追加していきます。',
    tOrders: '調べた発注書', tItems: '単価に2倍以上の差がある品目', tExtra: '中央値を上回って支払った合計',
    rankH: '単価の差が大きい品目', rankS: '中央値より高い単価で買った分の合計（数量×差額）が大きい順です。各発注書は政府の公開データで原本を確認できます。',
    cItem: '品目', cN: '購入回数 / 役所数', cMed: '単価の中央値', cRange: '単価の幅（下位10%〜上位10%）', cRatio: '差の倍率', cExtra: '中央値を上回った支払い', cHigh: '最も高く買った発注', cEnt: '中央値の2倍以上で買っている役所',
    unitWarn: '単位の違いの可能性', order: '発注書', times: '倍', cop: 'コロンビア・ペソ',
    shareText: '同じ品目なのに役所によって単価が何倍も違う。政府調達の単価ばらつきランキング',
    m1: '出典はコロンビア政府調達庁（Colombia Compra Eficiente）が datos.gov.co で公開する発注書データです。各発注書の品目欄から数量と金額を読み取り、単価＝金額÷数量で計算しています。',
    m2: '品目の説明文と単位が同じものを同じ品目として扱います。説明文は公開データの時点で途中までしか載っていないため、容量や仕様の違う商品が同じ品目に入ることがあります。差が50倍を超える品目は単位や仕様の違いの可能性が高いため、印を付けて下に並べています。',
    m3: '15回以上購入され、5つ以上の役所が買っている品目のみが対象です。税・送料・手数料の行と、1,000ペソ未満の単価（セット品の内訳）は除外しています。',
    m4: '単価が高いことは、それだけで不正を意味しません。配送地域、納期、数量の違いなど正当な理由がありえます。気になる取引は発注書の原本を確認してください。',
  },
  en: {
    title: 'Same Item, What Price?', kicker: 'Money & power · 04',
    lead: 'In Colombia’s government online store (Tienda Virtual del Estado Colombiano), public bodies across the country buy from the same catalogue. We list items where different agencies paid very different unit prices for the same thing. Colombia is the first country; others will be added with the same method.',
    tOrders: 'Purchase orders examined', tItems: 'Items with a 2× or larger price spread', tExtra: 'Total paid above the median price',
    rankH: 'Items with the widest price gaps', rankS: 'Sorted by total spend above the median unit price (quantity × difference). Every order can be checked in the government’s open data.',
    cItem: 'Item', cN: 'Purchases / agencies', cMed: 'Median unit price', cRange: 'Price range (10th–90th percentile)', cRatio: 'Spread', cExtra: 'Paid above median', cHigh: 'Most expensive purchases', cEnt: 'Agencies paying 2× the median or more',
    unitWarn: 'Possible unit mismatch', order: 'Order', times: '×', cop: 'Colombian pesos',
    shareText: 'Same item, prices many times apart across agencies. Government procurement price-gap ranking',
    m1: 'Source: purchase orders published by Colombia Compra Eficiente on datos.gov.co. Quantity and amount are parsed from each order’s item field; unit price = amount ÷ quantity.',
    m2: 'Lines with the same description and unit are treated as the same item. Descriptions are truncated in the open data, so products of different sizes may share an item. Items with spreads above 50× are likely unit or specification mismatches; they are flagged and listed last.',
    m3: 'Only items bought at least 15 times by at least 5 agencies. Tax, freight and fee lines, and unit prices below 1,000 pesos (bundle components), are excluded.',
    m4: 'A high price alone does not prove wrongdoing. Delivery region, deadlines or quantity can justify differences. Check the original order before drawing conclusions.',
  },
  zh: {
    title: '同样的东西，花了多少钱？', kicker: '金钱与权力 · 04',
    lead: '在哥伦比亚政府网上采购商城（Tienda Virtual del Estado Colombiano），全国各政府机关从同一目录采购。我们列出了同一物品在不同机关之间单价差异很大的情况。首个对象国家是哥伦比亚，其他国家将以相同方法陆续加入。',
    tOrders: '调查的采购订单', tItems: '单价相差2倍以上的物品', tExtra: '高于中位价的支付总额',
    rankH: '单价差距最大的物品', rankS: '按高于中位单价的支付总额（数量×差额）排序。每张订单都可在政府公开数据中核对原件。',
    cItem: '物品', cN: '采购次数 / 机关数', cMed: '单价中位数', cRange: '单价范围（10%–90%分位）', cRatio: '差距倍数', cExtra: '高于中位价的支付', cHigh: '单价最高的采购', cEnt: '以中位价2倍以上采购的机关',
    unitWarn: '可能单位不同', order: '订单', times: '倍', cop: '哥伦比亚比索',
    shareText: '同一物品，各机关采购单价相差数倍：政府采购单价差距排行',
    m1: '来源为哥伦比亚政府采购署（Colombia Compra Eficiente）在datos.gov.co公开的采购订单数据。从订单的物品栏读取数量和金额，单价＝金额÷数量。',
    m2: '描述和单位相同的行视为同一物品。公开数据中的描述被截断，规格不同的商品可能被归为同一物品。差距超过50倍的物品很可能是单位或规格不同，已加标记并排在后面。',
    m3: '仅包括被至少5个机关采购15次以上的物品。税费、运费、手续费行以及低于1,000比索的单价（套装组成部分）已排除。',
    m4: '单价高本身并不证明存在不当行为。配送地区、交期或数量不同都可能是合理原因。下结论前请核对订单原件。',
  },
  es: {
    title: 'Mismo producto, ¿a qué precio?', kicker: 'Dinero y poder · 04',
    lead: 'En la Tienda Virtual del Estado Colombiano, entidades públicas de todo el país compran del mismo catálogo. Listamos artículos por los que distintas entidades pagaron precios unitarios muy diferentes. Colombia es el primer país; se añadirán otros con el mismo método.',
    tOrders: 'Órdenes de compra analizadas', tItems: 'Artículos con diferencia de 2× o más', tExtra: 'Total pagado por encima de la mediana',
    rankH: 'Artículos con mayores diferencias de precio', rankS: 'Ordenados por el gasto por encima del precio mediano (cantidad × diferencia). Cada orden puede verificarse en los datos abiertos del Gobierno.',
    cItem: 'Artículo', cN: 'Compras / entidades', cMed: 'Precio unitario mediano', cRange: 'Rango de precio (percentil 10–90)', cRatio: 'Diferencia', cExtra: 'Pagado sobre la mediana', cHigh: 'Compras más caras', cEnt: 'Entidades que pagan 2× la mediana o más',
    unitWarn: 'Posible diferencia de unidad', order: 'Orden', times: '×', cop: 'pesos colombianos',
    shareText: 'Mismo artículo, precios muy distintos entre entidades. Ranking de diferencias en compras públicas',
    m1: 'Fuente: órdenes de compra publicadas por Colombia Compra Eficiente en datos.gov.co. Se extraen cantidad y valor del campo de ítems; precio unitario = valor ÷ cantidad.',
    m2: 'Las líneas con la misma descripción y unidad se tratan como el mismo artículo. Las descripciones están truncadas en los datos abiertos, por lo que productos de distinto tamaño pueden compartir artículo. Los artículos con diferencias mayores a 50× probablemente tienen unidades o especificaciones distintas; se marcan y se listan al final.',
    m3: 'Solo artículos comprados al menos 15 veces por al menos 5 entidades. Se excluyen líneas de impuestos, fletes y comisiones, y precios unitarios menores a 1.000 pesos (componentes de paquetes).',
    m4: 'Un precio alto no prueba por sí solo una irregularidad. La región de entrega, los plazos o la cantidad pueden justificar diferencias. Revisa la orden original antes de sacar conclusiones.',
  },
};

const src = o => `https://www.datos.gov.co/resource/rgxm-mmea.json?identificador_de_la_orden=${encodeURIComponent(o)}`;

boot({
  id: 'procurement', dict,
  render(d, t, lang, root) {
    const clean = d.items.filter(i => !i.unitWarning), extra = clean.reduce((s, i) => s + i.extra, 0);
    const cop = v => `${fmt(v, lang)}`;
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${fmt(d.orders, lang)}</b><span>${t('tOrders')} (${d.years.join('–')})</span></div>
          <div class="tile warn"><b>${fmt(clean.length, lang)}</b><span>${t('tItems')}</span></div>
          <div class="tile bad"><b>${compact(extra, lang)}</b><span>${t('tExtra')} (${t('cop')})</span></div>
        </div></section>
      <section class="block"><h2>${t('rankH')}</h2><p class="sub">${t('rankS')}</p><p>${shareX(t('shareText'), lang)}</p><div id="rank"></div></section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    table(root.querySelector('#rank'), {
      lang, rows: d.items, pageSize: 20, search: i => `${i.desc} ${i.program} ${i.highest.map(h => h.entity).join(' ')} ${i.highEnt.map(h => h.entity).join(' ')}`,
      cols: [
        { k: 'desc', h: t('cItem'), f: i => `<b>${esc(i.desc)}</b><div class="small">${esc(i.unit)} · ${esc(i.program)}</div>${i.unitWarning ? `<span class="pill warn">${t('unitWarn')}</span>` : ''}` },
        { k: 'n', h: t('cN'), n: true, f: i => `${fmt(i.n, lang)} / ${fmt(i.entities, lang)}` },
        { k: 'p50', h: t('cMed'), n: true, f: i => cop(i.p50) },
        { k: 'p90', h: t('cRange'), n: true, f: i => `${cop(i.p10)} – ${cop(i.p90)}` },
        { k: 'ratio', h: t('cRatio'), n: true, f: i => `<span class="pill ${i.ratio >= 5 ? 'bad' : 'warn'}">${fmt(i.ratio, lang)}${t('times')}</span>` },
        { k: 'extra', h: t('cExtra'), n: true, f: i => `<b>${cop(i.extra)}</b>` },
        { k: 'highest', h: t('cHigh'), s: i => i.max, f: i => i.highest.map(h => `<div class="small">${cop(h.price)} · ${esc(h.entity)} · <a href="${src(h.order)}" rel="noopener">${t('order')} ${esc(h.order)}</a> (${date(h.date, lang)})</div>`).join('') },
        { k: 'highEnt', h: t('cEnt'), s: i => i.highEnt.length, f: i => i.highEnt.map(e => `<div class="small">${esc(e.entity)} · ${cop(e.median)} (${fmt(e.n, lang)})</div>`).join('') || '–' },
      ],
    });
  },
});
