"use client";

import { createContext, useContext, type ReactNode } from "react";

import type { Session } from "@/lib/session";

/**
 * Per-request, server-derived session for dashboard routes.
 *
 * The dashboard layout (Server Component) decodes the refresh-token cookie on
 * every request and passes the resulting session here. The value is therefore:
 *  - synchronously available to every dashboard child (no flash, no useEffect),
 *  - never a module-level singleton (no SSR cross-request pollution),
 *  - aligned with the proxy + backend, which both treat the JWT as truth.
 *
 * Redux is intentionally NOT used for this. It stays for richer client-side
 * user fields (name, photo) populated by the login response, plus other slices.
 */
const SessionContext = createContext<Session | null>(null);

export function SessionProvider({
  session,
  children,
}: {
  session: Session;
  children: ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}

/** Read the session inside dashboard routes (guaranteed non-null there). */
export function useSession(): Session {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error(
      "useSession must be used inside <SessionProvider> (dashboard routes only).",
    );
  }
  return ctx;
}

/** Read the session anywhere; returns null outside dashboard routes. */
export function useOptionalSession(): Session | null {
  return useContext(SessionContext);
}
