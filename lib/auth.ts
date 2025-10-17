import { cookies } from 'next/headers'

export async function isAuthenticated() {
  const c = await cookies()
  return c.get('auth')?.value === '1'
}
