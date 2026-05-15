import { z } from "zod";

import { authLoginSchema } from "@/validation/auth-login.schema";

const userRoleSchema = z.enum(["admin", "employee"]);
const userStatusSchema = z.enum(["active", "inactive", "blocked", "banned"]);

export const adminUserFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required." })
    .max(120, { message: "Name is too long." }),
  email: z.string().trim().email({ message: "Invalid email address." }).max(100),
  role: userRoleSchema,
  status: userStatusSchema,
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
});

export const adminUserCreateSchema = adminUserFormSchema
  .extend({
    password: authLoginSchema.shape.password,
    confirmPassword: z.string().trim().min(1, { message: "Confirm password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const adminUserUpdateSchema = adminUserFormSchema
  .extend({
    password: authLoginSchema.shape.password.optional().or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => !data.password || data.password.length >= 8,
    { message: "Password must be at least 8 characters.", path: ["password"] },
  )
  .refine(
    (data) => {
      const password = data.password?.trim() ?? "";
      if (!password) return true;
      return (data.confirmPassword?.trim() ?? "").length > 0;
    },
    { message: "Confirm password is required.", path: ["confirmPassword"] },
  )
  .refine(
    (data) => {
      const password = data.password?.trim() ?? "";
      if (!password) return true;
      return password === (data.confirmPassword?.trim() ?? "");
    },
    { message: "Passwords do not match.", path: ["confirmPassword"] },
  );

export type TAdminUserFormValues = z.infer<typeof adminUserFormSchema>;
export type TAdminUserCreateValues = z.infer<typeof adminUserCreateSchema>;
export type TAdminUserUpdateValues = z.infer<typeof adminUserUpdateSchema>;
