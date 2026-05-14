import { z } from "zod";

/** Aligns with backend reset flow (`resetFlowNewPasswordSchema`). */
export const authResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters.")
      .max(128, "Password cannot exceed 128 characters."),
    confirmPassword: z.string().trim().min(1, "Confirm password is required."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type TAuthResetPasswordValues = z.infer<typeof authResetPasswordSchema>;
