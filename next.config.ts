import type { NextConfig } from "next";

const isServerDeploy =
  process.env.SERVER_DEPLOY === "1" || process.env.VERCEL_DEPLOY === "1";

const nextConfig: NextConfig = {
  output: isServerDeploy ? "standalone" : "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
