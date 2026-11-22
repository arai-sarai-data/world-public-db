// Usage: node scripts/build.mjs <name> [<name>...]   (or "all")
import { writeFile, mkdir } from 'node:fs/promises';
const ALL = ['retractions', 'trials', 'climate', 'procurement', 'aid', 'rights', 'forests', 'owners'];
const names = process.argv.slice(2);
const list = (!names.length || names.includes('all')) ? ALL : names;
await mkdir(new URL('../data/', import.meta.url), { recursive: true });
let failed = 0;
for (const name of list) {
  const t0 = Date.now();
  try {
    const mod = await import(`../lib/${name}.mjs`);
    const data = await mod.build({ log: m => console.log(`[${name}] ${m}`) });
    await writeFile(new URL(`../data/${name}.json`, import.meta.url), JSON.stringify(data));
    console.log(`[${name}] ok in ${Math.round((Date.now() - t0) / 1000)}s`);
  } catch (e) { failed++; console.error(`[${name}] FAILED: ${e.stack || e}`); }
}
process.exit(failed ? 1 : 0);
