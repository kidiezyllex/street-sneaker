/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    outputFileTracingRoot: process.cwd(),
    outputFileTracingExcludes: {
      '*': [
        'node_modules/**/*',
      ],
    },
  },
  webpack: (config) => {
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
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'axm-vn.shop',
      },
      {
        protocol: 'https',
        hostname: 'img6.yeshen.cc',
      },
      {
        protocol: 'https',
        hostname: 'shop.shop-worldwide-amz.top',
      },
    ],
  },
  async rewrites() {
    const domain =
      process.env.NEXT_PUBLIC_API_URL || "api.example";
    return [
      {
        source: "/api/:path*",
        destination: `https://${domain}/:path*`,
      },
    ];
  },
};

export default nextConfig;
