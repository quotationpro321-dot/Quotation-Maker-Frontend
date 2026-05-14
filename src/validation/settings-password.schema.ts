import { z } from "zod";

/** Matches dashboard / auth strong password rules. */
const dashboardNewPassword = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
  .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*).")
  .regex(/\d/, "Password must contain at least 1 number.");

export const settingsChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: dashboardNewPassword,
    confirmPassword: z.string().min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type TSettingsChangePasswordValues = z.infer<typeof settingsChangePasswordSchema>;
