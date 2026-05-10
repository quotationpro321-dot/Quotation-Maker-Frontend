import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  LAST_DASHBOARD_PATH_COOKIE,
  resolveCrossRoleRedirect,
  setLastDashboardPathCookie,
} from "@/lib/dashboard-proxy";
import { ROLE_HOME_PATH, validateSession } from "@/lib/session";

const LOGIN_PATH = "/auth/login";
const REFRESH_TOKEN_COOKIE = "refreshToken";
const ACCESS_TOKEN_COOKIE = "accessToken";

const redirect = (req: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, req.url));

function clearAuthCookies(res: NextResponse) {
  res.cookies.set(ACCESS_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
  res.cookies.set(REFRESH_TOKEN_COOKIE, "", { maxAge: 0, path: "/" });
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = validateSession(req.cookies.get(REFRESH_TOKEN_COOKIE)?.value);

  if (!session) {
    const res = redirect(req, LOGIN_PATH);
    clearAuthCookies(res);
    return res;
  }

  const homePath = ROLE_HOME_PATH[session.role];

  if (!pathname.startsWith(homePath)) {
    const target = resolveCrossRoleRedirect(
      homePath,
      req.cookies.get(LAST_DASHBOARD_PATH_COOKIE)?.value,
    );
    return redirect(req, target);
  }

  const res = NextResponse.next();
  setLastDashboardPathCookie(res, pathname);
  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
