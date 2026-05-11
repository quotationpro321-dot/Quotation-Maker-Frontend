const storageKey = (userId: string) => `auth_profile:${userId}`;

export type CachedAuthProfile = {
  name?: string;
  photo?: string;
};

export function loadCachedProfile(userId: string): CachedAuthProfile | null {
  if (typeof window === "undefined" || !userId) return null;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedAuthProfile;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function persistCachedProfile(
  userId: string,
  profile: CachedAuthProfile,
): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(profile));
  } catch {
    /* quota / private mode */
  }
}

export function clearCachedProfile(userId: string): void {
  if (typeof window === "undefined" || !userId) return;
  try {
    localStorage.removeItem(storageKey(userId));
  } catch {
    /* ignore */
  }
}
