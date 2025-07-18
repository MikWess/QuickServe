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
  experimental: {
    // Disable experimental features that cause issues
    esmExternals: false,
  },
  webpack: (config, { isServer, webpack }) => {
    // Enhanced handling for undici and Node.js modules
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
        "buffer": false,
        "util": false,
        "events": false,
        "querystring": false,
      };

      // More comprehensive external exclusions
      config.externals = config.externals || [];
      config.externals.push({
        'undici': 'undici',
        'firebase-admin': 'firebase-admin',
        'firebase-functions': 'firebase-functions',
      });
    }

    // Add webpack plugins for better module handling
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      })
    );

    // Enhanced module resolution for Firebase
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };

    // Ignore specific modules that cause issues
    config.ignoreWarnings = [
      { module: /node_modules\/undici/ },
      { module: /node_modules\/firebase/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
}

module.exports = nextConfig 