import type { Metadata } from "next";

import { AuthSplitLayout } from "@/features/auth";

export const metadata: Metadata = {
  title: {
    template: "%s · ALSAMA Dashboard",
    default: "Authentication · ALSAMA Dashboard",
  },
  robots: { index: false, follow: false },
};

/**
 * Shared chrome for every auth route: header (logo + theme), main slot, footer, hero panel.
 * Child pages only render route-specific content inside the main column.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
