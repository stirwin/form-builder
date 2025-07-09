import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

/** @type {import('next').NextConfig} */
const nextConfig = {
  future: { webpack5: true },
  // Si usas App Router, descomenta:
  // experimental: { appDir: true },
};

if (process.env.NODE_ENV === "development") {
  setupDevPlatform();
}

export default nextConfig;
