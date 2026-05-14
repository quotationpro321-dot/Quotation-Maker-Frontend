"use client";

import { startTransition } from "react";

import { clearCachedProfile } from "@/lib/auth-profile-storage";
import { authApi } from "@/redux/api/auth.api";
import { clearUser } from "@/redux/features/authSlice";
import type { AppDispatch } from "@/redux/store";
import type { IUser } from "@/types/user.type";

/**
 * Clears auth cookies via logout API (best-effort), then wipes client auth state
 * and navigates to login. Shared by header logout and post–email-change re-auth.
 */
export async function signOutAndRedirectToLogin(params: {
  dispatch: AppDispatch;
  navigateReplace: (href: string) => void;
  user: IUser | null;
  performLogoutRequest: () => Promise<unknown>;
}): Promise<void> {
  try {
    await params.performLogoutRequest();
  } catch {
    /* still clear local session */
  }
  const u = params.user;
  if (u?._id) clearCachedProfile(u._id);
  if (u?.accountCode && u.accountCode !== u._id) {
    clearCachedProfile(u.accountCode);
  }
  params.dispatch(clearUser());
  params.dispatch(authApi.util.resetApiState());
  startTransition(() => params.navigateReplace("/auth/login"));
}
