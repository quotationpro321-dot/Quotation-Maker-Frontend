import { PUBLIC_API_V1_BASE_PATH } from "@/config/public-api";
import type { NextConfig } from "next";

/** `API_UPSTREAM_ORIGIN` must be origin only (scheme + host, optional port). No trailing slash. */
function normalizeUpstreamOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

const nextConfig: NextConfig = {
  async rewrites() {
    const raw = process.env.API_UPSTREAM_ORIGIN?.trim();

    if (process.env.NODE_ENV === "production" && !raw) {
      throw new Error(
        "Missing API_UPSTREAM_ORIGIN: set your API server origin in .env.production or host env (e.g. https://api.example.com). Proxies /api/* to the backend.",
      );
    }

    if (!raw) {
      return [];
    }

    const origin = normalizeUpstreamOrigin(raw);

    return [
      {
        source: `${PUBLIC_API_V1_BASE_PATH}/:path*`,
        destination: `${origin}${PUBLIC_API_V1_BASE_PATH}/:path*`,
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
