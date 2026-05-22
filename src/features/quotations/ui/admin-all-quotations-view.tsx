import { QuotationsListView } from "@/features/quotations/ui/quotations-list-view";

export function AdminAllQuotationsView() {
  return (
    <QuotationsListView
      scope="all"
      role="admin"
      title="All Quotations"
      subtitle="Browse and manage every quotation across your agency."
    />
  );
}
