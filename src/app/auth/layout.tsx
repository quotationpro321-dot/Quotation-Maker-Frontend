import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s · ALSAMA Dashboard",
    default: "Authentication · ALSAMA Dashboard",
  },
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
