import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import { getCalculatorTypeState } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import { isFlightSectionExported } from "@/features/quotations/calculator/lib/quotation-section-export";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { HolidaySkyguruBookingInfoPage } from "./holiday-skyguru-booking-info-page";
import { HolidaySkyguruCoverPage } from "./holiday-skyguru-cover-page";
import { HolidaySkyguruFinalPage } from "./holiday-skyguru-final-page";
import { HolidaySkyguruFlightsPage } from "./holiday-skyguru-flights-page";
import { HolidaySkyguruOptionPage } from "./holiday-skyguru-option-page";
import { HolidaySkyguruSummaryPage } from "./holiday-skyguru-summary-page";

/**
 * Full SkyGuru holiday document, mirroring the agency reference PDF:
 * cover → summary → flights/baggage → one page per option (hotel + pricing)
 * → booking terms/next steps → payment/cancellation.
 */
export function HolidaySkyguruTemplate(props: TQuotationTemplateProps) {
  const {
    draft,
    option: activeOption,
    currency,
    consultantName = "",
    consultantWhatsapp = "",
    consultantDesignation = "",
  } = props;
  const options = getCalculatorTypeState(draft).options;

  return (
    <div
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      className="mx-auto flex w-fit shrink-0 flex-col gap-0"
    >
      <HolidaySkyguruCoverPage />
      <HolidaySkyguruSummaryPage draft={draft} option={activeOption} />
      {isFlightSectionExported(activeOption) ? (
        <HolidaySkyguruFlightsPage option={activeOption} />
      ) : null}
      {options.map((option, index) => (
        <HolidaySkyguruOptionPage
          key={option.id}
          option={option}
          optionNumber={index + 1}
          currency={currency}
        />
      ))}
      <HolidaySkyguruBookingInfoPage />
      <HolidaySkyguruFinalPage
        option={activeOption}
        currency={currency}
        consultantName={consultantName}
        consultantWhatsapp={consultantWhatsapp}
        consultantDesignation={consultantDesignation}
      />
    </div>
  );
}
