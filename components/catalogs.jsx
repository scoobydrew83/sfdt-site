/**
 * Catalog-driven components. All data comes from data/upstream/*.json — a
 * checked-in snapshot of the sfdt repo's generated/ catalogs (synced by
 * scripts/sync-upstream-catalogs.mjs; regenerated upstream from code by
 * `npm run generate:catalogs`). Never hand-edit the JSON: counts and
 * inventories on this site are derived, not written.
 */

import summary from '../data/upstream/summary.json';
import catalogVersion from '../data/upstream/catalog-version.json';
import commandsCatalog from '../data/upstream/commands.json';
import chromeCatalog from '../data/upstream/chrome-features.json';
import guiCatalog from '../data/upstream/gui-pages.json';

/** Inline version literal, e.g. <CurrentVersion package="cli" />. */
export function CurrentVersion({ package: pkg = 'cli' }) {
  const key = `${pkg}Version`;
  const v = catalogVersion[key];
  if (!v) throw new Error(`CurrentVersion: unknown package "${pkg}" (no ${key} in catalog-version.json)`);
  return <span>v{v}</span>;
}

/** Inline count from summary.json, e.g. <SurfaceCount surface="cli" metric="topLevelCommands" />. */
export function SurfaceCount({ surface, metric }) {
  const v = summary?.[surface]?.[metric];
  if (typeof v !== 'number') {
    throw new Error(`SurfaceCount: no numeric summary.${surface}.${metric} in the upstream catalog`);
  }
  return <span>{v}</span>;
}

const BADGE_STYLES = {
  stable: { background: '#dcfce7', color: '#166534' },
  beta: { background: '#fef9c3', color: '#854d0e' },
  develop: { background: '#e0e7ff', color: '#3730a3' },
  planned: { background: '#f3f4f6', color: '#374151' },
  research: { background: '#f3f4f6', color: '#6b7280' },
  deprecated: { background: '#fee2e2', color: '#991b1b' },
};

/** Stability badge per the docs status taxonomy: <StabilityBadge status="beta" />. */
export function StabilityBadge({ status }) {
  const style = BADGE_STYLES[status];
  if (!style) throw new Error(`StabilityBadge: unknown status "${status}" (valid: ${Object.keys(BADGE_STYLES).join(', ')})`);
  return (
    <span
      style={{
        ...style,
        borderRadius: '9999px',
        padding: '0.1rem 0.55rem',
        fontSize: '0.72rem',
        fontWeight: 600,
        textTransform: 'capitalize',
        verticalAlign: 'middle',
      }}
    >
      {status}
    </span>
  );
}

// docsCategory → command-reference page slug (same taxonomy as the upstream
// COMMAND_POLICY; the category pages carry the #sfdt-<name> anchors).
const CATEGORY_PAGES = {
  core: 'core',
  metadata: 'metadata',
  'testing-quality': 'testing-quality',
  ai: 'ai',
  'org-health': 'org-health',
  'config-utils': 'config-utils',
  'platform-bridge': 'platform-bridge',
};

/**
 * Command table for one docsCategory, generated from commands.json:
 * <CommandTable category="metadata" />. Hidden commands are excluded.
 */
export function CommandTable({ category }) {
  if (!CATEGORY_PAGES[category]) {
    throw new Error(`CommandTable: unknown category "${category}"`);
  }
  const rows = commandsCatalog.commands.filter((c) => c.docsCategory === category && !c.hidden);
  if (!rows.length) throw new Error(`CommandTable: no commands in category "${category}"`);
  return (
    <table>
      <thead>
        <tr>
          <th align="left">Command</th>
          <th align="left">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.id}>
            <td>
              <a href={`/cli/commands/${CATEGORY_PAGES[category]}#sfdt-${c.id}`}>
                <code>sfdt {c.id}</code>
              </a>
            </td>
            <td>{c.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Chrome feature table generated from chrome-features.json.
 * Optional `details` maps feature id → richer prose than the manifest name;
 * an unknown id in `details` fails the build (drift guard).
 */
export function FeatureTable({ bridgeOnly = false, details = {} }) {
  const ids = new Set(chromeCatalog.features.map((f) => f.id));
  for (const id of Object.keys(details)) {
    if (!ids.has(id)) throw new Error(`FeatureTable: details key "${id}" is not a registered feature`);
  }
  const rows = chromeCatalog.features.filter((f) => (bridgeOnly ? f.bridgeRequired : true));
  return (
    <table>
      <thead>
        <tr>
          <th align="left">Id</th>
          <th align="left">Feature</th>
          <th align="left">Bridge</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((f) => (
          <tr key={f.id}>
            <td><code>{f.id}</code></td>
            <td>{details[f.id] ?? f.name}</td>
            <td>{f.bridgeRequired ? '🔌' : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * GUI page table generated from gui-pages.json, in nav order with group
 * headers. `details` maps page id → { shows, source } curated prose; an
 * unknown id fails the build, and a catalog page missing from `details`
 * renders with an em-dash (a visible, non-breaking gap).
 */
export function GuiPageTable({ details = {} }) {
  const ids = new Set(guiCatalog.pages.map((p) => p.id));
  for (const id of Object.keys(details)) {
    if (!ids.has(id)) throw new Error(`GuiPageTable: details key "${id}" is not a routed GUI page`);
  }
  return (
    <table>
      <thead>
        <tr>
          <th align="left">Page</th>
          <th align="left">Group</th>
          <th align="left">What it shows</th>
          <th align="left">Data source</th>
        </tr>
      </thead>
      <tbody>
        {guiCatalog.pages.map((p) => (
          <tr key={p.id}>
            <td><strong>{p.label}</strong></td>
            <td>{p.group}</td>
            <td>{details[p.id]?.shows ?? '—'}</td>
            <td>{details[p.id]?.source ? <code>{details[p.id].source}</code> : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
