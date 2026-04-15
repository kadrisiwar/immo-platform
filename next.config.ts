import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.227.47", "localhost", "*.ngrok.io"],
  images: {
    domains: ["localhost", "192.168.227.47"],
  },
};

export default nextConfig;
