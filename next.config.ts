import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // App Router is enabled by default in Next.js 15+
  // Use newer property names that are compatible with Next.js 15
  distDir: ".next",
  srcDir: "src", // Ensure this is set to recognize src directory
  
  // The proper configuration for Next.js 15.2.4
  experimental: {
    // Server Actions configuration as an object, not a boolean
    serverActions: {
      allowedOrigins: ['localhost:3000']
    },
  },
  
  // Enable more detailed error information
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Resolve paths properly
  webpack(config) {
    return config;
  },
};

export default nextConfig;
