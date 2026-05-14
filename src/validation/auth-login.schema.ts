import { z } from "zod";

const loginPassword = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
  .regex(/[!@#$%^&*]/, "Password must contain at least 1 special character (!@#$%^&*).")
  .regex(/\d/, "Password must contain at least 1 number.");

/** Same rules as login password — reuse for email-change confirmation, etc. */
export const authLoginPasswordSchema = loginPassword;

export const authLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(5, "Email must be at least 5 characters long.")
    .max(100, "Email cannot exceed 100 characters.")
    .email("Invalid email address format."),
  password: loginPassword,
});

export type TAuthLoginValues = z.infer<typeof authLoginSchema>;
