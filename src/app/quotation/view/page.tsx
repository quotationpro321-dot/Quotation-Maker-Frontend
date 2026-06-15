import type { Metadata } from "next";

import { QuotationSharedView } from "@/features/quotations/calculator/ui/quotation-shared-view";

export const metadata: Metadata = {
  title: "Shared quotation",
  robots: { index: false, follow: false },
};

export default function QuotationSharePage() {
  return <QuotationSharedView />;
}
