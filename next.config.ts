import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer({});

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xlcoxbizbuasgbjzfrlx.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@/components/ui"],
  },
};

export default nextConfig;
