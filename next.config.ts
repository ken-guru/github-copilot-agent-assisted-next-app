import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App Router is enabled by default in Next.js 15+
  // Use newer property names that are compatible with Next.js 15
  distDir: ".next",
  
  // The proper configuration for Next.js 15.2.4
  experimental: {
    // Server Actions configuration as an object, not a boolean
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
    
    // Turbopack moved out of experimental to a top-level config
  },
  
  // Turbopack configuration moved from experimental.turbo to top-level turbopack
  // as it's now stable
  turbopack: {
    // Use rules with glob patterns
    rules: {
      // Define loaders for specific file patterns
      // For example, for handling markdown files:
      '*.md': ['raw-loader'],
    },
    resolveAlias: {
      // Path aliases that match tsconfig.json configuration
      '@': '.',
      '@/contexts': './contexts',
      '@/components': './components',
      '@/hooks': './hooks',
      '@/utils': './utils',
      '@/styles': './styles'
    }
  },
  
  // Enable more detailed error information
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Resolve paths properly with source directory structure
  webpack(config) {
    // Add path aliases to webpack config to match tsconfig.json
    if (!config.resolve) {
      config.resolve = {};
    }
    
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }
    
    // Ensure aliases match tsconfig.json
    Object.assign(config.resolve.alias, {
      '@': '.',
      '@/contexts': './contexts',
      '@/components': './components',
      '@/hooks': './hooks',
      '@/utils': './utils',
      '@/styles': './styles'
    });
    
    return config;
  },
  
  // Output mode tracing for better debugging
  output: 'standalone',
  
  // Set to false if you're not using the Pages Router at all
  useFileSystemPublicRoutes: true
};

export default nextConfig;
