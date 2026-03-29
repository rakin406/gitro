import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/v/:version(^[1-9]{1}$)/:rest*",
        destination: "/api/:rest*?version=:version",
      },
    ];
  },
};

export default nextConfig;
