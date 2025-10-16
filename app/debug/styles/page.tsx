export default function StyleDebug() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold text-brand">Style Debug</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded border border-subtle bg-card">
          <div className="text-fg">Foreground text</div>
          <div className="text-muted">Muted text</div>
          <div className="bg-brand text-white px-2 py-1 mt-2 inline-block rounded">Brand bg</div>
          <div className="bg-accent text-white px-2 py-1 mt-2 inline-block rounded">Accent bg</div>
        </div>
        <div className="p-4 rounded border border-subtle bg-card ring-2 ring-brand">
          <input className="border border-subtle rounded px-2 py-1 w-full" placeholder="Input sample" />
          <button className="mt-2 bg-brand text-white px-3 py-2 rounded hover:opacity-90">Button</button>
        </div>
      </div>
    </div>
  )
}
