import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'picsum.photos', 'api'],
  },
  output: "standalone",
};

export default nextConfig;
