import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // R2 public bucket domain for serving PDFs / images.
  // Set NEXT_PUBLIC_R2_PUBLIC_HOST in your env, e.g. pub-xxxx.r2.dev
  images: {
    remotePatterns: process.env.NEXT_PUBLIC_R2_PUBLIC_HOST
      ? [
          {
            protocol: "https",
            hostname: process.env.NEXT_PUBLIC_R2_PUBLIC_HOST,
          },
        ]
      : [],
  },
};

export default nextConfig;
