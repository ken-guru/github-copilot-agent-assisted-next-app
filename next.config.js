/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Transpile specific packages if needed
  transpilePackages: [],
  
  // Enable React strict mode for better development practices
  reactStrictMode: true,
  
  // Configure output handling
  output: 'standalone',
  
  // Configure Turbopack
  // Empty turbopack object with no invalid properties
  turbopack: {},
  
  // Image optimization configuration
  images: {
    domains: ['localhost'],
    // Configure other image options as needed
  },
  
  // Experimental features
  experimental: {
    // Fix: serverActions should be an object, not a boolean
    serverActions: {
      // Add server actions configuration options
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000']
    }
  }
}

module.exports = nextConfig