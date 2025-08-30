import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins = [...config.plugins, new PrismaPlugin()];
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.AWS_CLOUDFRONT_URL}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
