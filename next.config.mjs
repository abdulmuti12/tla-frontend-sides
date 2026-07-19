/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_HOST: process.env.API_HOST,
  },
  async rewrites() {
    const apiHost = process.env.API_HOST || 'http://localhost:3000';
    return [
      { source: '/static/:path*', destination: `${apiHost}/static/:path*` },
    ];
  },
};

export default nextConfig;
