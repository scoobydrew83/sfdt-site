// Static export (`output: 'export'` in next.config) turns this metadata route
// into a build-time file. Next requires the route to say so explicitly, or the
// build fails with "export const dynamic ... not configured on route". Added in
// ecd0252 without it, which broke the Build check on master.
export const dynamic = 'force-static'

export default function sitemap() {
  return [
    {
      url: 'https://sfdt.dev',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://sfdt.dev/cli',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://sfdt.dev/chrome-extension',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://sfdt.dev/vscode-extension',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://sfdt.dev/getting-started',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
