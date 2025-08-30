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

    // Build CSP dynamically: balance security with Next.js/Vercel requirements
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'", // Required for Next.js inline scripts in production
      "'unsafe-eval'", // Required for Next.js development and some production features
      'https://cdn.jsdelivr.net',
      // Vercel domains for production deployment
      isProd ? 'https://vercel.live' : null,
      isProd ? 'https://*.vercel.app' : null,
    ].filter(Boolean).join(' ');

    const connectSrc = [
      "'self'",
      // SECURITY: Explicitly allow only OpenAI API
      'https://api.openai.com',
      'https://cdn.jsdelivr.net',
      // Vercel domains for production functionality
      isProd ? 'https://vercel.live' : null,
      isProd ? 'https://*.vercel.app' : null,
      // WebSocket connections for development and Vercel live features
      'ws:',
      'wss:',
    ].filter(Boolean).join(' ');

    // SECURITY: CSP balancing security with functionality
    const baseCsp = [
      "default-src 'self' data: blob:",
      "img-src 'self' data: blob: https:",
      "style-src 'self' 'unsafe-inline'", // Bootstrap and Next.js require unsafe-inline for styles
      `script-src ${scriptSrc}`,
      `connect-src ${connectSrc}`,
      `frame-src ${isProd ? 'https://vercel.live https://*.vercel.app' : "'none'"}`, // Allow Vercel frames in production
      "object-src 'none'", // Prevent plugin execution
      "base-uri 'self'", // Prevent base tag hijacking
      "form-action 'self'", // Restrict form submissions
      "frame-ancestors 'none'", // Prevent embedding in frames
    ].join('; ');
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
          // Only apply CSP to HTML pages, not to static assets
        ],
      },
      // CSP only for HTML pages to avoid blocking static assets and API routes
      {
        source: '/((?!api/|_next/|favicon|manifest|icons/|service-worker).*)',
        headers: [
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
      // Manifest with proper caching (legacy route)
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      // Manifest with proper caching (App Router route)
      {
        source: '/manifest.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      // Fallback manifest with proper headers
      {
        source: '/manifest-fallback.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;