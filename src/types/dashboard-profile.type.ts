import type { UserRole } from "@/types/user.type";

/** GET/PATCH `/dashboard/profile` — matches backend dashboard profile DTO. */
export interface IDashboardProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole | string;
  profilePhotoUrl: string | null;
}

export type TUpdateDashboardProfilePayload = {
  name: string;
  email: string;
  /** Required by API when the email address is being changed. */
  currentPassword?: string;
};

export type TChangeDashboardPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
