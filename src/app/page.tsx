import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  LAST_DASHBOARD_PATH_COOKIE,
  resolveCrossRoleRedirect,
} from "@/lib/dashboard-proxy";
import { ROLE_HOME_PATH, validateSession } from "@/lib/session";

export default async function Home() {
  const cookieStore = await cookies();
  const session = validateSession(cookieStore.get("refreshToken")?.value);

  if (session) {
    const homePath = ROLE_HOME_PATH[session.role];
    const lastPath = cookieStore.get(LAST_DASHBOARD_PATH_COOKIE)?.value;
    redirect(resolveCrossRoleRedirect(homePath, lastPath));
  }

  redirect("/auth/login");
}
