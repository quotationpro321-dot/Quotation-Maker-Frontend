import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminQuotationBinView } from "@/features/quotations/ui/admin-quotation-bin-view";
import { validateSession } from "@/lib/session";

export default async function QuotationBinPage() {
  const cookieStore = await cookies();
  const session = validateSession(cookieStore.get("refreshToken")?.value);
  if (session?.role !== "admin") redirect("/dashboard/employee");

  return <AdminQuotationBinView />;
}
