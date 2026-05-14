import { z } from "zod";

export const settingsProfileIdentitySchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
  email: z.string().trim().email("Invalid email address.").max(100, "Email is too long."),
});

export type TSettingsProfileIdentityValues = z.infer<typeof settingsProfileIdentitySchema>;
