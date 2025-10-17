"use client"
import { useState } from 'react'
import { calculateColoradoChildSupport } from '../../../lib/calculators'
import { useToast } from '../../components/ToastProvider'

export default function ChildSupportCalculatorPage() {
  const { toast } = useToast()
  const [inputs, setInputs] = useState({
    parentAIncome: 4500,
    parentBIncome: 3500,
    childrenCount: 1,
    overnightsParentA: 182,
    overnightsParentB: 183,
    extraordinaryMedical: 0,
    extraordinaryExpenses: 0,
    educationalExpenses: 0,
    otherChildSupport: 0,
  })
  const [useApi, setUseApi] = useState(false)
  const [apiResult, setApiResult] = useState<ReturnType<typeof calculateColoradoChildSupport> | null>(null)
  const result = apiResult ?? calculateColoradoChildSupport(inputs)

  function update<K extends keyof typeof inputs>(key: K, value: number) {
    if (key === 'overnightsParentA') {
      const a = Math.max(0, Math.min(365, Math.round(value)))
      const b = 365 - a
      setInputs(prev => ({ ...prev, overnightsParentA: a, overnightsParentB: b }))
    } else if (key === 'overnightsParentB') {
      const b = Math.max(0, Math.min(365, Math.round(value)))
      const a = 365 - b
      setInputs(prev => ({ ...prev, overnightsParentB: b, overnightsParentA: a }))
    } else if (key === 'childrenCount') {
      const c = Math.max(1, Math.min(6, Math.round(value)))
      setInputs(prev => ({ ...prev, childrenCount: c }))
    } else if (key === 'parentAIncome' || key === 'parentBIncome') {
      const v = Math.max(0, Math.round(value))
      setInputs(prev => ({ ...prev, [key]: v }))
    } else {
      setInputs(prev => ({ ...prev, [key]: value }))
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Child Support Calculator (Colorado)</h1>
      <p className="text-gray-600 mb-6">CRS 14-10-115 - Income shares model</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white rounded-lg border p-4 mb-6">
        <label className="flex flex-col text-sm">
          Parent A Gross Monthly Income
          <input type="number" min={0} className="mt-1 border rounded p-2" value={inputs.parentAIncome}
            onChange={e => update('parentAIncome', Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-sm">
          Parent B Gross Monthly Income
          <input type="number" min={0} className="mt-1 border rounded p-2" value={inputs.parentBIncome}
            onChange={e => update('parentBIncome', Number(e.target.value))} />
        </label>
        <label className="flex flex-col text-sm">
          Children Count
          <input type="number" min={1} max={6} className="mt-1 border rounded p-2" value={inputs.childrenCount}
            onChange={e => update('childrenCount', Number(e.target.value))} />
          <span className="text-xs text-gray-600 mt-1">Range: 1–6</span>
        </label>
        <label className="flex flex-col text-sm">
          Overnights Parent A
          <input type="number" min={0} max={365} className="mt-1 border rounded p-2" value={inputs.overnightsParentA}
            onChange={e => update('overnightsParentA', Number(e.target.value))} />
          <span className="text-xs text-gray-600 mt-1">Parent B overnights auto-set to {inputs.overnightsParentB}</span>
        </label>
        <label className="flex flex-col text-sm">
          Overnights Parent B
          <input type="number" min={0} max={365} className="mt-1 border rounded p-2" value={inputs.overnightsParentB}
            onChange={e => update('overnightsParentB', Number(e.target.value))} />
          <span className="text-xs text-gray-600 mt-1">Parent A overnights auto-set to {inputs.overnightsParentA}</span>
        </label>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useApi} onChange={(e) => setUseApi(e.target.checked)} />
          Calculate via API
        </label>
        {useApi && (
          <button
            className="bg-colorado-blue text-white rounded px-3 py-1 text-sm"
            onClick={async () => {
              try {
                const res = await fetch('/api/calculators/child-support', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(inputs),
                })
                if (!res.ok) throw new Error(await res.text())
                const data = await res.json()
                setApiResult(data)
                toast({ tone: 'success', title: 'Calculated', description: 'API result loaded.' })
              } catch (e: any) {
                toast({ tone: 'error', title: 'Calculation failed', description: e?.message || 'API error' })
              }
            }}
          >
            Run
          </button>
        )}
      </div>

      <div className="bg-green-50 border border-green-200 rounded p-4">
        <div className="text-lg font-semibold">Estimated Monthly Support: ${result.monthlySupport}</div>
        <div className="text-sm text-gray-700 mt-2">
          Combined Income: ${result.breakdown.combinedIncome} • Basic Obligation: ${result.breakdown.basicObligation}
        </div>
      </div>
    </div>
  )
}
