/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.infrastructureLogging = {
      level: 'error',
    };
    
    config.module.rules.push({
      test: /flag-icons.*\.css$/,
      type: "asset/resource",
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      }
    ],
  },
  async rewrites() {
    const domain = "http://localhost:5000";
    return [
      {
        source: "/api/:path*",
        destination: `https://${domain}/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `https://${domain}/auth/:path*`,
      }
    ];
  },
  staticPageGenerationTimeout: 120,
  experimental: {
    instrumentationHook: true,
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
