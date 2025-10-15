'use client'

import { Calendar, Calculator, FileText, MessageSquare, Shield, Users, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Badge, Button, Card } from '../ui'

export default function ColoradoDashboard() {
  const [health, setHealth] = useState<{ backend: string; forms: string; ai: string; matrix?: string; jitsi?: string; docuseal?: string; calcom?: string; umami?: string } | null>(null)
  useEffect(() => {
    let active = true
    fetch('/api/health')
      .then(r => r.json())
      .then(data => { if (active) setHealth(data) })
      .catch(() => { /* ignore */ })
    return () => { active = false }
  }, [])

  return (
    <div className="min-h-screen">
  {/* Header */}
  <div className="relative bg-gradient-to-r from-colorado-blue to-colorado-green text-white p-6 rounded-lg mb-8 overflow-hidden">
    <div className="absolute inset-0 opacity-20 sheen" />
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              🏔️ BAM FamiLex AI
            </h1>
            <p className="text-xl opacity-90">
              Colorado Family Law Platform - Professional Legal Technology
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Offline Development Ready</span>
            </div>
            <div className="text-sm opacity-90 flex gap-2 flex-wrap">
              <span>Secure • Colorado-Specific</span>
              {health && (
                <>
                  <Badge tone={health.backend === 'up' ? 'success' : 'danger'}>API {health.backend}</Badge>
                  <Badge tone={health.forms === 'up' ? 'success' : 'danger'}>Forms {health.forms}</Badge>
                  <Badge tone={health.ai === 'up' ? 'success' : 'danger'}>AI {health.ai}</Badge>
                  {typeof health.matrix !== 'undefined' && (
                    <Badge tone={health.matrix === 'up' ? 'success' : 'danger'}>Matrix {health.matrix}</Badge>
                  )}
                  {typeof health.jitsi !== 'undefined' && (
                    <Badge tone={health.jitsi === 'up' ? 'success' : 'danger'}>Jitsi {health.jitsi}</Badge>
                  )}
                  {typeof health.docuseal !== 'undefined' && (
                    <Badge tone={health.docuseal === 'up' ? 'success' : 'danger'}>DocuSeal {health.docuseal}</Badge>
                  )}
                  {typeof health.calcom !== 'undefined' && (
                    <Badge tone={health.calcom === 'up' ? 'success' : 'danger'}>Cal.com {health.calcom}</Badge>
                  )}
                  {typeof health.umami !== 'undefined' && (
                    <Badge tone={health.umami === 'up' ? 'success' : 'danger'}>Umami {health.umami}</Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

  {/* Status Alert */}
  <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded-lg animate-fade-in">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-blue-600" />
          <div>
            <p className="font-medium text-blue-800">Development Environment Active</p>
            <p className="text-blue-700 text-sm">
              All Colorado law calculations, JDF forms, and client tools are available for offline development and testing.
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        
  {/* Colorado Calculators */}
  <Card className="p-6" interactive>
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-6 h-6 text-colorado-blue" />
            <h3 className="text-lg font-semibold">Colorado Calculators</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Accurate child support, parenting time, and asset division calculations per Colorado statutes.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Child Support (JDF 1360)</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Parenting Time Analysis</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Asset Division</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
          </div>
  </Card>

  {/* JDF Forms */}
  <Card className="p-6" interactive>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-colorado-green" />
            <h3 className="text-lg font-semibold">Colorado JDF Forms</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Auto-fill official Colorado Judicial Department forms with case data.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>JDF 1111 - Dissolution Petition</span>
              <span className="text-green-600">✓ Available</span>
            </div>
            <div className="flex justify-between">
              <span>JDF 1113 - Parenting Plan</span>
              <span className="text-green-600">✓ Available</span>
            </div>
            <div className="flex justify-between">
              <span>JDF 1360 - Child Support</span>
              <span className="text-green-600">✓ Available</span>
            </div>
          </div>
  </Card>

  {/* Secure Communication */}
  <Card className="p-6" interactive>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-6 h-6 text-legal-gold" />
            <h3 className="text-lg font-semibold">Secure Co-Parent Hub</h3>
          </div>
          <p className="text-gray-600 mb-4">
            HIPAA-compliant messaging, scheduling, and document sharing for families.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Matrix.org Messaging</span>
              <span className="text-yellow-600">Dev Mode</span>
            </div>
            <div className="flex justify-between">
              <span>Jitsi Video Calls</span>
              <span className="text-yellow-600">Dev Mode</span>
            </div>
            <div className="flex justify-between">
              <span>DocuSeal E-Signature</span>
              <span className="text-yellow-600">Dev Mode</span>
            </div>
          </div>
  </Card>

  {/* Case Management */}
  <Card className="p-6" interactive>
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-colorado-blue" />
            <h3 className="text-lg font-semibold">Case Management</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Complete case tracking with Colorado-specific workflows and deadlines.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Local SQLite Database</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Court Calendars</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
            <div className="flex justify-between">
              <span>Deadline Tracking</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
          </div>
  </Card>

  {/* FamiLex AI Assistant */}
  <Card className="p-6" interactive>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
              <span className="text-white text-xs font-bold flex items-center justify-center w-full h-full">AI</span>
            </div>
            <h3 className="text-lg font-semibold">FamiLex AI Copilot</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Specialized Colorado family law AI assistant for document analysis and strategy.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Document Analysis</span>
              <span className="text-green-600">✓ Active</span>
            </div>
            <div className="flex justify-between">
              <span>Colorado Law Database</span>
              <span className="text-green-600">✓ Loaded</span>
            </div>
            <div className="flex justify-between">
              <span>Case Strategy Assistant</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
          </div>
  </Card>

  {/* Calendar & Scheduling */}
  <Card className="p-6" interactive>
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-6 h-6 text-legal-gray" />
            <h3 className="text-lg font-semibold">Calendar & Scheduling</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Court deadlines, client appointments, and co-parenting schedules.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Court Calendar Sync</span>
              <span className="text-yellow-600">Dev Mode</span>
            </div>
            <div className="flex justify-between">
              <span>Client Scheduling</span>
              <span className="text-yellow-600">Dev Mode</span>
            </div>
            <div className="flex justify-between">
              <span>Deadline Alerts</span>
              <span className="text-green-600">✓ Ready</span>
            </div>
          </div>
        </Card>

      </div>

      {/* Quick Actions */}
  <Card className="p-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/login"><Button className="w-full">New Case Intake</Button></Link>
          <Link href="/cases"><Button className="w-full">View Cases</Button></Link>
          <Link href="/calculators/child-support"><Button className="w-full">Calculate Child Support</Button></Link>
          <Link href="/forms"><Button className="w-full">Generate JDF Form</Button></Link>
          <Link href="/ai"><Button className="w-full">AI Document Review</Button></Link>
        </div>
      </Card>

      {/* Development Status */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          <span>Offline Development Environment Ready</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          All components are locally hosted • No internet dependency • Full Colorado law compliance
        </p>
        <div className="flex justify-center gap-4 mt-4 text-sm flex-wrap">
          <a className="underline text-blue-700" href="http://localhost:8008/_matrix/client/versions" target="_blank" rel="noreferrer noopener">Matrix Health</a>
          <a className="underline text-blue-700" href="http://localhost:8080" target="_blank" rel="noreferrer noopener">Jitsi</a>
          <a className="underline text-blue-700" href="http://localhost:3002" target="_blank" rel="noreferrer noopener">DocuSeal</a>
          <a className="underline text-blue-700" href="http://localhost:3003" target="_blank" rel="noreferrer noopener">Cal.com</a>
          <a className="underline text-blue-700" href="http://localhost:3004" target="_blank" rel="noreferrer noopener">Umami</a>
        </div>
      </div>
    </div>
  )
}