import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i3.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
