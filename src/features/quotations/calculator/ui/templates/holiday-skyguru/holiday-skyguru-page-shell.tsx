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

import { HolidaySkyguruPageHeader } from "./holiday-skyguru-page-header";

type THolidaySkyguruPageShellProps = {
  children: React.ReactNode;
  /** Final page renders its own contact footer instead of the slim strip. */
  hideFooterStrip?: boolean;
};

/** A4 page chrome shared by every SkyGuru holiday content page (pages 2+). */
export function HolidaySkyguruPageShell({
  children,
  hideFooterStrip = false,
}: THolidaySkyguruPageShellProps) {
  return (
    <section
      {...{ [EXPORT_PAGE_ATTR]: "" }}
      className="relative flex shrink-0 flex-col overflow-hidden bg-white text-slate-900 shadow-sm"
      style={{ width: QUOTATION_A4_WIDTH_PX, height: QUOTATION_A4_HEIGHT_PX }}
    >
      <HolidaySkyguruPageHeader marginPx={HOLIDAY_PAGE_MARGIN_PX} />

      <div
        className="flex min-h-0 flex-1 flex-col pt-6"
        style={{
          paddingLeft: HOLIDAY_PAGE_MARGIN_PX,
          paddingRight: HOLIDAY_PAGE_MARGIN_PX,
        }}
      >
        {children}
      </div>

      {hideFooterStrip ? null : (
        <div
          className="flex items-center justify-center py-2.5 text-[11px] font-semibold tracking-wide text-white"
          style={{ backgroundColor: HOLIDAY_PDF_BLUE }}
        >
          {SKYGURU_CONTACT.website}
        </div>
      )}
    </section>
  );
}
