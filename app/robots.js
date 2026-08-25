// Static export (`output: 'export'` in next.config) turns this metadata route
// into a build-time file. Next requires the route to say so explicitly, or the
// build fails with "export const dynamic ... not configured on route". Added in
// ecd0252 without it, which broke the Build check on master.
export const dynamic = 'force-static'

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://sfdt.dev/sitemap.xml',
  }
}
