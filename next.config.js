/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Remove experimental.esmExternals - it causes module loading issues
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Handle undici private field syntax errors
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "undici": false,
        "fs": false,
        "net": false,
        "tls": false,
        "crypto": false,
        "stream": false,
        "url": false,
        "zlib": false,
        "http": false,
        "https": false,
        "assert": false,
        "os": false,
        "path": false,
      };
    }
    
    // Ignore undici in client-side builds to prevent private field syntax errors
    config.externals = config.externals || [];
    if (!isServer) {
      config.externals.push('undici');
    }
    
    return config;
  },
}

module.exports = nextConfig 