import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Allow larger body sizes for file uploads (10MB)
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
