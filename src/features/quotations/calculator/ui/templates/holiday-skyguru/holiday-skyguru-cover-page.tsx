import {
  EXPORT_COVER_PAGE_ATTR,
  EXPORT_PAGE_ATTR,
} from "@/features/quotations/calculator/lib/export-quotation";
import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";
import { HOLIDAY_SKYGURU_ASSETS } from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";

export function HolidaySkyguruCoverPage() {
  return (
    <section
      {...{ [EXPORT_PAGE_ATTR]: "", [EXPORT_COVER_PAGE_ATTR]: "" }}
      className="relative m-0 shrink-0 overflow-hidden bg-black p-0"
      style={{
        width: QUOTATION_A4_WIDTH_PX,
        height: QUOTATION_A4_HEIGHT_PX,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HOLIDAY_SKYGURU_ASSETS.coverPage}
        alt="SkyGuru Holiday Quotation cover"
        width={QUOTATION_A4_WIDTH_PX}
        height={QUOTATION_A4_HEIGHT_PX}
        className="absolute inset-0 block size-full object-cover object-center"
        draggable={false}
      />
    </section>
  );
}
