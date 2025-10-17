import { NextResponse } from 'next/server'

async function check(url: string, opts?: RequestInit & { timeoutMs?: number }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 8000)
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal })
    clearTimeout(timeout)
    return res.ok
  } catch {
    clearTimeout(timeout)
    return false
  }
}

export async function GET() {
  const isProd = process.env.NODE_ENV === 'production'
  // Only default to localhost in development; in production, treat missing URLs as not_configured
  const backend = process.env.BACKEND_URL || (isProd ? '' : 'http://localhost:3001')
  const ai = process.env.AI_URL || (isProd ? '' : 'http://localhost:8001')
  const matrix = process.env.MATRIX_URL || (isProd ? '' : 'http://localhost:8008')
  const jitsi = process.env.JITSI_URL || (isProd ? '' : 'http://localhost:8080')
  const docuseal = process.env.DOCUSEAL_URL || (isProd ? '' : 'http://localhost:3002')
  const calcom = process.env.CALCOM_URL || (isProd ? '' : 'http://localhost:3003')
  const umami = process.env.UMAMI_URL || (isProd ? '' : 'http://localhost:3004')

  const statuses: Record<string, 'up' | 'down' | 'not_configured'> = {
    backend: 'not_configured',
    forms: 'not_configured',
    ai: 'not_configured',
    matrix: 'not_configured',
    jitsi: 'not_configured',
    docuseal: 'not_configured',
    calcom: 'not_configured',
    umami: 'not_configured',
  }

  // Backend + forms
  if (backend) {
    const backendUp = await check(`${backend}/`)
    statuses.backend = backendUp ? 'up' : 'down'
    if (backendUp) {
      const formsUp = await check(`${backend}/api/forms/colorado`)
      statuses.forms = formsUp ? 'up' : 'down'
    } else {
      statuses.forms = 'down'
    }
  }

  // Optional services
  const optionalChecks: Array<Promise<void>> = []
  const setStatus = async (name: keyof typeof statuses, url: string, path?: string) => {
    const ok = await check(path ? `${url}${path}` : `${url}/`)
    statuses[name] = ok ? 'up' : 'down'
  }
  if (ai) optionalChecks.push(setStatus('ai', ai))
  if (matrix) optionalChecks.push(setStatus('matrix', matrix, '/_matrix/client/versions'))
  if (jitsi) optionalChecks.push(setStatus('jitsi', jitsi))
  if (docuseal) optionalChecks.push(setStatus('docuseal', docuseal))
  if (calcom) optionalChecks.push(setStatus('calcom', calcom))
  if (umami) optionalChecks.push(setStatus('umami', umami))
  await Promise.all(optionalChecks)

  return NextResponse.json({
    ...statuses,
    backendUrl: backend || '(unset)',
    environment: isProd ? 'production' : 'development',
    checkedAt: new Date().toISOString(),
  })
}
