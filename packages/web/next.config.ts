import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns:
      process.env.NODE_ENV === "development"
        ? [
            {
              protocol: "https",
              hostname: "**",
            },
          ]
        : [],
  },
  serverExternalPackages: ["@supabase/supabase-js"],
};

export default nextConfig;
