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
}

module.exports = nextConfig 