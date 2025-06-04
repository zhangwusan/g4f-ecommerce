import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'picsum.photos', 'api', 'd2c3d01lcpw2ui.cloudfront.net', 'd2c3d01lcpw2ui.cloudfront.net', 'lh3.googleusercontent.com'],
  },
  output: "standalone",
};

export default nextConfig;
