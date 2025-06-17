import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'arbfxjrrmyqpbiqbdeyz.supabase.co',
      },
    ],
  },
};

export default nextConfig;
