/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
  // Add this section to handle the deprecation warning
  webpack: (config, { isServer }) => {
    // This will filter out the warning from the console output
    config.ignoreWarnings = [
      { module: /node_modules/ },
      { message: /DEP0060/ }
    ];
    return config;
  },
}

module.exports = nextConfig
