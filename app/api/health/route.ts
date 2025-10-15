import { NextResponse } from 'next/server'

async function check(url: string, opts?: RequestInit & { timeoutMs?: number }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), opts?.timeoutMs ?? 2000)
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
  const backend = process.env.BACKEND_URL || 'http://localhost:3001'
  const ai = process.env.AI_URL || 'http://localhost:8001'
  const matrix = process.env.MATRIX_URL || 'http://localhost:8008'
  const jitsi = process.env.JITSI_URL || 'http://localhost:8080'
  const docuseal = process.env.DOCUSEAL_URL || 'http://localhost:3002'
  const calcom = process.env.CALCOM_URL || 'http://localhost:3003'
  const umami = process.env.UMAMI_URL || 'http://localhost:3004'

  const [backendUp, formsUp, aiUp, matrixUp, jitsiUp, docusealUp, calcomUp, umamiUp] = await Promise.all([
    check(`${backend}/`),
    check(`${backend}/api/forms/colorado`),
    check(`${ai}/`),
    check(`${matrix}/_matrix/client/versions`),
    check(`${jitsi}/`),
    check(`${docuseal}/`),
    check(`${calcom}/`),
    check(`${umami}/`),
  ])

  return NextResponse.json({
    backend: backendUp ? 'up' : 'down',
    forms: formsUp ? 'up' : 'down',
    ai: aiUp ? 'up' : 'down',
    matrix: matrixUp ? 'up' : 'down',
    jitsi: jitsiUp ? 'up' : 'down',
    docuseal: docusealUp ? 'up' : 'down',
    calcom: calcomUp ? 'up' : 'down',
    umami: umamiUp ? 'up' : 'down',
  })
}
