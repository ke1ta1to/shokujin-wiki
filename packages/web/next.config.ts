import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns:
      process.env.NODE_ENV === "development"
        ? [{ protocol: "https", hostname: "**" }]
        : [
            {
              protocol: "https",
              hostname: process.env
                .NEXT_PUBLIC_UPLOADED_CLOUDFRONT_DOMAIN as string,
            },
          ],
  },
};

export default nextConfig;
