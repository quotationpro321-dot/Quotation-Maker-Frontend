import type { UserRole } from "@/types/user.type";

/** GET/PATCH `/dashboard/profile` — matches backend dashboard profile DTO. */
export interface IDashboardProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole | string;
  /** Optional WhatsApp contact rendered on the user's quotation PDFs. */
  whatsappNumber: string | null;
  /** Job title shown under the consultant name on quotation PDFs. */
  consultantDesignation: string | null;
  profilePhotoUrl: string | null;
}

export type TUpdateDashboardProfilePayload = {
  name: string;
  email: string;
  /** Omit to keep current; send "" to clear. */
  whatsappNumber?: string;
  consultantDesignation?: string;
  /** Required by API when the email address is being changed. */
  currentPassword?: string;
};

export type TChangeDashboardPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};
