import './globals.css'
import { Inter } from 'next/font/google'
import AuthHeader from './AuthHeader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BAM FamiLex AI - Colorado Family Law Platform',
  description: 'Professional family law practice management platform for Colorado attorneys',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 relative animate-fade-in">
          <div className="absolute inset-0 bg-noise" aria-hidden="true" />
          <AuthHeader />
          {children}
        </div>
      </body>
    </html>
  )
}