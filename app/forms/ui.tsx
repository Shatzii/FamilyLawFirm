"use client"
import { useEffect, useState } from 'react'

type JdfForm = { id: string; name: string }

export default function FormsClient() {
  const [forms, setForms] = useState<JdfForm[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/forms')
      .then((r) => r.json())
      .then((data) => {
        if (!active) return
        setForms(data)
        setLoading(false)
      })
      .catch(() => {
        if (!active) return
        setError('Failed to load forms')
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  if (loading) return <div className="text-gray-600">Loading…</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <ul className="space-y-2">
      {forms.map((f) => (
        <li key={f.id} className="bg-white border rounded p-3 flex justify-between">
          <span>{f.id} — {f.name}</span>
          <button className="bg-colorado-blue text-white px-3 py-1 rounded">Open</button>
        </li>
      ))}
    </ul>
  )
}
