import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import { getCalculatorTypeState } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import { isFlightSectionExported } from "@/features/quotations/calculator/lib/quotation-section-export";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { FlightsSkyguruOptionPage } from "./flights-skyguru-option-page";

/**
 * SkyGuru flight document — one A4 page per enabled option:
 * greeting (first page) → route + itinerary → baggage → price → disclaimer (last page).
 */
export function FlightsSkyguruTemplate({
  draft,
  currency,
}: TQuotationTemplateProps) {
  const calculatorOptions = getCalculatorTypeState(draft).options;
  const exportedOptions = calculatorOptions.filter(isFlightSectionExported);
  const pages =
    exportedOptions.length > 0
      ? exportedOptions
      : calculatorOptions.slice(0, 1);
  const lastIndex = pages.length - 1;

  return (
    <div
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      className="mx-auto flex w-fit shrink-0 flex-col gap-0"
    >
      {pages.map((option, index) => (
        <FlightsSkyguruOptionPage
          key={option.id}
          draft={draft}
          option={option}
          currency={currency}
          showGreeting={index === 0}
          showDisclaimer={index === lastIndex}
        />
      ))}
    </div>
  );
}
