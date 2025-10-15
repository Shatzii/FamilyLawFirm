import { NextResponse } from 'next/server'

export async function POST() {
  const isProd = process.env.NODE_ENV === 'production'
  const base = (name: string) => `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict${isProd ? '; Secure' : ''}`
  const res = NextResponse.json({ ok: true })
  res.headers.append('Set-Cookie', base('auth'))
  res.headers.append('Set-Cookie', base('token'))
  return res
}
