import './globals.css'
import { Inter } from 'next/font/google'
import AuthHeader from './AuthHeader'
import QuickExit from './QuickExit'
import Analytics from './Analytics'
import ServiceWorkerRegister from './ServiceWorkerRegister'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-brand text-white px-3 py-2 rounded">Skip to content</a>
        <div id="main" className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative animate-fade-in">
          <div className="absolute inset-0 bg-noise" aria-hidden="true" />
          <AuthHeader />
          {children}
        </div>
        <QuickExit />
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  )
}