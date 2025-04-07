import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true,
  },
  distDir: ".next",
  srcDir: "src",
};

export default nextConfig;
