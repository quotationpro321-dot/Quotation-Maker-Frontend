/** Theme-aware logos for auth layout only. */
export const AUTH_LOGO = {
  light: "/qodest-light.png",
  dark: "/qodest-dark.png",
} as const;

/** Auth routes — single source for links between login, forgot, and reset flows. */
export const AUTH_ROUTES = {
  login: "/auth/login",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
} as const;

/** Matches backend reset-password validation (min length only on client). */
export const RESET_PASSWORD_MIN_LENGTH = 6;

/** Primary CTA on auth forms (teal, matches brand-primary-600). */
export const authPrimaryButtonClassName =
  "rounded-xs bg-brand-primary-600 text-white hover:bg-brand-primary-700 " +
  "focus-visible:ring-2 focus-visible:ring-brand-primary/55";
