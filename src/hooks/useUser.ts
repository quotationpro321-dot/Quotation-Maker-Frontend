"use client";

import { useAppSelector } from "@/redux/hooks";

export function useUser() {
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);

  return {
    user,
    isLoggedIn,
    role: user?.role,
    email: user?.email,
    userId: user?._id,
  };
}
