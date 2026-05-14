import type { NextResponse } from "next/server";

/** Remembers last in-role dashboard URL for cross-role redirect (proxy only). */
export const LAST_DASHBOARD_PATH_COOKIE = "last_dashboard_path";

/** Align with refresh-token lifetime order-of-magnitude (backend ~7d). */
const LAST_PATH_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * When a user hits another role's `/dashboard/...` path, send them back to the
 * last page they were allowed to see under their own prefix — not always home.
 *
 * `candidate` must be a pathname only (no host), under `homePath`, with no `..`.
 */
export function resolveCrossRoleRedirect(
  homePath: string,
  candidate: string | undefined,
): string {
  const raw = candidate?.trim();
  if (!raw || !raw.startsWith("/") || raw.includes("..")) {
    return homePath;
  }
  if (raw !== homePath && !raw.startsWith(`${homePath}/`)) {
    return homePath;
  }
  return raw;
}

export function setLastDashboardPathCookie(
  response: NextResponse,
  pathname: string,
): void {
  response.cookies.set(LAST_DASHBOARD_PATH_COOKIE, pathname, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: LAST_PATH_MAX_AGE,
  });
}
