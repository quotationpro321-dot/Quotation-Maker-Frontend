import {
  HOLIDAY_PDF_BLUE,
  HOLIDAY_SKYGURU_ASSETS,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";

type TFlightsSkyguruPageHeaderProps = {
  marginPx: number;
};

/** SkyGuru logo + "Flight Quotation" + confidence badge on every content page. */
export function FlightsSkyguruPageHeader({
  marginPx,
}: TFlightsSkyguruPageHeaderProps) {
  return (
    <header
      className="flex shrink-0 items-center justify-between border-b border-slate-200 pt-8 pb-4"
      style={{ paddingLeft: marginPx, paddingRight: marginPx }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HOLIDAY_SKYGURU_ASSETS.logo}
        alt="SkyGuru"
        className="h-32 w-auto max-w-[240px] object-contain object-left"
        draggable={false}
      />

      <p
        className="shrink-0 px-4 text-[17px] font-semibold tracking-wide"
        style={{ color: HOLIDAY_PDF_BLUE }}
      >
        Flight Quotation
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HOLIDAY_SKYGURU_ASSETS.bookWithConfidence}
        alt="Book with confidence"
        className="h-28 w-auto max-w-[200px] object-contain object-right"
        draggable={false}
      />
    </header>
  );
}
