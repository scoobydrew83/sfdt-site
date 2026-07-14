#!/usr/bin/env node
// Sync data/upstream/*.json from the sfdt repo's generated/ catalogs.
//
// The catalogs are machine-generated from code in the sfdt repo
// (`npm run generate:catalogs` there, drift-guarded by its CI). This script
// copies them into the site so pages/components import them statically —
// reproducible builds, reviewable diffs, no network dependency at build time.
//
// Usage:
//   node scripts/sync-upstream-catalogs.mjs [--from <sfdt-repo-path>] [--check]
//
//   (no flags)  copy from ../sfdt/generated (or --from), print what changed
//   --check     report drift without writing; exit 1 if anything is stale
//
// Run by the /sync-docs-site skill on every sfdt release. ponytail: local-path
// source only; add a raw.githubusercontent fallback (like sync-doc-versions)
// if a CI drift workflow ever needs to run without a sibling checkout.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DEST = path.join(ROOT, 'data', 'upstream');

const args = process.argv.slice(2);
const check = args.includes('--check');
const fromIdx = args.indexOf('--from');
const upstream = path.resolve(
  fromIdx !== -1 ? args[fromIdx + 1] : path.join(ROOT, '..', 'sfdt'),
);
const SRC = path.join(upstream, 'generated');

if (!fs.existsSync(SRC)) {
  console.error(`No generated/ directory at ${SRC} — pass --from <sfdt-repo-path> (and run \`npm run generate:catalogs\` there first).`);
  process.exit(1);
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.json')).sort();
if (!files.length) {
  console.error(`${SRC} contains no catalogs.`);
  process.exit(1);
}

let stale = [];
for (const f of files) {
  const srcText = fs.readFileSync(path.join(SRC, f), 'utf-8');
  const destPath = path.join(DEST, f);
  const destText = fs.existsSync(destPath) ? fs.readFileSync(destPath, 'utf-8') : null;
  if (srcText !== destText) {
    stale.push(f);
    if (!check) {
      fs.mkdirSync(DEST, { recursive: true });
      fs.writeFileSync(destPath, srcText);
    }
  }
}

if (check && stale.length) {
  console.error(`Upstream catalog drift: ${stale.join(', ')}`);
  console.error('Run: node scripts/sync-upstream-catalogs.mjs');
  process.exit(1);
}
console.log(stale.length ? `${check ? 'Stale' : 'Updated'}: ${stale.join(', ')}` : `data/upstream up to date (${files.length} catalogs).`);
