import { boot, table, fmt, esc, meter, shareX } from '../assets/common.js';

const A2 = { ARG: 'AR', AUS: 'AU', BRA: 'BR', CAN: 'CA', CHN: 'CN', FRA: 'FR', DEU: 'DE', IND: 'IN', IDN: 'ID', ITA: 'IT', JPN: 'JP', KOR: 'KR', MEX: 'MX', RUS: 'RU', SAU: 'SA', ZAF: 'ZA', TUR: 'TR', GBR: 'GB', USA: 'US' };
const EU = { ja: 'EU（27か国）', en: 'European Union (27)', zh: '欧盟（27国）', es: 'Unión Europea (27)' };
const name = (c, lang) => c.iso === 'EU' ? EU[lang] : (() => { try { return new Intl.DisplayNames([lang], { type: 'region' }).of(A2[c.iso]); } catch { return c.name; } })();

const dict = {
  ja: {
    title: '気候公約と実排出のズレ計', kicker: '気候・環境 · 03',
    lead: 'G20の国々は「この年までに温室効果ガスを実質ゼロにする」と宣言しています。最近10年の実際の排出の減り方が、その目標に必要なペースの何割に届いているかを計算しました。',
    tOn: '必要なペースに届いている国・地域', tHalf: '必要なペースの半分にも届かない', tRise: '排出がまだ増えている',
    rankH: '目標までのペース達成率', rankS: '達成率100%は、今のペースが続けば目標年に排出ゼロに届くことを意味します。0%未満は、排出がまだ増えていることを示します。',
    cCountry: '国・地域', cTarget: '実質ゼロ目標', cLast: '最新の排出量', cPeak: 'ピークからの変化', cTrend: '最近10年の傾向（年あたり）', cNeed: '必要なペース（年あたり）', cRatio: 'ペース達成率', cZero: '今のペースでゼロになる年', cLate: '目標との差', cSpark: '2000年からの推移',
    none: '正式な目標なし', withdrawn: '撤回', co2only: 'CO₂のみが対象', never: '届かない', late: '年遅れ', early: '年早い', unit: 'Mt CO₂換算', after: '2100年以降',
    shareText: '温室効果ガス「実質ゼロ」宣言、今のペースで間に合う？ G20の達成率ランキング',
    m1: '排出量はOur World in Data（Global Carbon Projectなどに基づく）の温室効果ガス総排出量で、土地利用変化と森林による増減を除いた値です。',
    m2: '「最近10年の傾向」は直近10年分の排出量に直線を当てはめた傾き（最小二乗法）です。「必要なペース」は最新年の排出量から目標年にゼロへ一直線で減らす場合の年あたり削減量です。',
    m3: '中国とサウジアラビアの目標はCO₂だけが対象ですが、比較のため温室効果ガス全体で計算しています。米国は2050年目標をパリ協定からの離脱とともに撤回しており、参考として旧目標で計算しています。メキシコは正式な実質ゼロ目標を出していません。',
    m4: '直線での見通しは単純化した目安です。各国の政策の効果や森林吸収は反映していません。',
  },
  en: {
    title: 'Climate Pledge Gap Meter', kicker: 'Climate & nature · 03',
    lead: 'G20 members have pledged to reach net-zero greenhouse gas emissions by a given year. We measured how far the actual decline over the last 10 years goes toward the pace each target requires.',
    tOn: 'Countries on the required pace', tHalf: 'Below half the required pace', tRise: 'Emissions still rising',
    rankH: 'Share of the required pace achieved', rankS: '100% means that if the current trend continues, emissions reach zero by the target year. Below 0% means emissions are still growing.',
    cCountry: 'Country', cTarget: 'Net-zero target', cLast: 'Latest emissions', cPeak: 'Change from peak', cTrend: '10-year trend (per year)', cNeed: 'Pace needed (per year)', cRatio: 'Pace achieved', cZero: 'Zero year at current pace', cLate: 'Versus target', cSpark: 'Since 2000',
    none: 'No formal target', withdrawn: 'Withdrawn', co2only: 'Covers CO₂ only', never: 'Never', late: 'yrs late', early: 'yrs early', unit: 'Mt CO₂e', after: 'After 2100',
    shareText: 'Net-zero pledges: on track at the current pace? G20 ranking',
    m1: 'Emissions are total greenhouse gas emissions excluding land use, land-use change and forestry, from Our World in Data (based on the Global Carbon Project and others).',
    m2: '“10-year trend” is the least-squares slope of the last 10 years of emissions. “Pace needed” is the yearly cut required to go in a straight line from the latest year to zero in the target year.',
    m3: 'China’s and Saudi Arabia’s targets cover CO₂ only, but we use total greenhouse gases for comparability. The United States withdrew its 2050 target along with its exit from the Paris Agreement; we show the former target for reference. Mexico has no formal net-zero target.',
    m4: 'The straight-line projection is a simple indicator. It does not model future policies or forest sinks.',
  },
  zh: {
    title: '气候承诺与实际排放差距计', kicker: '气候与环境 · 03',
    lead: 'G20成员都承诺在某一年前实现温室气体净零排放。我们计算了最近10年实际排放的下降速度，达到了目标所需速度的几成。',
    tOn: '达到所需速度的国家和地区', tHalf: '不到所需速度的一半', tRise: '排放仍在增加',
    rankH: '目标所需速度的达成率', rankS: '100%表示按当前趋势，可以在目标年份实现零排放。低于0%表示排放仍在增长。',
    cCountry: '国家/地区', cTarget: '净零目标', cLast: '最新排放量', cPeak: '较峰值变化', cTrend: '近10年趋势（每年）', cNeed: '所需速度（每年）', cRatio: '速度达成率', cZero: '按当前速度归零年份', cLate: '与目标相比', cSpark: '2000年以来',
    none: '无正式目标', withdrawn: '已撤回', co2only: '仅针对CO₂', never: '无法归零', late: '年延迟', early: '年提前', unit: '百万吨CO₂当量', after: '2100年以后',
    shareText: '“净零”承诺按当前速度能实现吗？G20达成率排行',
    m1: '排放量为Our World in Data（基于全球碳计划等）的温室气体总排放量，不含土地利用、土地利用变化和林业。',
    m2: '“近10年趋势”为最近10年排放量的最小二乘直线斜率。“所需速度”为从最新年份直线减少到目标年份归零所需的每年减排量。',
    m3: '中国和沙特阿拉伯的目标仅针对CO₂，但为便于比较，这里统一使用温室气体总量。美国在退出《巴黎协定》时撤回了2050年目标，此处仅按原目标作参考计算。墨西哥没有正式的净零目标。',
    m4: '直线预测只是简化的参考指标，未反映未来政策效果和森林吸收。',
  },
  es: {
    title: 'Medidor de brecha climática', kicker: 'Clima y naturaleza · 03',
    lead: 'Los miembros del G20 se comprometieron a alcanzar emisiones netas cero en un año determinado. Medimos qué parte del ritmo necesario cubre la reducción real de los últimos 10 años.',
    tOn: 'Países al ritmo necesario', tHalf: 'Por debajo de la mitad del ritmo necesario', tRise: 'Emisiones aún en aumento',
    rankH: 'Porcentaje del ritmo necesario alcanzado', rankS: '100% significa que, si sigue la tendencia actual, las emisiones llegan a cero en el año objetivo. Por debajo de 0% las emisiones siguen creciendo.',
    cCountry: 'País', cTarget: 'Objetivo cero neto', cLast: 'Emisiones más recientes', cPeak: 'Cambio desde el máximo', cTrend: 'Tendencia 10 años (por año)', cNeed: 'Ritmo necesario (por año)', cRatio: 'Ritmo alcanzado', cZero: 'Año cero al ritmo actual', cLate: 'Frente al objetivo', cSpark: 'Desde 2000',
    none: 'Sin objetivo formal', withdrawn: 'Retirado', co2only: 'Solo CO₂', never: 'Nunca', late: 'años tarde', early: 'años antes', unit: 'Mt CO₂e', after: 'Después de 2100',
    shareText: 'Promesas de cero neto: ¿llegan al ritmo actual? Ranking del G20',
    m1: 'Las emisiones son el total de gases de efecto invernadero sin uso de la tierra, cambio de uso y silvicultura, de Our World in Data (basado en Global Carbon Project y otros).',
    m2: '“Tendencia 10 años” es la pendiente por mínimos cuadrados de los últimos 10 años. “Ritmo necesario” es el recorte anual para bajar en línea recta desde el último año hasta cero en el año objetivo.',
    m3: 'Los objetivos de China y Arabia Saudita cubren solo CO₂, pero usamos el total de gases para comparar. Estados Unidos retiró su objetivo para 2050 al salir del Acuerdo de París; lo mostramos como referencia. México no tiene un objetivo formal de cero neto.',
    m4: 'La proyección lineal es un indicador simple. No modela políticas futuras ni sumideros forestales.',
  },
};

function spark(series) {
  const w = 120, h = 30, xs = series.map(p => p[0]), ys = series.map(p => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = 0, y1 = Math.max(...ys) * 1.05;
  const P = series.map(([x, y]) => `${((x - x0) / (x1 - x0) * w).toFixed(1)},${(h - (y - y0) / (y1 - y0) * h).toFixed(1)}`);
  const last = P[P.length - 1].split(',');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><polyline points="${P.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.5"/><circle cx="${last[0]}" cy="${last[1]}" r="2.5" fill="var(--accent)"/></svg>`;
}

boot({
  id: 'climate', dict,
  render(d, t, lang, root) {
    const C = d.countries, withT = C.filter(c => c.paceRatio != null && c.status === 'set');
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${fmt(withT.filter(c => c.paceRatio >= 1).length, lang)} / ${fmt(withT.length, lang)}</b><span>${t('tOn')}</span></div>
          <div class="tile warn"><b>${fmt(withT.filter(c => c.paceRatio < .5).length, lang)}</b><span>${t('tHalf')}</span></div>
          <div class="tile bad"><b>${fmt(C.filter(c => c.trend > 0).length, lang)}</b><span>${t('tRise')}</span></div>
        </div></section>
      <section class="block"><h2>${t('rankH')}</h2><p class="sub">${t('rankS')}</p><p>${shareX(t('shareText'), lang)}</p><div id="rank"></div></section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    const u = t('unit');
    table(root.querySelector('#rank'), {
      lang, rows: C, sortKey: 'paceRatio', sortAsc: true, pageSize: 30, search: c => `${name(c, lang)} ${c.name}`,
      cols: [
        { k: 'name', h: t('cCountry'), s: c => name(c, lang), f: c => `<b>${esc(name(c, lang))}</b>${c.scope === 'CO2' ? `<div class="small">${t('co2only')}</div>` : ''}` },
        { k: 'target', h: t('cTarget'), n: true, f: c => c.status === 'none' ? `<span class="pill warn">${t('none')}</span>` : `${c.target}${c.status === 'withdrawn' ? ` <span class="pill bad">${t('withdrawn')}</span>` : ''}` },
        { k: 'paceRatio', h: t('cRatio'), n: true, f: c => c.paceRatio == null ? '–' : `<b>${fmt(c.paceRatio * 100, lang, { maximumFractionDigits: 0 })}%</b>${meter(Math.max(0, c.paceRatio * 100), 100, c.paceRatio < .5 ? 'bad' : c.paceRatio < 1 ? 'warn' : '')}` },
        { k: 'yearsLate', h: t('cLate'), n: true, f: c => c.target == null ? '–' : c.zeroYear == null ? `<span class="pill bad">${t('never')}</span>` : c.zeroYear > 2100 ? `&gt;${fmt(2100 - c.target, lang)} ${t('late')}` : c.yearsLate > 0 ? `${fmt(c.yearsLate, lang)} ${t('late')}` : `${fmt(-c.yearsLate, lang)} ${t('early')}` },
        { k: 'zeroYear', h: t('cZero'), n: true, f: c => c.target == null ? '–' : c.zeroYear == null ? t('never') : c.zeroYear > 2100 ? t('after') : c.zeroYear },
        { k: 'trend', h: t('cTrend'), n: true, f: c => `${c.trend > 0 ? '+' : ''}${fmt(c.trend, lang, { maximumFractionDigits: 1 })} <span class="small">${u}</span>` },
        { k: 'needed', h: t('cNeed'), n: true, f: c => c.needed == null ? '–' : `${fmt(c.needed, lang, { maximumFractionDigits: 1 })} <span class="small">${u}</span>` },
        { k: 'last', h: t('cLast'), n: true, f: c => `${fmt(c.last, lang, { maximumFractionDigits: 0 })} <span class="small">${u} (${c.lastYear})</span>` },
        { k: 'fromPeakPct', h: t('cPeak'), n: true, f: c => `${c.fromPeakPct > 0 ? '+' : ''}${fmt(c.fromPeakPct, lang)}% <span class="small">(${c.peakYear})</span>` },
        { k: 'series', h: t('cSpark'), s: c => c.last, f: c => spark(c.series) },
      ],
    });
  },
});
