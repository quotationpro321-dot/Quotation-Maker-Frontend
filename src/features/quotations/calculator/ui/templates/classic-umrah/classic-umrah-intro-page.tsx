import Image from "next/image";

import { EXPORT_PAGE_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import {
  QUOTATION_A4_HEIGHT_PX,
  QUOTATION_A4_WIDTH_PX,
  UMRAH_INTRO_COLLAGE_SIZE_PX,
  UMRAH_INTRO_CONTENT_WIDTH_PX,
  UMRAH_INTRO_PAGE_MARGIN_PX,
  UMRAH_INTRO_PARAGRAPHS,
  UMRAH_QUOTATION_ASSETS,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

import { ClassicUmrahBrandLockup } from "./classic-umrah-brand-lockup";

export function ClassicUmrahIntroPage() {
  const pageMargin = {
    paddingLeft: UMRAH_INTRO_PAGE_MARGIN_PX,
    paddingRight: UMRAH_INTRO_PAGE_MARGIN_PX,
  };

  return (
    <section
      {...{ [EXPORT_PAGE_ATTR]: "" }}
      className="flex shrink-0 flex-col overflow-hidden bg-white text-slate-900 shadow-sm"
      style={{
        width: QUOTATION_A4_WIDTH_PX,
        height: QUOTATION_A4_HEIGHT_PX,
      }}
    >
      <header
        className="flex shrink-0 items-start justify-between pt-8 pb-4"
        style={pageMargin}
      >
        <p
          className="max-w-[58%] font-serif text-[2.25rem] leading-[1.15] text-[#818160]"
          dir="rtl"
          lang="ar"
        >
          السلام عليكم
        </p>
        <ClassicUmrahBrandLockup />
      </header>

      <div className="shrink-0 space-y-3 pb-4" style={pageMargin}>
        {UMRAH_INTRO_PARAGRAPHS.map((paragraph) => (
          <p
            key={paragraph.slice(0, 40)}
            className="text-justify text-[12px] leading-[1.55] text-slate-800"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div
        className="mt-auto flex shrink-0 justify-center pb-8 pt-1"
        style={pageMargin}
      >
        <Image
          src={UMRAH_QUOTATION_ASSETS.experienceCollage}
          alt="Umrah experience collage"
          width={UMRAH_INTRO_COLLAGE_SIZE_PX}
          height={UMRAH_INTRO_COLLAGE_SIZE_PX}
          unoptimized
          className="block h-auto max-w-full"
          style={{
            width: UMRAH_INTRO_COLLAGE_SIZE_PX,
            height: UMRAH_INTRO_COLLAGE_SIZE_PX,
            maxWidth: UMRAH_INTRO_CONTENT_WIDTH_PX,
          }}
        />
      </div>
    </section>
  );
}
