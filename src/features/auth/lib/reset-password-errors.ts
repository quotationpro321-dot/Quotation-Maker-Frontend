function extractApiPayloadMessage(data: unknown): string {
  if (typeof data === "string") return data;
  if (typeof data === "object" && data !== null && "message" in data) {
    const m = (data as { message?: unknown }).message;
    if (typeof m === "string") return m;
    if (Array.isArray(m) && typeof m[0] === "string") return m.join(" ");
  }
  return "";
}

/**
 * Maps POST /auth/reset-password failures to the same UX as an expired link.
 */
export function isPasswordResetTokenExpiredLikeError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;

  const e = error as { status?: number; data?: unknown };
  const status = e.status;
  if (status === 401 || status === 403 || status === 410) return true;

  const msg = extractApiPayloadMessage(e.data).toLowerCase();
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
