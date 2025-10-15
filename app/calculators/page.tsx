import Link from 'next/link'

export default function CalculatorSuitePage() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Calculator Suite</h1>
      <p className="text-gray-600 mb-6">Colorado child support, parenting time, and asset division tools.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/calculators/child-support" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md">
          Child Support (JDF 1360)
        </Link>
        <Link href="/calculators/parenting-time" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md">
          Parenting Time
        </Link>
        <Link href="/calculators/asset-division" className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md">
          Asset Division
        </Link>
      </div>
    </div>
  )
}
