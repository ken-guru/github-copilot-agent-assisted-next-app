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
  
  // Configure Turbopack with required properties for tests
  turbopack: {
    // Add rules property expected by tests
    rules: {
      // Default empty rules object
    },
    // Add resolveAlias property expected by tests
    resolveAlias: {
      // Default empty resolveAlias object
    }
  },
  
  // Image optimization configuration
  images: {
    domains: ['localhost'],
    // Configure other image options as needed
  },
  
  // Experimental features
  experimental: {
    // Server actions as an object with configuration
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins: ['localhost:3000']
    }
  }
}

module.exports = nextConfig