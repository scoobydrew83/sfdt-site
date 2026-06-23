import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import nextra from 'nextra'

const projectRoot = dirname(fileURLToPath(import.meta.url))

const withNextra = nextra({
  // Nextra 4 reads MDX from the `content/` directory by default.
  defaultShowCopyCode: true,
  search: {
    codeblocks: false
  }
})

export default withNextra({
  output: 'export',
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  images: {
    unoptimized: true
  }
})
