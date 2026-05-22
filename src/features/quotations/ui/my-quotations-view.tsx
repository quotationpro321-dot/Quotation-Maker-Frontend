"use client";

import type { UserRole } from "@/types/user.type";

import { QuotationsListView } from "@/features/quotations/ui/quotations-list-view";

type TMyQuotationsViewProps = {
  expectedRole: UserRole;
};

export function MyQuotationsView({ expectedRole }: TMyQuotationsViewProps) {
  return (
    <QuotationsListView
      scope="mine"
      role={expectedRole}
      title="My Quotations"
      subtitle="Quotations you created from the calculator, ready to review or send."
    />
  );
}
