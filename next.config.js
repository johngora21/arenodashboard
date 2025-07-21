/** @type {import('next').NextConfig} */
const nextConfig = {
  // appDir is now the default in Next.js 13+
  webpack: (config, { isServer }) => {
    // Handle dynamic imports better
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }
    
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    
    return config
  },
}

module.exports = nextConfig 