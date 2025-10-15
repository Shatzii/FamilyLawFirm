"use client"
import { useState } from 'react'
import { calculateParentingTime } from '../../../lib/calculators'

export default function ParentingTimePage() {
  const [inputs, setInputs] = useState({
    regularSchedule: { weekdaysParentA: 3, weekendsParentA: 1, holidaysParentA: 5 },
    summerSchedule: { weeksParentA: 6 },
    schoolBreaks: { springBreakParentA: true, fallBreakParentA: false, winterBreakAlternating: true },
  })
  const [useApi, setUseApi] = useState(false)
  const [apiResult, setApiResult] = useState<ReturnType<typeof calculateParentingTime> | null>(null)
  const result = apiResult ?? calculateParentingTime(inputs)

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Parenting Time</h1>
      <p className="text-gray-600 mb-6">Estimated annual overnights and percentages.</p>
      <div className="bg-white rounded-lg border p-4">
        <div>Overnights A: {result.annualOvernights.parentA}</div>
        <div>Overnights B: {result.annualOvernights.parentB}</div>
        <div className="text-sm text-gray-700 mt-2">Classification: {result.coloradoClassification}</div>
      </div>
      <div className="flex items-center gap-3 mt-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useApi} onChange={(e) => setUseApi(e.target.checked)} />
          Calculate via API
        </label>
        {useApi && (
          <button
            className="bg-colorado-blue text-white rounded px-3 py-1 text-sm"
            onClick={async () => {
              const res = await fetch('/api/calculators/parenting-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs),
              })
              const data = await res.json()
              setApiResult(data)
            }}
          >
            Run
          </button>
        )}
      </div>
    </div>
  )
}
