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
    
    // Add aliases that match tsconfig.json
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '/Users/ken/Workspace/ken-guru/github-copilot-agent-assisted-next-app/src'
    };
    
    return config;
  },
  
  // Ensure proper handling of PWA assets and security
  async headers() {
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
            value: "default-src 'self' data: blob:; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; connect-src 'self' https://api.openai.com;",
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