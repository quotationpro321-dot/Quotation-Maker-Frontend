import Image from "next/image";

import { EXPORT_PAGE_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
  UMRAH_QUOTATION_ASSETS,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

export function ClassicUmrahCoverPage() {
  return (
    <section
      {...{ [EXPORT_PAGE_ATTR]: "" }}
      className="relative shrink-0 overflow-hidden bg-black shadow-sm"
      style={{
        width: QUOTATION_A4_WIDTH_PX,
        height: QUOTATION_A4_HEIGHT_PX,
      }}
    >
      <Image
        src={UMRAH_QUOTATION_ASSETS.coverPage}
        alt="Umrah Quotation cover"
        fill
        priority
        className="object-cover object-center"
        sizes={`${QUOTATION_A4_WIDTH_PX}px`}
      />
    </section>
  );
}
