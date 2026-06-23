import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import { getCalculatorTypeState } from "@/features/quotations/calculator/lib/quotation-calculator-type-state";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { ClassicUmrahCoverPage } from "./classic-umrah-cover-page";
import { ClassicUmrahFinalPage } from "./classic-umrah-final-page";
import { ClassicUmrahFlightsPage } from "./classic-umrah-flights-page";
import { ClassicUmrahIntroPage } from "./classic-umrah-intro-page";
import { ClassicUmrahOptionCustomerNotePage } from "./classic-umrah-option-customer-note-page";
import { ClassicUmrahOptionHotelsPage } from "./classic-umrah-option-hotels-page";
import { ClassicUmrahOptionTransfersPage } from "./classic-umrah-option-transfers-page";

/**
 * Full classic Umrah document, mirroring the agency's reference PDF:
 * cover → intro → flights/baggage → [hotels + transfers] per option → payment/cancellation.
 */
export function ClassicUmrahTemplate(props: TQuotationTemplateProps) {
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
      <ClassicUmrahCoverPage />
      <ClassicUmrahIntroPage />
      <ClassicUmrahFlightsPage option={activeOption} />
      {options.map((option, index) => (
        <div key={option.id} className="contents">
          <ClassicUmrahOptionHotelsPage option={option} optionNumber={index + 1} />
          <ClassicUmrahOptionTransfersPage option={option} currency={currency} />
          <ClassicUmrahOptionCustomerNotePage
            option={option}
            optionNumber={index + 1}
          />
        </div>
      ))}
      <ClassicUmrahFinalPage
        option={activeOption}
        currency={currency}
        consultantName={consultantName}
        consultantWhatsapp={consultantWhatsapp}
        consultantDesignation={consultantDesignation}
      />
    </div>
  );
}
