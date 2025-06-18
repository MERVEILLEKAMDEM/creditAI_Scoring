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
  webpack: (config) => {
    // Optimize webpack configuration
    config.optimization = {
      ...config.optimization,
      minimize: true,
    }

    return config
  },
}

export default nextConfig
