import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  webpack(config) {
    // Ensure webpack always finds modules from the project root,
    // preventing stray package.json files in parent directories from
    // redirecting module resolution to the wrong node_modules.
    config.resolve.modules = [
      path.resolve(process.cwd(), "node_modules"),
      ...(config.resolve.modules ?? []),
    ];
    return config;
  },
};

export default withNextIntl(nextConfig);
