#!/usr/bin/env node
// Sync hardcoded version strings in the sfdt-site content tree to match the
// upstream @sfdt/cli and Chrome-extension versions.
//
// This is the ONE source of truth for the *mechanical* version bumps. It is run
// by both the /sync-docs-site skill (locally, versions passed as args) and the
// docs-version-drift GitHub workflow (in CI, versions fetched from the public
// upstream repo). Changelog entries and prose/doc-staleness are handled by the
// skill, not here — this only touches version literals.
//
// Usage:
//   node scripts/sync-doc-versions.mjs [--cli X.Y.Z] [--ext X.Y.Z] [--check] [--selftest]
//
//   (no flags)   apply bumps, print what changed, exit 0
//   --check      report drift, DO NOT write, exit 1 if anything is stale
//   --cli/--ext  override versions (skill passes these from ../sfdt package.json)
//   --selftest   run the regex asserts and exit
//
// Version precedence: CLI args → local ../sfdt/{package.json,extension/package.json}
// → raw.githubusercontent.com upstream main. ponytail: fetch fallback keeps CI
// self-contained (no upstream checkout, no PAT).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const RAW = 'https://raw.githubusercontent.com/scoobydrew83/sfdt/main';

// Each target: a content file + a regex whose ONE capture-agnostic match is the
// version literal. `build(v)` produces the replacement from the new version.
const SEMVER = String.raw`\d+\.\d+\.\d+`;
const TARGETS = [
  {
    which: 'cli',
    file: 'content/cli/index.mdx',
    re: new RegExp(`Current version: \\*\\*v${SEMVER}\\*\\*`),
    build: (v) => `Current version: **v${v}**`,
  },
  {
    which: 'cli',
    file: 'content/cli/docker.mdx',
    // matches the pinned tag, never `:latest`
    re: new RegExp(`ghcr\\.io/scoobydrew83/sfdt:${SEMVER}`),
    build: (v) => `ghcr.io/scoobydrew83/sfdt:${v}`,
  },
  {
    which: 'ext',
    file: 'content/chrome-extension/index.mdx',
    re: new RegExp(`(\\*\\*Current version:\\*\\* \`)${SEMVER}(\`)`),
    build: (v) => `$1${v}$2`,
  },
  {
    which: 'ext',
    file: 'content/chrome-extension/privacy.mdx',
    re: new RegExp(`(built manifest\\*\\* \\(\`v)${SEMVER}(\`\\))`),
    build: (v) => `$1${v}$2`,
  },
];

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : undefined;
}
const has = (name) => process.argv.includes(`--${name}`);

async function readJsonMaybe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return null;
  }
}

async function fetchVersion(rel) {
  const res = await fetch(`${RAW}/${rel}`);
  if (!res.ok) throw new Error(`fetch ${rel} → ${res.status}`);
  return (await res.json()).version;
}

async function resolveVersions() {
  let cli = arg('cli');
  let ext = arg('ext');
  if (cli && ext) return { cli, ext };

  // local upstream checkout (developer machine / skill run)
  const localCli = await readJsonMaybe(path.resolve(ROOT, '..', 'sfdt', 'package.json'));
  const localExt = await readJsonMaybe(path.resolve(ROOT, '..', 'sfdt', 'extension', 'package.json'));
  cli ??= localCli?.version;
  ext ??= localExt?.version;
  if (cli && ext) return { cli, ext };

  // CI fallback: public upstream repo
  cli ??= await fetchVersion('package.json');
  ext ??= await fetchVersion('extension/package.json');
  return { cli, ext };
}

function selftest() {
  const cases = [
    ['content/cli/index.mdx', 'Current version: **v0.12.0**. The CLI', '9.9.9', 'Current version: **v9.9.9**. The CLI'],
    ['content/cli/docker.mdx', 'docker pull ghcr.io/scoobydrew83/sfdt:0.15.1', '9.9.9', 'docker pull ghcr.io/scoobydrew83/sfdt:9.9.9'],
    ['content/cli/docker.mdx', 'ghcr.io/scoobydrew83/sfdt:latest', '9.9.9', 'ghcr.io/scoobydrew83/sfdt:latest'], // :latest untouched
    ['content/chrome-extension/index.mdx', '- **Current version:** `0.3.2`', '9.9.9', '- **Current version:** `9.9.9`'],
    ['content/chrome-extension/privacy.mdx', 'the **built manifest** (`v0.3.2`) actually', '9.9.9', 'the **built manifest** (`v9.9.9`) actually'],
  ];
  for (const [file, input, v, expected] of cases) {
    const t = TARGETS.find((t) => t.file === file);
    const out = input.replace(t.re, t.build(v));
    if (out !== expected) {
      console.error(`FAIL ${file}\n  in:  ${input}\n  out: ${out}\n  exp: ${expected}`);
      process.exit(1);
    }
  }
  console.log(`selftest OK (${cases.length} cases)`);
}

async function main() {
  if (has('selftest')) return selftest();

  const check = has('check');
  const { cli, ext } = await resolveVersions();
  if (!cli || !ext) {
    console.error('Could not resolve versions (cli/ext). Pass --cli/--ext.');
    process.exit(2);
  }
  console.log(`Target versions: cli=${cli} ext=${ext}`);

  const versions = { cli, ext };
  const drifted = [];
  for (const t of TARGETS) {
    const abs = path.resolve(ROOT, t.file);
    const before = fs.readFileSync(abs, 'utf8');
    const v = versions[t.which];
    const after = before.replace(t.re, t.build(v));
    if (after === before) continue;
    drifted.push(t.file);
    if (!check) fs.writeFileSync(abs, after);
    console.log(`${check ? 'DRIFT' : 'bumped'}: ${t.file} → ${v}`);
  }

  if (!drifted.length) {
    console.log('All version references up to date.');
    process.exit(0);
  }
  process.exit(check ? 1 : 0);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(2);
});
