/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  // Ensure Next uses the workspace root instead of inferring a parent lockfile
  outputFileTracingRoot: path.resolve(__dirname),
  images: {
    domains: ['localhost'],
  },
  async headers() {
    const isDev = process.env.NODE_ENV !== 'production'
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001'
    const scriptSrc = ["'self'", "'unsafe-inline'"].concat(isDev ? ["'unsafe-eval'"] : [])
    const styleSrc = ["'self'", "'unsafe-inline'", 'blob:']
    const connectSrc = (() => {
      const base = ["'self'", 'https:', backendUrl, 'ws:', 'wss:']
      if (isDev) {
        base.push(
          'http://localhost:3001',
          'http://localhost:4001',
          'http://localhost:8001',
          'http://localhost:8008',
          'http://localhost:8080',
          'http://localhost:3002',
          'http://localhost:3003',
          'http://localhost:3004',
        )
      }
      return base
    })()
    const csp = [
      "default-src 'self'",
      `script-src ${scriptSrc.join(' ')}`,
      `style-src ${styleSrc.join(' ')}`,
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      `connect-src ${connectSrc.join(' ')}`,
      "worker-src 'self' blob:",
      "child-src blob:",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // Relax COEP in development to avoid breaking HMR and third-party tooling
          { key: 'Cross-Origin-Embedder-Policy', value: isDev ? 'unsafe-none' : 'require-corp' },
          { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
          { key: 'X-Download-Options', value: 'noopen' },
          { key: 'X-XSS-Protection', value: '0' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;