import './globals.css'
import AuthHeader from './AuthHeader'
import QuickExit from './QuickExit'
import Analytics from './Analytics'
import ServiceWorkerRegister from './ServiceWorkerRegister'
import ToastProvider from './components/ToastProvider'

// Use system sans font to avoid font module issues during builds

export const metadata = {
  title: 'BAM FamiLex AI - Colorado Family Law Platform',
  description: 'Professional family law practice management platform for Colorado attorneys',
  manifest: '/manifest.json',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
  <body className="font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand text-white px-3 py-2 rounded">Skip to content</a>
        <ToastProvider>
          <div id="main" className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative animate-fade-in">
            <div className="absolute inset-0 bg-noise" aria-hidden="true" />
            <AuthHeader />
            <nav className="border-b border-card/60 bg-white/70 backdrop-blur sticky top-0 z-30">
              <div className="max-w-6xl mx-auto px-3 py-2 text-sm flex gap-4">
                <a className="hover:underline" href="/calculators">Calculators</a>
                <a className="hover:underline" href="/forms">Forms</a>
                <a className="hover:underline" href="/documents">Documents</a>
                <a className="hover:underline" href="/cases">Cases</a>
                <a className="hover:underline ml-auto text-muted" href="/health">Status</a>
              </div>
            </nav>
            {children}
            <footer className="mt-12 border-t border-card/70 bg-white/70 backdrop-blur">
              <div className="max-w-6xl mx-auto px-3 py-6 text-sm text-muted flex flex-col md:flex-row gap-2 md:gap-6">
                <div>© {new Date().getFullYear()} BAM FamiLex AI</div>
                <a className="hover:underline" href="/login">Login</a>
                <a className="hover:underline" href="/health">System Health</a>
                <a className="hover:underline" href="/docs">Docs</a>
                <a className="hover:underline" href="/sitemap.xml">Sitemap</a>
              </div>
            </footer>
          </div>
        </ToastProvider>
        <QuickExit />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}