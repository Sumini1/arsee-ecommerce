// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
  devIndicators: false,
  images: {
    // Pakai remotePatterns saja (domains boleh dihapus)
    remotePatterns: [
      // project A (yang muncul di error)
      {
        protocol: "https",
        hostname: "dfdltvnqprshzfybxnfs.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "dfdltvnqprshzfybxnfs.storage.supabase.co",
        pathname: "/**",
      },

      // project B (yang kamu tulis di config)
      {
        protocol: "https",
        hostname: "zrfywyajdtqwwjiobeys.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "zrfywyajdtqwwjiobeys.storage.supabase.co",
        pathname: "/**",
      },
    ],

    // (Opsional) Kalau tetap ingin "domains", format yang benar:
    // domains: [
    //   "dfdltvnqprshzfybxnfs.supabase.co",
    //   "dfdltvnqprshzfybxnfs.storage.supabase.co",
    //   "zrfywyajdtqwwjiobeys.supabase.co",
    //   "zrfywyajdtqwwjiobeys.storage.supabase.co",
    // ],
  },
};

export default nextConfig;
