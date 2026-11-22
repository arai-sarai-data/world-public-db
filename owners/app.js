import { boot, table, bars, fmt, esc, date, shareX } from '../assets/common.js';

const NUM = { '203': 'CZ', '348': 'HU', '040': 'AT', '276': 'DE', '616': 'PL', '804': 'UA', '380': 'IT', '826': 'GB', '840': 'US', '528': 'NL', '250': 'FR', '756': 'CH', '196': 'CY', '643': 'RU', '642': 'RO', '191': 'HR', '724': 'ES', '056': 'BE', '752': 'SE', '208': 'DK', '578': 'NO', '246': 'FI', '372': 'IE', '442': 'LU', '100': 'BG', '705': 'SI', '688': 'RS', '376': 'IL', '156': 'CN', '410': 'KR', '392': 'JP', '792': 'TR', '124': 'CA', '036': 'AU', '356': 'IN', '438': 'LI', '492': 'MC', '470': 'MT', '112': 'BY', '440': 'LT', '428': 'LV', '233': 'EE', '300': 'GR', '620': 'PT', '704': 'VN', '784': 'AE', '702': 'SG', '710': 'ZA', '076': 'BR', '484': 'MX', '398': 'KZ', '498': 'MD', '807': 'MK', '070': 'BA', '499': 'ME', '008': 'AL', '703': 'SK', '764': 'TH', '682': 'SA', '364': 'IR', '400': 'JO', '422': 'LB', '818': 'EG', '012': 'DZ', '504': 'MA', '788': 'TN', '566': 'NG', '051': 'AM', '268': 'GE', '031': 'AZ', '860': 'UZ' };
const SK = { ja: 'スロバキア', en: 'Slovakia', zh: '斯洛伐克', es: 'Eslovaquia' };

const dict = {
  ja: {
    title: '本当の持ち主', kicker: 'お金と権力 · 08',
    lead: 'スロバキアでは、国や自治体からお金を受け取る会社は「本当の持ち主（実質的支配者）」を公的な登録簿に届け出る義務があります。この登録簿を集計し、公的な立場にある人が持ち主になっている会社や、持ち主の国籍、虚偽の届け出への罰金を一覧にしました。最初の対象国はスロバキアで、同様の登録簿を持つ国を順に追加します。',
    tPartners: '国と取引する登録企業・団体', tOwners: '登録された本当の持ち主', tForeign: '外国籍の持ち主の割合', tPep: '公的な立場の人が持ち主になっている会社',
    pepH: '公的な立場にある人が本当の持ち主の会社', pepS: '登録簿で「公的な役職にある人（verejný činiteľ）」と記された人が、現在の本当の持ち主に含まれる会社です。個人名はこのサイトでは表示しません。会社名から登録簿の原本を確認できます。',
    cCompany: '会社', cIco: '会社番号（IČO）', cPeps: '公的な立場の持ち主の数', cSince: '登録された日', cLink: '登録簿',
    natH: '外国籍の持ち主の国籍', fineH: '虚偽・不備の届け出で罰金を受けた会社', cDate: '登録日', cNote: '裁判所の決定',
    open: '原本を見る', shareText: '国からお金を受け取る会社の「本当の持ち主」に公的な立場の人が何人？ スロバキアの登録簿を集計',
    m1: '出典はスロバキア法務省が公開する「公共部門パートナー登録簿（RPVS）」のオープンデータです。現在有効な登録だけを数えています。',
    m2: '「公的な立場の人」は登録簿の JeVerejnyCinitel（公的な役職にある人）の印によるものです。持ち主の家族などが含まれる場合や、登録時点の情報の場合があります。',
    m3: 'このサイトでは個人の名前・生年月日・住所を一切表示しません。会社名・会社番号・件数のみを示します。',
    m4: '公的な立場の人が会社を所有すること自体は違法ではありません。利益相反の確認のための公開情報として示しています。',
  },
  en: {
    title: 'Who Really Owns It', kicker: 'Money & power · 08',
    lead: 'In Slovakia, every company that receives money from the state or municipalities must register its real (beneficial) owners in a public register. We aggregated that register to list companies owned by people in public positions, the nationalities of owners, and fines for false declarations. Slovakia is the first country; others with similar registers will follow.',
    tPartners: 'Registered companies and bodies dealing with the state', tOwners: 'Registered beneficial owners', tForeign: 'Share of foreign owners', tPep: 'Companies with an owner in public office',
    pepH: 'Companies owned by people in public positions', pepS: 'Companies whose current beneficial owners include a person marked in the register as holding public office (verejný činiteľ). Personal names are not shown on this site; each company links to the official register entry.',
    cCompany: 'Company', cIco: 'Company ID (IČO)', cPeps: 'Owners in public office', cSince: 'Registered since', cLink: 'Register',
    natH: 'Nationality of foreign owners', fineH: 'Companies fined for false or incomplete declarations', cDate: 'Recorded', cNote: 'Court decision',
    open: 'Open record', shareText: 'How many companies paid by the state are owned by people in public office? Aggregating Slovakia’s register',
    m1: 'Source: open data of the Register of Public Sector Partners (RPVS), Ministry of Justice of the Slovak Republic. Only currently valid entries are counted.',
    m2: '“Public position” follows the register’s JeVerejnyCinitel flag. It may include family members and reflects the information at the time of registration.',
    m3: 'This site never shows individuals’ names, birth dates or addresses. Only company names, company IDs and counts are shown.',
    m4: 'Owning a company while holding public office is not illegal in itself. The list is provided as public information for checking conflicts of interest.',
  },
  zh: {
    title: '真正的所有者', kicker: '金钱与权力 · 08',
    lead: '在斯洛伐克，凡是从国家或地方政府获得资金的公司，都必须在公共登记簿中申报其“真正的所有者（实际受益人）”。我们汇总了这份登记簿，列出由担任公职者持有的公司、所有者的国籍，以及因虚假申报被罚款的公司。首个对象国家是斯洛伐克，拥有类似登记簿的国家将陆续加入。',
    tPartners: '与国家交易的登记企业和团体', tOwners: '登记的实际受益人', tForeign: '外国籍所有者比例', tPep: '由公职人员持有的公司',
    pepH: '由担任公职者作为实际受益人的公司', pepS: '当前实际受益人中包含登记簿标注为“担任公职者（verejný činiteľ）”的公司。本站不显示个人姓名，可通过公司名称查看登记簿原件。',
    cCompany: '公司', cIco: '公司编号（IČO）', cPeps: '担任公职的所有者人数', cSince: '登记日期', cLink: '登记簿',
    natH: '外国籍所有者的国籍', fineH: '因虚假或不完整申报被罚款的公司', cDate: '登记日', cNote: '法院决定',
    open: '查看原件', shareText: '从国家拿钱的公司，有多少由公职人员持有？斯洛伐克登记簿汇总',
    m1: '来源为斯洛伐克司法部公开的“公共部门合作伙伴登记簿（RPVS）”开放数据，仅统计当前有效的登记。',
    m2: '“担任公职者”依据登记簿的JeVerejnyCinitel标记，可能包括其家庭成员，且反映登记时的信息。',
    m3: '本站不显示任何个人的姓名、出生日期或住址，只显示公司名称、公司编号和数量。',
    m4: '担任公职者持有公司本身并不违法。此列表作为核查利益冲突的公开信息提供。',
  },
  es: {
    title: '¿Quién es el verdadero dueño?', kicker: 'Dinero y poder · 08',
    lead: 'En Eslovaquia, toda empresa que recibe dinero del Estado o de los municipios debe inscribir a sus verdaderos dueños (titulares reales) en un registro público. Agregamos ese registro para listar empresas cuyos dueños ocupan cargos públicos, la nacionalidad de los dueños y las multas por declaraciones falsas. Eslovaquia es el primer país; seguirán otros con registros similares.',
    tPartners: 'Empresas y entidades registradas que contratan con el Estado', tOwners: 'Titulares reales registrados', tForeign: 'Proporción de dueños extranjeros', tPep: 'Empresas con un dueño en cargo público',
    pepH: 'Empresas cuyos dueños ocupan cargos públicos', pepS: 'Empresas cuyos titulares reales actuales incluyen a una persona marcada en el registro como cargo público (verejný činiteľ). Este sitio no muestra nombres de personas; cada empresa enlaza a su ficha oficial.',
    cCompany: 'Empresa', cIco: 'ID de empresa (IČO)', cPeps: 'Dueños en cargo público', cSince: 'Registrado desde', cLink: 'Registro',
    natH: 'Nacionalidad de los dueños extranjeros', fineH: 'Empresas multadas por declaraciones falsas o incompletas', cDate: 'Registrado', cNote: 'Decisión judicial',
    open: 'Ver ficha', shareText: '¿Cuántas empresas pagadas por el Estado pertenecen a personas con cargo público? Agregado del registro eslovaco',
    m1: 'Fuente: datos abiertos del Registro de Socios del Sector Público (RPVS), Ministerio de Justicia de la República Eslovaca. Solo se cuentan inscripciones vigentes.',
    m2: '“Cargo público” sigue la marca JeVerejnyCinitel del registro. Puede incluir familiares y refleja la información en el momento de la inscripción.',
    m3: 'Este sitio nunca muestra nombres, fechas de nacimiento ni direcciones de personas. Solo nombres de empresas, identificadores y recuentos.',
    m4: 'Ser dueño de una empresa mientras se ocupa un cargo público no es ilegal en sí mismo. La lista se ofrece como información pública para revisar conflictos de interés.',
  },
};

const rec = id => `https://rpvs.gov.sk/rpvs/Partner/Partner/Detail/${id}`;

boot({
  id: 'owners', dict,
  render(d, t, lang, root) {
    let dn; try { dn = new Intl.DisplayNames([lang], { type: 'region' }); } catch { }
    const nat = n => (NUM[n.code] && dn ? dn.of(NUM[n.code]) : n.name);
    root.innerHTML = `<div class="wrap">
      <section class="hero"><div class="kicker">${t('kicker')}</div><h1>${t('title')}</h1><p class="lead">${t('lead')}</p>
        <div class="tiles">
          <div class="tile"><b>${fmt(d.activePartners, lang)}</b><span>${t('tPartners')}</span></div>
          <div class="tile"><b>${fmt(d.activeOwners, lang)}</b><span>${t('tOwners')}</span></div>
          <div class="tile warn"><b>${fmt(100 * d.foreignOwners / d.activeOwners, lang, { maximumFractionDigits: 1 })}%</b><span>${t('tForeign')}</span></div>
          <div class="tile bad"><b>${fmt(d.pepCompanies.length, lang)}</b><span>${t('tPep')}</span></div>
        </div></section>
      <section class="block"><h2>${t('pepH')}</h2><p class="sub">${t('pepS')}</p><p>${shareX(t('shareText'), lang)}</p><div id="pep"></div></section>
      <section class="block grid2">
        <div class="card"><h2>${t('natH')}</h2>${bars(d.nationalities.slice(0, 20).map(n => ({ label: nat(n), value: n.n, text: fmt(n.n, lang) })))}</div>
        <div class="card"><h2>${t('fineH')}</h2><div id="fines"></div></div>
      </section>
      <section class="block"><details class="method"><summary>${t('method')}</summary><ul><li>${t('m1')}</li><li>${t('m2')}</li><li>${t('m3')}</li><li>${t('m4')}</li></ul></details></section>
    </div>`;
    table(root.querySelector('#pep'), {
      lang, rows: d.pepCompanies, sortKey: 'peps', search: p => `${p.name} ${p.ico}`,
      cols: [
        { k: 'name', h: t('cCompany'), f: p => `<b>${esc(p.name)}</b>` },
        { k: 'ico', h: t('cIco'), n: true },
        { k: 'peps', h: t('cPeps'), n: true, f: p => `<b>${fmt(p.peps, lang)}</b>` },
        { k: 'since', h: t('cSince'), n: true, f: p => date(p.since, lang) },
        { k: 'id', h: t('cLink'), f: p => `<a href="${rec(p.id)}" rel="noopener">${t('open')}</a>` },
      ],
    });
    root.querySelector('#fines').innerHTML = d.fined.length ? d.fined.map(f => `<p><b>${esc(f.name || '–')}</b> <span class="small">IČO ${esc(f.ico || '–')} · ${date(f.date, lang)}</span><br><span class="small">${esc(f.note)}</span><br><a href="${rec(f.id)}" rel="noopener">${t('open')}</a></p>`).join('') : '–';
  },
});
