import { NextRequest, NextResponse } from 'next/server'
import { env } from '../../../../lib/env'

export async function GET(req: NextRequest) {
  const backend = env.BACKEND_URL
  try {
    const raw = req.cookies.get('token')?.value || ''
    const token = (() => { try { return decodeURIComponent(raw) } catch { return raw } })()
    const r = await fetch(`${backend}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!r.ok) return NextResponse.json({ authenticated: false }, { status: 401 })
    const data = await r.json()
    return NextResponse.json({ authenticated: true, user: data })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
