"use client";

import { useMemo } from "react";

import { useOptionalSession } from "@/contexts/SessionContext";
import { useAppSelector } from "@/redux/hooks";
import type { IUser } from "@/types/user.type";

/**
 * Single hook for "who is the current user?".
 *
 * - **Session** (JWT via `SessionProvider`): stable id, email, role on every dashboard load.
 * - **Redux**: enriched by `AuthStateSync` + login (`name`, `photo`, same ids).
 *
 * `user` merges both so callers always get an `IUser` shape when authenticated.
 */
export function useUser() {
  const session = useOptionalSession();
  const reduxUser = useAppSelector((state) => state.auth.user);

  const user = useMemo((): IUser | null => {
    if (reduxUser) return reduxUser;
    if (!session) return null;
    return {
      _id: session.userId,
      email: session.email,
      role: session.role,
    };
  }, [reduxUser, session]);

  return {
    user,
    isLoggedIn: Boolean(session ?? reduxUser),
    role: session?.role ?? reduxUser?.role,
    email: session?.email ?? reduxUser?.email,
    userId: session?.userId ?? reduxUser?._id,
    name: user?.name,
    photo: user?.photo,
  };
}
