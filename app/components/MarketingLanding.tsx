'use client'

import Link from 'next/link'
import { Button, Card, Badge } from '../ui'
import { Calculator, FileText, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function MarketingLanding() {
  const [isDev, setIsDev] = useState(false)
  const [health, setHealth] = useState<{ backend?: string; forms?: string } | null>(null)

  useEffect(() => {
    // Detect dev via NODE_ENV and try health endpoint softly
    setIsDev(process.env.NODE_ENV !== 'production')
    let active = true
    fetch('/api/health').then(r => r.ok ? r.json() : null).then(d => { if (active) setHealth(d) }).catch(() => {})
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen">
      {/* Dev ribbon (hidden in prod) */}
      {isDev && (
        <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 text-sm py-2 px-4 flex items-center justify-between">
          <span>Development mode</span>
          <div className="flex items-center gap-2">
            {health?.backend && (
              <Badge tone={health.backend === 'up' ? 'success' : 'danger'}>API {health.backend}</Badge>
            )}
            {health?.forms && (
              <Badge tone={health.forms === 'up' ? 'success' : 'danger'}>Forms {health.forms}</Badge>
            )}
            <Link className="underline" href="/health">Health</Link>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-gradient-to-r from-colorado-blue to-colorado-green text-white p-8 rounded-xl mb-10 overflow-hidden">
        <div className="absolute inset-0 opacity-20 sheen" />
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Colorado Family Law, Simplified and Secure</h1>
          <p className="text-lg md:text-xl opacity-95 mb-6">Accurate calculators, official JDF forms, and a secure co‑parent hub—built for Colorado law.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login"><Button size="lg">Log in</Button></Link>
            <Link href="/calculators/child-support"><Button variant="secondary" size="lg">Try Child Support Calculator</Button></Link>
          </div>
          <p className="mt-4 text-sm opacity-90">Colorado‑specific • Secure by design • Works offline in development</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3"><Calculator className="w-6 h-6 text-colorado-blue" /><h3 className="font-semibold">Colorado‑accurate Calculators</h3></div>
          <p className="text-gray-600">Child Support (JDF 1360), Parenting Time, Asset Division—per Colorado statutes.</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3"><FileText className="w-6 h-6 text-colorado-green" /><h3 className="font-semibold">JDF Form Automation</h3></div>
          <p className="text-gray-600">Auto‑fill official JDF forms (1111, 1113, 1360 and more) from case data.</p>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-3"><Shield className="w-6 h-6 text-legal-gold" /><h3 className="font-semibold">Secure Co‑Parent Hub</h3></div>
          <p className="text-gray-600">Messaging, documents, and schedules with privacy by design.</p>
        </Card>
      </section>

      {/* Spotlight: Calculators */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Calculator Spotlight</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5" interactive>
            <h3 className="font-semibold mb-2">Child Support (JDF 1360)</h3>
            <p className="text-gray-600 mb-3">Guideline‑accurate support estimates. Use without login; save/export requires login.</p>
            <Link href="/calculators/child-support"><Button>Open calculator</Button></Link>
          </Card>
          <Card className="p-5" interactive>
            <h3 className="font-semibold mb-2">Parenting Time</h3>
            <p className="text-gray-600 mb-3">Balance schedules and overnights with clear assumptions.</p>
            <Link href="/calculators/parenting-time"><Button>Open calculator</Button></Link>
          </Card>
          <Card className="p-5" interactive>
            <h3 className="font-semibold mb-2">Asset Division</h3>
            <p className="text-gray-600 mb-3">Equitable distribution analysis with Colorado‑specific factors.</p>
            <Link href="/calculators/asset-division"><Button>Open calculator</Button></Link>
          </Card>
        </div>
      </section>

      {/* Forms teaser */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Colorado JDF Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-1">JDF 1111 • Petition</h3>
            <p className="text-gray-600 mb-3">Start dissolution or allocation of parental responsibilities.</p>
            <div className="flex gap-2">
              <Link href="/forms"><Button>View forms</Button></Link>
              <Link href="/login"><Button variant="secondary">Auto‑fill (Login)</Button></Link>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold mb-1">JDF 1113 • Parenting Plan</h3>
            <p className="text-gray-600 mb-3">Create a plan that aligns with Colorado guidelines.</p>
            <div className="flex gap-2">
              <Link href="/forms"><Button>View forms</Button></Link>
              <Link href="/login"><Button variant="secondary">Auto‑fill (Login)</Button></Link>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold mb-1">JDF 1360 • Child Support</h3>
            <p className="text-gray-600 mb-3">Generate accurate support worksheets and exhibits.</p>
            <div className="flex gap-2">
              <Link href="/forms"><Button>View forms</Button></Link>
              <Link href="/login"><Button variant="secondary">Auto‑fill (Login)</Button></Link>
            </div>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">How it works</h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <li className="bg-white border rounded-lg p-5"><span className="font-semibold">1) Create a case</span><p className="text-gray-600">Add parties and key facts.</p></li>
          <li className="bg-white border rounded-lg p-5"><span className="font-semibold">2) Add data</span><p className="text-gray-600">Income, parenting time, assets, and forms.</p></li>
          <li className="bg-white border rounded-lg p-5"><span className="font-semibold">3) Generate & share</span><p className="text-gray-600">Auto‑filled JDFs, worksheets, and secure docs.</p></li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="text-sm text-gray-600 border-t pt-6 pb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p>FamiLex is not a law firm and does not provide legal advice.</p>
          <nav className="flex gap-4">
            <Link className="underline" href="/health">Health</Link>
            <Link className="underline" href="/login">Login</Link>
            <Link className="underline" href="/documents">Documents</Link>
            <Link className="underline" href="/cases">Cases</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
