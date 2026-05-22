import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { QuotationTemplateContent } from "./quotation-template-content";

export function StubClassicTemplate(props: TQuotationTemplateProps) {
  return (
    <div
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      className="mx-auto max-w-[800px] rounded! border border-border bg-white p-8 shadow-sm"
    >
      <QuotationTemplateContent {...props} variant="classic" />
    </div>
  );
}
