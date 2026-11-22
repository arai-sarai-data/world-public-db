// Same item, different price: unit prices in Colombia's government online store (Tienda Virtual del Estado Colombiano).
import { getJSON, quantile, round, stamp } from './util.mjs';

const DS = 'https://www.datos.gov.co/resource/rgxm-mmea.json';
// "105;0 Unidad DESCRIPTION de SUPPLIER para 8.334.165;00 COP"
const ITEM = /(\d+);(\d+) ([^ ]+(?: \([^)]*\))?) (.+?) de (.+?) para ([\d.]+);(\d+) COP/;
const SKIP = /Gravámen|Gravamen|\bIVA\b|Peajes|Tasa|COMPONENTE|SERVICIO|Peso \(COP\)|Descuento|Flete|Transporte|PRESUPUESTO|Operario|Supervisor|Coordinador|Hora|Licencia|Soporte|Suscripci|Suite|Software|Mantenimiento|Adecuaci|Instalaci|Veh[ií]culo|Combustible|Gasolina|ACPM|Di[eé]sel|Seguro|Arrendamiento|Alquiler|Consultor|Capacitaci/i;
// Catalogue programmes whose lines are services, software, vehicles, fuel or bespoke works are not like-for-like goods.
const SKIP_PROGRAM = /^(sxc|veh|maq|npu|tra|nub|con|iad|etp|mcf|cmb|seg|sop|aer|emi|lic)/i;
// Only physical goods counted in comparable units.
const UNITS = /^(Unidad|Caja|Paquete|Gal[oó]n|Litro|Kilogramo|Kilo|Resma|Par|Rollo|Bolsa|Botella|Frasco|Docena|Bulto|Metro|Juego|Kit)$/i;

export function parseItems(text) {
  const out = [];
  for (const part of (text || '').split(/; (?=\d+;\d+ )/)) {
    const m = part.match(ITEM); if (!m) continue;
    const qty = +(m[1] + '.' + m[2]), total = +(m[6].replace(/\./g, '') + '.' + m[7]);
    const desc = m[4].trim(), unit = m[3];
    if (!(qty > 0) || !(total > 0) || SKIP.test(unit + ' ' + desc) || SKIP_PROGRAM.test(desc) || !UNITS.test(unit)) continue;
    out.push({ desc, unit, qty, total, price: total / qty, supplier: m[5].trim() });
  }
  return out;
}

export async function build({ log = console.log, years = null } = {}) {
  const y = new Date().getUTCFullYear();
  years ??= [y - 1, y];
  const rows = [];
  for (const yr of years) {
    for (let off = 0; ; off += 10000) {
      const q = new URLSearchParams({ $select: 'identificador_de_la_orden,entidad,fecha,agregacion,items_solicitud_inicial', $where: `a_o='${yr}'`, $limit: '10000', $offset: String(off), $order: 'identificador_de_la_orden' });
      const r = await getJSON(`${DS}?${q}`);
      rows.push(...r); log(`orders ${yr}: ${rows.length}`);
      if (r.length < 10000) break;
    }
  }
  const groups = {};
  for (const r of rows) for (const it of parseItems(r.items_solicitud_inicial)) {
    if (it.price < 1000) continue; // bundled components priced at a token amount
    const k = it.desc + '|' + it.unit;
    (groups[k] ??= []).push({ ...it, order: r.identificador_de_la_orden, entity: r.entidad, date: (r.fecha || '').slice(0, 10), program: r.agregacion });
  }
  const items = [];
  for (const [k, v] of Object.entries(groups)) {
    const entities = new Set(v.map(x => x.entity));
    if (v.length < 15 || entities.size < 5) continue;
    const ps = v.map(x => x.price).sort((a, b) => a - b);
    const p10 = quantile(ps, .1), p50 = quantile(ps, .5), p90 = quantile(ps, .9);
    const ratio = p90 / p10;
    if (ratio < 2) continue;
    const pick = x => ({ order: x.order, entity: x.entity, date: x.date, qty: x.qty, price: Math.round(x.price), supplier: x.supplier });
    const sorted = [...v].sort((a, b) => b.price - a.price);
    // Entities whose median price is far above the item's overall median.
    const byEnt = {};
    for (const x of v) (byEnt[x.entity] ??= []).push(x.price);
    const highEnt = Object.entries(byEnt).map(([e, arr]) => { arr.sort((a, b) => a - b); return { entity: e, n: arr.length, median: Math.round(quantile(arr, .5)) }; })
      .filter(e => e.median > p50 * 2).sort((a, b) => b.median - a.median).slice(0, 5);
    items.push({
      desc: k.split('|')[0], unit: v[0].unit, program: v[0].program, n: v.length, entities: entities.size,
      p10: Math.round(p10), p50: Math.round(p50), p90: Math.round(p90), min: Math.round(ps[0]), max: Math.round(ps[ps.length - 1]),
      ratio: round(ratio, 1), unitWarning: ratio > 50,
      extra: Math.round(v.reduce((s, x) => s + Math.max(0, x.price - p50) * x.qty, 0)), // spend above the median price
      highest: sorted.slice(0, 3).map(pick), lowest: sorted.slice(-3).reverse().map(pick), highEnt,
    });
  }
  items.sort((a, b) => (a.unitWarning - b.unitWarning) || b.extra - a.extra);
  return stamp({ years, orders: rows.length, items: items.slice(0, 200) },
    ['Colombia Compra Eficiente, Tienda Virtual del Estado Colombiano – Consolidado (datos.gov.co, rgxm-mmea) https://www.datos.gov.co/d/rgxm-mmea']);
}
