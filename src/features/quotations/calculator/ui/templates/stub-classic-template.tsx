import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { ClassicUmrahTemplate } from "./classic-umrah/classic-umrah-template";
import { FlightsSkyguruTemplate } from "./flights-skyguru/flights-skyguru-template";
import { HolidaySkyguruTemplate } from "./holiday-skyguru/holiday-skyguru-template";
import { QuotationTemplateContent } from "./quotation-template-content";

export function StubClassicTemplate(props: TQuotationTemplateProps) {
  if (props.draft.calculatorType === "umrah") {
    return <ClassicUmrahTemplate {...props} />;
  }

  if (props.draft.calculatorType === "holiday") {
    return <HolidaySkyguruTemplate {...props} />;
  }

  if (props.draft.calculatorType === "flights") {
    return <FlightsSkyguruTemplate {...props} />;
  }

  return (
    <div
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      className="mx-auto max-w-[800px] rounded! border border-border bg-white p-8 shadow-sm"
    >
      <QuotationTemplateContent {...props} variant="classic" />
    </div>
  );
}
