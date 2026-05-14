import { z } from "zod";

import { authLoginPasswordSchema } from "@/validation/auth-login.schema";

export const settingsEmailChangeConfirmSchema = z.object({
  currentPassword: authLoginPasswordSchema,
});

export type TSettingsEmailChangeConfirmValues = z.infer<
  typeof settingsEmailChangeConfirmSchema
>;
