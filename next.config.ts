import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // ✅ بدون wildcard
      },
      {
        protocol: 'https',
        hostname: 'dawid-food-ordering.s3.amazonaws.com',
      },
    ],
  },
  
};

export default nextConfig;
