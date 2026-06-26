# CLAUDE.md — sfdt-site

## What this is

The public documentation & support site for the **SFDT** suite — `@sfdt/cli`, the SFDT Chrome
extension, and the SFDT VS Code extension. Nextra 4 (Next.js App Router), statically exported
(`output: 'export'` → `out/`), deployed to **Cloudflare Workers Static Assets**, served at
**https://sfdt.dev/**. Public repo: `github.com/scoobydrew83/sfdt-site`.

This repo is **docs only** — it has no application logic. The software it documents lives in the
upstream repo `github.com/scoobydrew83/sfdt` (locally `/Users/dkennedy/dev/sfdt`).

## Working here

- All content is MDX under `content/`. `_meta.js` files control sidebar/nav order — add a page by
  creating the `.mdx` **and** registering it in the nearest `_meta.js`, or it won't appear in nav.
- Top-level sections: `getting-started/`, `cli/`, `chrome-extension/`, `vscode-extension/`,
  `guides/`, `support/`. Put new docs in the matching section.
- Don't hand-edit anything in `out/` or `out/_pagefind/` — both are build output.
- Commands: `npm run dev` (localhost:3000), `npm run build` (writes `out/` + Pagefind search
  index), `npm run serve` (verify the production build). See README.md for deploy details.

## Keep in sync with the CLI repo — IMPORTANT

This site and `@sfdt/cli` are released together, so the docs must track the code. When the
upstream `sfdt` repo changes user-facing behaviour — a new command/subcommand, a new flag, a
config key, a changed default, a new feature gate, a new MCP tool, a GUI/extension page — update
the matching MDX here in the same effort (or open a follow-up). Stale docs on a public site are a
bug. After an upstream feature merge or release, do a docs-staleness pass: command list, flags,
config reference, and the `support/changelog` + version highlights.

When unsure whether docs exist for a change, grep `content/` for the command or config key before
assuming it's undocumented.
