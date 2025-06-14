/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-*', 'lucide-react'],
  },
  webpack: (config, { isServer }) => {
    // Optimize webpack configuration
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }
    return config
  },
  allowedDevOrigins: [
    '172.17.3.193', // Current dev origin from logs
    'localhost',
    '127.0.0.1'
  ],
}

export default nextConfig
