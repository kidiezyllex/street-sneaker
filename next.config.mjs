/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
      }
    ],
  },
  async rewrites() {
    const domain = "widofile-be.onrender.com";
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
};

export default nextConfig;
