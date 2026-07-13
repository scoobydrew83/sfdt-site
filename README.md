<div align="center">

<img src="./public/logo.png" alt="SFDT logo" width="88" height="88" />

# sfdt-site

The documentation & support site for the **SFDT** suite — the `@sfdt/cli` command-line tool,
the SFDT Chrome extension, and the SFDT VS Code extension.

🌐 **Live at [sfdt.dev](https://sfdt.dev/)**

</div>

Built with [Nextra 4](https://nextra.site) (Next.js App Router), statically exported, and
deployed to **Cloudflare Workers Static Assets**.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

Content lives in `content/` as `.mdx`, with `_meta.js` files controlling sidebar/nav order.

## Build

```bash
npm run build      # next build (output: 'export') → out/, then pagefind index
npm run serve      # serve the static out/ locally to verify the production build
```

`npm run build` runs `next build` (which writes the static site to `out/`) and a `postbuild`
step that runs Pagefind to generate the search index at `out/_pagefind/`.

## Deploy (Cloudflare — Workers Static Assets)

The site is a static export served by **Cloudflare Workers Static Assets** (assets-only — there
is no Worker script). `wrangler.jsonc` points `assets.directory` at `./out`, so a plain
`wrangler deploy` uploads the built site.

### A. Connect the repo in the Cloudflare dashboard (recommended)

In **Workers & Pages → Create → Import a repository**, point it at this repo and set:

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (the default; reads `wrangler.jsonc`)
- Environment variable: `NODE_VERSION=22`

No output-directory setting is needed — `wrangler.jsonc` declares `assets.directory: "./out"`.

### B. Manual deploy

`npx wrangler deploy` from a local checkout (after `npm run build`) uploads `out/` directly.
Only needed if the dashboard integration (A) is disconnected.

**Option A is what's live** — Cloudflare Workers Builds watches `master` and deploys the
`sfdt-site` Worker on every push. `.github/workflows/build.yml` is a secret-free build check
(next export + pagefind) that gates PRs; it does not deploy.

## Structure

```
app/                     App Router layout + Nextra catch-all page
content/                 All docs (.mdx) + _meta.js
  getting-started/       Overview, install, quickstart, architecture, requirements
  cli/                   CLI reference, commands/, workflows/, dashboard, mcp, plugins, docker, ci-cd
  chrome-extension/      Features, workspace, bridge, settings, privacy, troubleshooting
  vscode-extension/      Commands, Org Health sidebar, dashboard, settings, troubleshooting
  guides/                The bridge, AI, flow-core, security
  support/               Get help, FAQ, troubleshooting, report-an-issue, changelog
mdx-components.js        Nextra MDX component wiring
next.config.mjs          Nextra + static export config
wrangler.jsonc           Cloudflare Workers Static Assets config
```

Content is documentation for the upstream project at
[scoobydrew83/sfdt](https://github.com/scoobydrew83/sfdt). Apache-2.0 licensed.
