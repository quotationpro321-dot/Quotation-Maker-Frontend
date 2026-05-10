"use client";

import { useLayoutEffect } from "react";

import { useSession } from "@/contexts/SessionContext";
import { loadCachedProfile } from "@/lib/auth-profile-storage";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { UserRole } from "@/types/user.type";

/**
 * After a full reload Redux is empty, but the server session (JWT) is not.
 * Re-hydrate the auth slice from session + the local profile cache written on
 * login so name/photo stay available without an extra API round-trip.
 */
export function AuthStateSync() {
  const session = useSession();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector((state) => state.auth.user);

  useLayoutEffect(() => {
    const cached = loadCachedProfile(session.userId);
    const sameUser = reduxUser?._id === session.userId;
    const next = {
      _id: session.userId,
      email: session.email,
      role: session.role as UserRole,
      name: sameUser ? reduxUser?.name ?? cached?.name : cached?.name,
      photo: sameUser ? reduxUser?.photo ?? cached?.photo : cached?.photo,
    };

    if (
      reduxUser &&
      reduxUser._id === next._id &&
      reduxUser.email === next.email &&
      reduxUser.role === next.role &&
      reduxUser.name === next.name &&
      reduxUser.photo === next.photo
    ) {
      return;
    }

    dispatch(setUser(next));
  }, [dispatch, session.userId, session.email, session.role, reduxUser]);

  return null;
}
