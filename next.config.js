const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // App Router is enabled by default in Next.js 15+
  experimental: {
    // Add any experimental features here if needed
  },
  
  // Add path aliases that match tsconfig.json
  webpack: (config, { isServer }) => {
    // Client-side module fallbacks
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
      };
    }
    
    // Add aliases that match tsconfig.json (avoid absolute paths for security)
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    
    return config;
  },
  
  // Ensure proper handling of PWA assets and security
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    // Build CSP dynamically: relax in development to support React Refresh (unsafe-eval) and HMR (ws)
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      !isProd ? "'unsafe-eval'" : null,
      'https://cdn.jsdelivr.net',
    ].filter(Boolean).join(' ');

    const connectSrc = [
      "'self'",
      'https://api.openai.com',
      !isProd ? 'ws:' : null,
      !isProd ? 'wss:' : null,
    ].filter(Boolean).join(' ');

    const baseCsp = `default-src 'self' data: blob:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src ${scriptSrc}; connect-src ${connectSrc};`;
    return [
      // Global security headers for all routes
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: baseCsp,
          },
        ],
      },
      // Service worker specific headers
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript; charset=utf-8',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
      // Manifest with proper caching
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;