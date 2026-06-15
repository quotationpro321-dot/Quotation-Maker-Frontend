import { EXPORT_PAGE_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";
import {
  HOLIDAY_PAGE_MARGIN_PX,
  HOLIDAY_PDF_BLUE,
  SKYGURU_CONTACT,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";

import { FlightsSkyguruPageHeader } from "./flights-skyguru-page-header";

type TFlightsSkyguruPageShellProps = {
  children: React.ReactNode;
};

/** A4 page chrome shared by every SkyGuru flight quotation page. */
export function FlightsSkyguruPageShell({ children }: TFlightsSkyguruPageShellProps) {
  return (
    <section
      {...{ [EXPORT_PAGE_ATTR]: "" }}
      className="relative flex shrink-0 flex-col overflow-hidden bg-white text-slate-900 shadow-sm"
      style={{ width: QUOTATION_A4_WIDTH_PX, height: QUOTATION_A4_HEIGHT_PX }}
    >
      <FlightsSkyguruPageHeader marginPx={HOLIDAY_PAGE_MARGIN_PX} />

      <div
        className="flex min-h-0 flex-1 flex-col pt-6"
        style={{
          paddingLeft: HOLIDAY_PAGE_MARGIN_PX,
          paddingRight: HOLIDAY_PAGE_MARGIN_PX,
        }}
      >
        {children}
      </div>

      <div
        className="flex items-center justify-center py-2.5 text-[11px] font-semibold tracking-wide text-white"
        style={{ backgroundColor: HOLIDAY_PDF_BLUE }}
      >
        {SKYGURU_CONTACT.website}
      </div>
    </section>
  );
}
