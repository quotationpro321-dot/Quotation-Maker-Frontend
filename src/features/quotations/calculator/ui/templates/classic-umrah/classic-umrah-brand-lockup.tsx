import Image from "next/image";

import { UMRAH_QUOTATION_ASSETS } from "@/features/quotations/calculator/lib/quotation-classic-umrah.constants";

export function ClassicUmrahBrandLockup() {
  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <Image
        src={UMRAH_QUOTATION_ASSETS.logo}
        alt="ALSAMA"
        width={150}
        height={56}
        className="h-12 w-auto object-contain object-right"
      />
      <span className="pr-0.5 text-[9px] font-semibold tracking-[0.42em] text-slate-800">
        T O U R S
      </span>
    </div>
  );
}
