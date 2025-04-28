/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Explicitly set the directory for the App Router
  experimental: {
    appDir: true
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
  
  // Ensure proper handling of PWA assets
  async headers() {
    return [
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
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