import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In Next.js 15+, this is not needed but let's make it explicit
  experimental: {
    appDir: true,
  },
  // Correct output directory
  distDir: ".next",
  // Properly recognize the src directory structure
  srcDir: "src",
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
