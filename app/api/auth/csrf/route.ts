import { NextResponse } from 'next/server'
import { issueCsrfCookie } from '../../../../lib/csrf'

export async function GET() {
  const token = issueCsrfCookie()
  return NextResponse.json({ csrfToken: token })
}
