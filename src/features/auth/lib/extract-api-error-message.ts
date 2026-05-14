/**
 * Normalizes RTK Query / axios-style errors into a user-visible string.
 */
export function extractApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback;

  const errorObj = error as {
    data?: { message?: string } | string;
    message?: string;
  };

  if (typeof errorObj.data === "string") return errorObj.data;
  if (errorObj.data && typeof errorObj.data.message === "string") {
    return errorObj.data.message;
  }
  if (typeof errorObj.message === "string") return errorObj.message;

  return fallback;
}
