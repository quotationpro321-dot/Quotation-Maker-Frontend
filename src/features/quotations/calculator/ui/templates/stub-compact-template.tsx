import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { QuotationTemplateContent } from "./quotation-template-content";

export function StubCompactTemplate(props: TQuotationTemplateProps) {
  return (
    <div
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      className="mx-auto max-w-[720px] rounded! border-2 border-foreground bg-white p-4"
    >
      <QuotationTemplateContent {...props} variant="compact" />
    </div>
  );
}
