type Bucket = { ts: number[] }

const GLOBAL = globalThis as unknown as { __rate?: Map<string, Bucket> }
if (!GLOBAL.__rate) GLOBAL.__rate = new Map()

export function getClientKey(headers: Headers) {
  const xf = headers.get('x-forwarded-for') || ''
  const xr = headers.get('x-real-ip') || ''
  const ip = xf.split(',')[0].trim() || xr || 'local'
  const ua = headers.get('user-agent') || ''
  return `${ip}:${ua.slice(0, 40)}`
}

export function checkRateLimit(key: string, limit = 60, windowMs = 5 * 60 * 1000) {
  const now = Date.now()
  const store = GLOBAL.__rate!
  let b = store.get(key)
  if (!b) {
    b = { ts: [] }
    store.set(key, b)
  }
  // prune
  b.ts = b.ts.filter(t => now - t < windowMs)
  if (b.ts.length >= limit) return false
  b.ts.push(now)
  return true
}
