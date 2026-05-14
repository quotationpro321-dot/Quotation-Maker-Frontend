/**
 * Same-origin path the browser calls in production. `next.config.ts` rewrites this
 * to `API_UPSTREAM_ORIGIN` so httpOnly cookies stay first-party (no browser CORS).
 */
export const PUBLIC_API_V1_BASE_PATH = "/api/v1" as const;
