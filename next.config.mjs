/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_HOST: process.env.API_HOST,
  },
  async rewrites() {
    // Static assets: proxy directly to the backend on localhost (bypass Nginx
    // and the public /api prefix), so /static/:path* matches Nest's
    // useStaticAssets("./uploads", { prefix: "/static/" }) regardless of the
    // public API_HOST prefix used for SSR fetches.
    const backendOrigin = process.env.BACKEND_ORIGIN || 'http://127.0.0.1:3000';
    return [
      { source: '/static/:path*', destination: `${backendOrigin}/static/:path*` },
    ];
  },
};

export default nextConfig;
