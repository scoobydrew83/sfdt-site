# data/upstream — synced sfdt catalogs. DO NOT EDIT.

Machine-generated catalogs copied from the sfdt repo's `generated/` directory
(`npm run generate:catalogs` there; code is the source of truth and its CI
fails on drift). Site pages and `components/catalogs.jsx` import these
statically, so every count and inventory on sfdt.dev is derived — never typed.

Refresh with:

```bash
node scripts/sync-upstream-catalogs.mjs           # from a sibling ../sfdt checkout
node scripts/sync-upstream-catalogs.mjs --check   # drift check (exit 1 when stale)
```

The `/sync-docs-site` skill runs this on every sfdt release.
