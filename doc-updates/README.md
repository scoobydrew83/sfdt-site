# sfdt-site docs update — Phase 1 + 2 (org monitoring, CI/CD, AI agents)

These MDX files document the features added on branch
`claude/org-monitoring-cicd-agents-6qrlwu` in the `@sfdt/cli` repo. Drop them into
the Nextra site (`sfdt-site`) under `content/` and wire the nav via `_meta.js`.

> I could not edit `sfdt-site` directly — this session's git/GitHub access is
> scoped to `scoobydrew83/sfdt` only, and the site repo isn't checked out here.
> Adapt the suggested paths/slugs below to your actual content tree.

## Files & suggested placement

| File | Suggested path | Nav |
|---|---|---|
| `org-health.mdx` | `content/cli/org-health.mdx` (update existing) | CLI → Org Health |
| `notifications.mdx` | `content/cli/notifications.mdx` (new) | CLI → Notifications |
| `ci-templates.mdx` | `content/cli/ci-templates.mdx` (new) | CLI → CI/CD Templates |
| `smart-deploy.mdx` | `content/cli/smart-deploy.mdx` (new) | CLI → Smart Deploy |
| `retrofit.mdx` | `content/cli/retrofit.mdx` (new) | CLI → Retrofit |
| `ai-and-agents.mdx` | `content/cli/ai-and-agents.mdx` (update/new) | CLI → AI & Agents |
| `config-reference.mdx` | merge into your existing config reference | CLI → Configuration |
| `mcp-tools.mdx` | merge into your existing MCP page | CLI → MCP Server |

### Example `_meta.js` (content/cli/_meta.js)
```js
export default {
  // ...existing entries...
  'org-health': 'Org Health',
  'notifications': 'Notifications',
  'smart-deploy': 'Smart Deploy',
  'ci-templates': 'CI/CD Templates',
  'retrofit': 'Retrofit',
  'ai-and-agents': 'AI & Agents',
}
```

## Changelog highlight (for the release notes / what's-new page)

- Org Health grew to ~25 native checks (validation/workflow status, field-level
  access lint, connected apps, unused permission sets, legacy API usage,
  deployment history, paused flows, and more). License/Beta-gated checks degrade
  to a warning instead of failing CI.
- Multi-channel notifications (Slack, MS Teams, email, generic webhook, Grafana
  Loki) with per-channel event filters and severity routing, plus optional
  AI executive-summary digests.
- `sfdt ci init` generates ready-to-run GitHub/GitLab/Azure/Bitbucket pipelines.
- `sfdt deploy --smart` delta deploys with smart test selection and overwrite
  protection; optional AI deploy-error analysis and a bounded coding-agent
  auto-fix loop.
- `sfdt retrofit` (source → commit → smart-deploy) and `sfdt pr comment` PR
  decoration.
- A non-interactive `--agent` convention across AI commands and per-metadata-type
  documentation prompts.
</content>
