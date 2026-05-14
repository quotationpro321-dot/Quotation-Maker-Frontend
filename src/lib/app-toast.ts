import { toast } from "sonner";

const DEFAULT_DURATION = 4800;

/** Shared copy + duration for account feedback (Sonner). */
export const appToast = {
  loginFailed: (message: string) =>
    toast.error("Sign-in failed", {
      description: message,
      duration: DEFAULT_DURATION,
    }),

  passwordResetComplete: () =>
    toast.success("Password reset", {
      description: "You can now sign in with your new password.",
      duration: DEFAULT_DURATION,
    }),
};
