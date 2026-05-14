import type { Metadata } from "next";
import { Suspense } from "react";

import { ResetLinkVerifyPlaceholder, ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your ALSAMA dashboard account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Suspense fallback={<ResetLinkVerifyPlaceholder variant="suspense" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
