<div align="center">

<img src="./public/logo.png" alt="SFDT logo" width="88" height="88" />

# sfdt-site

The documentation & support site for the **SFDT** suite — the `@sfdt/cli` command-line tool,
the SFDT Chrome extension, and the SFDT VS Code extension.

🌐 **Live at [sfdt.dev](https://sfdt.dev/)**

</div>

Built with [Nextra 4](https://nextra.site) (Next.js App Router), statically exported, and
deployed to **Cloudflare Pages**.

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

### B. GitHub Actions (included)

`.github/workflows/deploy.yml` builds and runs `wrangler deploy` on push to `main`. It needs two
repository secrets:

- `CLOUDFLARE_API_TOKEN` — a token with the **Workers Scripts: Edit** permission
- `CLOUDFLARE_ACCOUNT_ID`

> Note: use **either** A **or** B, not both, to avoid double deploys. The Worker is named
> `sfdt-docs` (see `wrangler.jsonc`).

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
wrangler.jsonc           Cloudflare Pages project config
```

Content is documentation for the upstream project at
[scoobydrew83/sfdt](https://github.com/scoobydrew83/sfdt). Apache-2.0 licensed.
