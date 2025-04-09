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
    
    // Add Turbopack configuration to match webpack config
    // https://nextjs.org/docs/app/api-reference/next-config-js/turbo
    turbo: {
      // Use rules with glob patterns instead of deprecated loaders with extensions
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
  
  // Enable output mode tracing for better debugging
  output: 'standalone',
  
  // Set to false if you're not using the Pages Router at all
  useFileSystemPublicRoutes: true
};

export default nextConfig;
