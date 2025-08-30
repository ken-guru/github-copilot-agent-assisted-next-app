/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during CI builds to avoid blocking on warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We run type checking separately in CI
    ignoreBuildErrors: false,
  },
  experimental: {
    // Enable any experimental features if needed
  },
  // Other Next.js config options
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;