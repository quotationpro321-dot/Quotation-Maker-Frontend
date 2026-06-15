import { EXPORT_PAGE_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import { UMRAH_PDF_TEAL } from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";
import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

import { ClassicUmrahPageHeader } from "./classic-umrah-page-header";

export const CLASSIC_UMRAH_PAGE_MARGIN_PX = 56;
const PAGE_MARGIN_PX = CLASSIC_UMRAH_PAGE_MARGIN_PX;

type TClassicUmrahPageShellProps = {
  children: React.ReactNode;
  /** Final page renders its own teal footer band. */
  hideFooterStrip?: boolean;
};

/** A4 page chrome shared by every classic Umrah content page (pages 3+). */
export function ClassicUmrahPageShell({
  children,
  hideFooterStrip = false,
}: TClassicUmrahPageShellProps) {
  return (
    <section
      {...{ [EXPORT_PAGE_ATTR]: "" }}
      className="relative flex shrink-0 flex-col overflow-hidden bg-white text-slate-900 shadow-sm"
      style={{ width: QUOTATION_A4_WIDTH_PX, height: QUOTATION_A4_HEIGHT_PX }}
    >
      <ClassicUmrahPageHeader marginPx={PAGE_MARGIN_PX} />

      <div
        className="flex min-h-0 flex-1 flex-col"
        style={{ paddingLeft: PAGE_MARGIN_PX, paddingRight: PAGE_MARGIN_PX }}
      >
        {children}
      </div>

      {hideFooterStrip ? null : (
        <div
          className="absolute inset-x-0 bottom-0 h-2.5"
          style={{ backgroundColor: UMRAH_PDF_TEAL }}
        />
      )}
    </section>
  );
}
