import { z } from "zod";

export const authForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Email must be at least 5 characters long.")
    .max(100, "Email cannot exceed 100 characters.")
    .email("Invalid email address format."),
});

export type TAuthForgotPasswordValues = z.infer<typeof authForgotPasswordSchema>;
