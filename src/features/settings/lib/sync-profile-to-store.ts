import { persistCachedProfile } from "@/lib/auth-profile-storage";
import { dashboardApi } from "@/redux/api/dashboard.api";
import { setUser } from "@/redux/features/authSlice";
import type { AppDispatch } from "@/redux/store";
import type { IDashboardProfile } from "@/types/dashboard-profile.type";

import { toUserRole } from "@/features/settings/lib/settings-profile-helpers";

/** Keeps Redux auth user and RTK `getMyProfile` cache aligned with server profile. */
export function syncProfileToStore(
  dispatch: AppDispatch,
  profile: IDashboardProfile,
) {
  const photo = profile.profilePhotoUrl?.trim() || undefined;

  dispatch(
    setUser({
      _id: profile._id,
      email: profile.email,
      role: toUserRole(String(profile.role)),
      name: profile.name,
      photo,
      accountCode: profile.userId,
    }),
  );

  // `AuthStateSync` rehydrates name/photo from this cache after a full reload (Redux is empty).
  // JWT `session.userId` may match either Mongo `_id` or business `userId` — persist under both when they differ.
  const cachePayload = {
    name: profile.name?.trim() || undefined,
    photo,
  };
  persistCachedProfile(profile._id, cachePayload);
  if (profile.userId && profile.userId !== profile._id) {
    persistCachedProfile(profile.userId, cachePayload);
  }
  dispatch(
    dashboardApi.util.updateQueryData("getMyProfile", undefined, (entry) => {
      if (entry?.data) {
        entry.data = { ...entry.data, ...profile };
      }
    }),
  );
}
