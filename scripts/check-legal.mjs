// Post-build guard: /privacy and /terms exist in the static export with the
// approved contact route, entity and postal address, and the footer links them.
import { readFileSync, existsSync } from 'node:fs'
const must = ['sales@hallowsgroup.com', 'Hallows Group LLC', '5900 Balcones Drive #31966', 'Austin, TX 78731']
let fail = 0
for (const page of ['privacy', 'terms']) {
  const f = existsSync(`out/${page}.html`) ? `out/${page}.html` : `out/${page}/index.html`
  if (!existsSync(f)) { console.error(`missing ${page}`); fail++; continue }
  const html = readFileSync(f, 'utf8')
  for (const s of must) if (!html.includes(s)) { console.error(`${page}: missing "${s}"`); fail++ }
  if (page === 'privacy' && !html.includes('developers.cloudflare.com/logs/faq/logpull-api')) { console.error('privacy: missing Cloudflare log retention cite'); fail++ }
}
const home = readFileSync('out/index.html', 'utf8')
if (!home.includes('href="/privacy/"') || !home.includes('href="/terms/"')) { console.error('footer links missing'); fail++ }
if (fail) process.exit(1)
console.log('legal pages OK')
