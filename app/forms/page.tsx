import { cookies } from 'next/headers'
import FormsClient from './ui'

export default async function ColoradoFormsPage() {
  const authed = !!cookies().get('token')?.value
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Colorado JDF Forms</h1>
      <p className="text-gray-600 mb-4">Auto-fill and generate official Colorado Judicial Department forms.</p>
      {/* Render client component which fetches list; server gates overall access */}
      {!authed ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4 text-sm">
          You’re not signed in. <a className="underline" href="/login">Go to Login</a>
        </div>
      ) : (
        <FormsClient />
      )}
    </div>
  )
}
