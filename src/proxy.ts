import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

const LOGIN_PATH = "/auth/login";

/**
 * Single source of truth for role-based dashboard access.
 * Each role is mapped to the path prefix it is allowed to enter.
 * Add a new entry here to grant a role its own dashboard area.
 */
const ROLE_HOME_PATH = {
  admin: "/dashboard/admin",
  employee: "/dashboard/employee",
} as const;

type AuthorizedRole = keyof typeof ROLE_HOME_PATH;

const isAuthorizedRole = (role: string): role is AuthorizedRole =>
  role in ROLE_HOME_PATH;

const isExpired = ({ exp }: DecodedToken): boolean =>
  typeof exp === "number" && exp * 1000 <= Date.now();

const safeDecode = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

const redirectTo = (req: NextRequest, path: string) =>
  NextResponse.redirect(new URL(path, req.url));

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return redirectTo(req, LOGIN_PATH);
  }

  const decoded = safeDecode(accessToken);

  if (!decoded || isExpired(decoded) || !isAuthorizedRole(decoded.role)) {
    return redirectTo(req, LOGIN_PATH);
  }

  const homePath = ROLE_HOME_PATH[decoded.role];

  // Authenticated, but trying to enter another role's area — bounce to their own.
  if (!pathname.startsWith(homePath)) {
    return redirectTo(req, homePath);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
