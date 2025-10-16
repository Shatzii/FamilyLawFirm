export const dynamic = 'force-dynamic'

async function getHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_HEALTH_URL || 'http://localhost:3000'}/api/health`, { cache: 'no-store' })
    if (!res.ok) throw new Error('bad')
    return res.json()
  } catch {
    return { ok: false }
  }
}

export default async function HealthPage() {
  const data = await getHealth()
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-brand mb-4">System Health</h1>
      <pre className="bg-white/70 dark:bg-zinc-900/40 rounded border border-subtle p-4 overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  )
}
