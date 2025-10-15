"use client"
import { useState } from 'react'
import { calculateAssetDivision } from '../../../lib/calculators'

export default function AssetDivisionPage() {
  const [inputs, setInputs] = useState({
    maritalAssets: 200000,
    maritalDebts: 50000,
    separatePropertyA: 25000,
    separatePropertyB: 10000,
    maintenanceFactor: 0.05,
  })
  const [useApi, setUseApi] = useState(false)
  const [apiResult, setApiResult] = useState<ReturnType<typeof calculateAssetDivision> | null>(null)
  const localResult = calculateAssetDivision(
    inputs.maritalAssets,
    inputs.maritalDebts,
    inputs.separatePropertyA,
    inputs.separatePropertyB,
    inputs.maintenanceFactor,
  )
  const result = apiResult ?? localResult

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Asset Division</h1>
      <p className="text-gray-600 mb-6">Colorado equitable distribution overview.</p>
      <div className="bg-white rounded-lg border p-4">
        <div>Net Marital Estate: ${result.netMaritalEstate}</div>
        <div className="text-sm text-gray-700 mt-2">Equitable Distribution (each): ${result.equitableDistribution.partyA}</div>
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
              const res = await fetch('/api/calculators/asset-division', {
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
