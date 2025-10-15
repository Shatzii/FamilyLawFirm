import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const backend = process.env.BACKEND_URL || 'http://localhost:3001'
  try {
    const token = req.cookies.get('token')?.value || ''
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
