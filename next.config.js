/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...existing code...
  
  // Add webpack configuration if it exists
  webpack: (config, { isServer }) => {
    // ...existing webpack configuration...
    
    return config;
  },
  
  // Add corresponding turbopack configuration
  turbopack: {
    // Match the structure expected by the tests
    rules: {
      // Add necessary rules
    },
    resolveAlias: {
      // Add aliases that match webpack configuration
    },
    loaders: {
      '*.svg': {
        // SVG loader configuration
      }
    }
  },
  
  // ...existing code...
};

module.exports = nextConfig;