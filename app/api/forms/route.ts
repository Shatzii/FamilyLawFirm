import { NextResponse } from 'next/server'

export async function GET() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(`${backendUrl}/api/forms/colorado`, { signal: controller.signal })
    clearTimeout(timeout)
    if (!res.ok) throw new Error(`Backend responded ${res.status}`)
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    // Fallback stub when backend is not running
    return NextResponse.json(
      [
        { id: 'JDF 1111', name: 'Petition for Dissolution of Marriage' },
        { id: 'JDF 1113', name: 'Parenting Plan' },
        { id: 'JDF 1360', name: 'Child Support Worksheet' },
      ],
      { status: 200 }
    )
  }
}
