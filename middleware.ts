import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const protectedPrefixes = ['/forms', '/calculators', '/documents', '/coparenting', '/video']
  const { pathname } = req.nextUrl
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  const authed = req.cookies.get('token')?.value
  if (authed) {
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'no-store')
    res.headers.set('Pragma', 'no-cache')
    res.headers.set('Expires', '0')
    return res
  }

  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/forms/:path*',
    '/calculators/:path*',
    '/cases/:path*',
    '/documents/:path*',
    '/coparenting/:path*',
    '/video/:path*',
  ],
}
