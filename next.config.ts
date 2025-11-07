import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  devIndicators: false,
  images: {
    domains: ["https://zrfywyajdtqwwjiobeys.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zrfywyajdtqwwjiobeys.supabase.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
