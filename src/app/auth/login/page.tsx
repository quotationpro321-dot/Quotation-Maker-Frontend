import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardLoginForm } from "@/features/auth";
import {
  LAST_DASHBOARD_PATH_COOKIE,
  resolveCrossRoleRedirect,
} from "@/lib/dashboard-proxy";
import { ROLE_HOME_PATH, validateSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to the ALSAMA dashboard. Restricted to authorized team members.",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const session = validateSession(cookieStore.get("refreshToken")?.value);

  if (session) {
    const homePath = ROLE_HOME_PATH[session.role];
    const lastPath = cookieStore.get(LAST_DASHBOARD_PATH_COOKIE)?.value;
    redirect(resolveCrossRoleRedirect(homePath, lastPath));
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-md space-y-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-700">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
          Welcome, <span className="text-brand-secondary">Dashboard</span>
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Log in to manage Umrah bookings, package availability, team schedules, and
          pilgrim inquiries, all from one dashboard.
        </p>
      </div>

      <div className="mt-10 w-full max-w-md">
        <DashboardLoginForm />
      </div>
    </div>
  );
}
