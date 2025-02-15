/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://13.203.97.104:8000/:path*',
      },
    ];
  },
}

module.exports = nextConfig
