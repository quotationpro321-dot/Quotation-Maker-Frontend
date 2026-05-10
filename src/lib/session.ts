import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

/**
 * Single source of truth for role-based dashboard access.
 * Each role is mapped to the path prefix it is allowed to enter.
 * Add a new entry here to grant a role its own dashboard area.
 */
export const ROLE_HOME_PATH = {
  admin: "/dashboard/admin",
  employee: "/dashboard/employee",
} as const;

export type AuthorizedRole = keyof typeof ROLE_HOME_PATH;

export interface Session {
  userId: string;
  email: string;
  role: AuthorizedRole;
}

const isAuthorizedRole = (role: string): role is AuthorizedRole =>
  role in ROLE_HOME_PATH;

const isExpired = ({ exp }: DecodedToken): boolean =>
  typeof exp === "number" && exp * 1000 < Date.now();

const safeDecode = (token: string | undefined): DecodedToken | null => {
  if (!token) return null;
  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    return null;
  }
};

/**
 * Decodes the JWT string from the **request’s** `refreshToken` cookie (server/RSC
 * only). The browser never sees httpOnly cookies in JS — this is not client storage.
 * Tokens are issued/cleared only by the backend (`setAuthCookie` / `clearAuthCookies`).
 */
export function validateSession(
  refreshToken: string | undefined,
): Session | null {
  const decoded = safeDecode(refreshToken);
  if (!decoded || isExpired(decoded) || !isAuthorizedRole(decoded.role)) {
    return null;
  }
  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };
}
