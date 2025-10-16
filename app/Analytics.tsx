"use client"
import Script from 'next/script'

export default function Analytics() {
  const src = process.env.NEXT_PUBLIC_UMAMI_SRC
  const siteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
  if (!src || !siteId) return null
  return (
    <Script src={src} data-website-id={siteId} strategy="afterInteractive" />
  )
}
