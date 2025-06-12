import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: "standalone",
  rewrites: async () => {
    return [
      {
        source: '/((?!api/).*)',
        destination: '/static-app-shell',
      },
    ];
  },
};

export default nextConfig;
