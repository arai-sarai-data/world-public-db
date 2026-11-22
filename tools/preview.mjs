// Build a single self-contained HTML file for one site (CSS, JS and data inlined) for offline preview.
// Usage: node tools/preview.mjs <site> <out.html>
import { readFile, writeFile } from 'node:fs/promises';
const [site, out] = process.argv.slice(2);
const R = p => readFile(new URL(`../${p}`, import.meta.url), 'utf8');
const [html, css, common, app, data] = await Promise.all([R(`${site}/index.html`), R('assets/common.css'), R('assets/common.js'), R(`${site}/app.js`), (process.argv[4] ? readFile(process.argv[4], 'utf8') : R(`data/${site}.json`))]);
const lib = common.replace(/^export /gm, '').replace(/await fetch\(`\.\.\/data\/\$\{id\}\.json`[^)]*\)/, 'new Response(document.getElementById("data").textContent)');
const page = app.replace(/^import .*$/m, '');
const bundled = html
  .replace('<link rel="stylesheet" href="../assets/common.css">', `<style>${css}</style>`)
  .replace('<script type="module" src="app.js"></script>', `<script type="application/json" id="data">${data.replace(/</g, '\\u003c')}</script><script type="module">${lib}\n${page}</script>`)
  .replace('href="../#', 'href="#');
await writeFile(out, bundled);
console.log(`wrote ${out} (${bundled.length} bytes)`);
