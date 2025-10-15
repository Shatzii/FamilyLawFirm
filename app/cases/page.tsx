'use client'

import { useEffect, useState } from 'react'
import { Button, Card, Input, Skeleton } from '../ui'

type Case = { id: number; title: string; created_by?: number | null; created_at: string }

export default function CasesPage() {
  const [cases, setCases] = useState<Case[] | null>(null)
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadCases() {
    try {
      const r = await fetch('/api/cases', { cache: 'no-store' })
      const data = await r.json()
      setCases(Array.isArray(data) ? data : [])
    } catch (_) {
      setCases([])
    }
  }

  useEffect(() => { loadCases() }, [])

  async function createCase(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) return
    setLoading(true)
    try {
      const r = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!r.ok) {
        const msg = await r.text()
        throw new Error(msg || 'Failed to create case')
      }
      setTitle('')
      await loadCases()
    } catch (e: any) {
      setError(e?.message || 'Failed to create case')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Cases</h1>
          <p className="text-muted">Manage active and archived matters.</p>
        </div>
      </div>
      <Card className="p-4 mb-6" interactive>
        <form onSubmit={createCase} className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="New case title (e.g., Smith v. Smith)"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Case'}</Button>
        </form>
        {error && <div className="mt-3 text-red-700 bg-red-100 border border-red-200 rounded p-3">{error}</div>}
      </Card>
      <Card className="overflow-hidden" interactive>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {cases === null && (
              <tr>
                <td className="p-3" colSpan={3}><Skeleton className="h-6 w-full" /></td>
              </tr>
            )}
            {Array.isArray(cases) && cases.map(c => (
              <tr key={c.id} className="border-t border-gray-100">
                <td className="p-3">{c.id}</td>
                <td className="p-3">{c.title}</td>
                <td className="p-3">{new Date(c.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {Array.isArray(cases) && cases.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={3}>No cases yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
