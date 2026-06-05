import { EXPORT_ROOT_ATTR } from "@/features/quotations/calculator/lib/export-quotation";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";

import { ClassicUmrahCoverPage } from "./classic-umrah-cover-page";
import { ClassicUmrahIntroPage } from "./classic-umrah-intro-page";

export function ClassicUmrahTemplate(_props: TQuotationTemplateProps) {
  return (
    <div
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      className="mx-auto flex w-fit shrink-0 flex-col gap-0"
    >
      <ClassicUmrahCoverPage />
      <ClassicUmrahIntroPage />
    </div>
  );
}
