import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import MarketingLanding from './components/MarketingLanding'

export default function Home() {
  const c = cookies()
  const authed = !!c.get('token')?.value
  if (authed) redirect('/cases')
  return (
    <main className="container mx-auto px-4 py-8">
      <MarketingLanding />
    </main>
  )
}