"use client"
import { useState } from 'react'

export default function AIIntelligencePage() {
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function upload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fileInput = form.querySelector('input[type="file"]') as HTMLInputElement
    if (!fileInput?.files?.[0]) return
    const fd = new FormData()
    fd.append('file', fileInput.files[0])
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/ai/analyze', { method: 'POST', body: fd })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">FamiLex AI</h1>
      <p className="text-gray-600">Colorado-specific legal assistant for analysis and strategy.</p>
      <form onSubmit={upload} className="bg-white border rounded p-4 flex items-center gap-3">
        <label htmlFor="docfile" className="text-sm font-medium">Document</label>
        <input id="docfile" name="file" type="file" className="border rounded p-2" />
        <button className="bg-colorado-blue text-white rounded px-3 py-2" disabled={loading}>
          {loading ? 'Analyzing…' : 'Analyze Document'}
        </button>
      </form>
      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <pre className="bg-gray-50 border rounded p-3 text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  )
}
