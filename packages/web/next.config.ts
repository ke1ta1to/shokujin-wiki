import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns:
      process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "https",
              hostname: "**",
            },
          ]
        : [new URL(process.env.NEXT_PUBLIC_UPLOADED_CLOUDFRONT_URL as string)],
  },
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
