/** Auth feature — dashboard login, forgot password, reset password, session sync. */

export { AUTH_ROUTES, RESET_PASSWORD_MIN_LENGTH, authPrimaryButtonClassName } from "./constants";
export { extractApiErrorMessage } from "./lib/extract-api-error-message";
export { isPasswordResetTokenExpiredLikeError } from "./lib/reset-password-errors";

export { AuthSplitLayout } from "./ui/auth-split-layout";
export { AuthHero } from "./ui/auth-hero";
export { AuthBrand } from "./ui/auth-brand";
export { DashboardLoginForm } from "./ui/login-form";
export { ForgotPasswordForm } from "./ui/forgot-password-form";
export { ResetPasswordForm } from "./ui/reset-password-form";
export { ResetTokenExpiredCard } from "./ui/reset-token-expired-card";
export { ResetLinkVerifyPlaceholder } from "./ui/reset-link-verify-placeholder";
export { AuthStateSync } from "./ui/auth-state-sync";

/** @deprecated Use `DashboardLoginForm` — alias kept for gradual migration. */
export { DashboardLoginForm as AdminLoginForm } from "./ui/login-form";
