/**
 * Client-side helpers for reset-password links. Signature is not verified here;
 * the backend remains authoritative. JWT `exp` is used only for early UX.
 */

function decodeJwtPayload(segment: string): Record<string, unknown> | null {
  try {
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const json = atob(padded);
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** Returns expiry time in ms from JWT payload, or null if not a JWT / no exp. */
export function getJwtExpiryMsFromResetCode(code: string): number | null {
  const parts = code.trim().split(".");
  if (parts.length !== 3) return null;
  const payload = decodeJwtPayload(parts[1] ?? "");
  if (!payload) return null;
  const exp = payload.exp;
  if (typeof exp !== "number") return null;
  return exp * 1000;
}

export function isResetCodeJwtExpiredOnClient(code: string): boolean {
  const expMs = getJwtExpiryMsFromResetCode(code);
  if (expMs === null) return false;
  return Date.now() >= expMs;
}

function extractApiMessage(data: unknown): string {
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m) && typeof m[0] === "string") return m.join(" ");
  }
  return "";
}

/**
 * Maps common API failures to the same "token expired" screen as invalid links.
 */
export function isPasswordResetTokenExpiredLikeError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const e = error as { status?: number; data?: unknown };
  const status = e.status;
  if (status === 401 || status === 403 || status === 410) return true;

  const msg = extractApiMessage(e.data).toLowerCase();
  if (!msg) return false;

  const invalidReset =
    (msg.includes("invalid") || msg.includes("bad")) &&
    (msg.includes("code") ||
      msg.includes("link") ||
      msg.includes("token") ||
      msg.includes("reset"));

  return (
    msg.includes("expired") ||
    msg.includes("invalid token") ||
    msg.includes("invalid link") ||
    msg.includes("invalid or expired") ||
    msg.includes("token expired") ||
    msg.includes("link expired") ||
    invalidReset ||
    (msg.includes("invalid") && msg.includes("token"))
  );
}

export function shouldShowResetTokenExpiredImmediately(code: string): boolean {
  const trimmed = code.trim();
  if (!trimmed) return true;
  return isResetCodeJwtExpiredOnClient(trimmed);
}
