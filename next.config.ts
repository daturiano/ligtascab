import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xlcoxbizbuasgbjzfrlx.supabase.co",
      },
    ],
  },
};

export default nextConfig;
