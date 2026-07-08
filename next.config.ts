import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — a stray package-lock.json sits in the parent folder.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
