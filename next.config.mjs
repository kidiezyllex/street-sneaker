/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Điều chỉnh cấu hình experimental
  experimental: {
    // outputFileTracingRoot: process.cwd(),
    // outputFileTracingExcludes: {
    //   '*': [
    //     'node_modules/**/*',
    //   ],
    // },
  },
  webpack: (config, { dev, isServer }) => {
    // Bỏ qua các cảnh báo về gói phụ thuộc nền tảng cụ thể
    config.infrastructureLogging = {
      level: 'error', // Chỉ hiển thị lỗi, ẩn các cảnh báo
    };
    
    // Giữ lại cấu hình hiện có
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
