import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile devices on the local network to safely connect in dev mode
  allowedDevOrigins: [
    "192.168.1.5",
    "192.168.1.*",
    "192.168.0.*"
  ],
};

export default nextConfig;
