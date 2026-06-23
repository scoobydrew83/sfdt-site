import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://sfdt.dev'),
  title: {
    default: 'SFDT — Salesforce DevTools',
    template: '%s — SFDT Docs'
  },
  description:
    'Documentation & support for the SFDT suite: the @sfdt/cli command-line tool, the SFDT Chrome extension for Flow Builder & Setup, and the SFDT VS Code extension.',
  applicationName: 'SFDT Docs',
  appleWebApp: { title: 'SFDT Docs' },
  openGraph: {
    type: 'website',
    title: 'SFDT — Salesforce DevTools',
    description:
      'Deploy, test, and ship Salesforce changes with confidence — CLI, Chrome extension, and VS Code extension.'
  }
}

const logo = (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        background: 'linear-gradient(135deg, #0d9dda 0%, #1b96ff 100%)',
        color: '#fff',
        fontSize: 14,
        fontWeight: 800
      }}
    >
      ⚡
    </span>
    <span>
      SFDT
      <span style={{ opacity: 0.6, fontWeight: 500 }}> Docs</span>
    </span>
  </span>
)

const navbar = (
  <Navbar
    logo={logo}
    projectLink="https://github.com/scoobydrew83/sfdt"
    chatLink="https://www.npmjs.com/package/@sfdt/cli"
    chatTitle="View @sfdt/cli on npm"
  />
)

const footer = (
  <Footer>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span>
        MIT {new Date().getFullYear()} © SFDT — Salesforce DevTools. Not affiliated with
        Salesforce, Inc.
      </span>
      <span style={{ opacity: 0.6, fontSize: '0.85em' }}>
        Built with Nextra. “Salesforce” and “Flow Builder” are trademarks of Salesforce, Inc.
      </span>
    </div>
  </Footer>
)

export default async function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head
        color={{ hue: 200, saturation: 90 }}
        backgroundColor={{ dark: '#0b0f14', light: '#ffffff' }}
      >
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/scoobydrew83/sfdt/tree/main"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1, toggleButton: true }}
          toc={{ float: true, backToTop: 'Scroll to top' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}
