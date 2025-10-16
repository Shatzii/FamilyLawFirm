"use client"
export default function QuickExit() {
  function handleExit() {
    try {
      // Replace history entry and navigate to a neutral site
      window.location.replace('https://weather.com')
    } catch {
      window.location.href = 'https://weather.com'
    }
  }
  return (
    <button
      onClick={handleExit}
      aria-label="Quickly exit to a neutral website"
      className="fixed bottom-4 right-4 z-50 rounded-md bg-red-600 text-white px-3 py-2 text-sm shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      Quick Exit
    </button>
  )
}
