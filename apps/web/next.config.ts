import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@repo/utils',
    '@repo/shared',
    '@repo/types',
    '@repo/database',
  ],
};

export default nextConfig;
