import {
  UMRAH_HOTEL_NOTES,
  UMRAH_PDF_RED,
  UMRAH_PDF_TEAL,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";
import {
  chunkFilledHotelStays,
  getHotelStayLabel,
  listFilledHotelStays,
  type TFilledHotelStay,
} from "@/features/quotations/calculator/lib/quotation-hotel-slots";
import { isHotelSectionExported } from "@/features/quotations/calculator/lib/quotation-section-export";
import type { TQuotationHotel, TQuotationOption } from "@/types/quotation.type";

import { ClassicUmrahPageShell } from "./classic-umrah-page-shell";

function StayRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border border-slate-900 border-t-0 first:border-t">
      <div
        className="w-[110px] shrink-0 border-r border-slate-900 px-3 py-1.5 text-[13px] font-bold text-white"
        style={{ backgroundColor: UMRAH_PDF_TEAL }}
      >
        {label}
      </div>
      <div className="flex flex-1 items-center px-3 py-1.5 text-[13px] text-slate-900">
        <span className="rounded bg-slate-100 px-2 py-0.5">{value || "—"}</span>
      </div>
    </div>
  );
}

function HotelBlock({ title, hotel }: { title: string; hotel: TQuotationHotel }) {
  return (
    <div>
      <h3 className="pb-3 text-[16px] font-bold tracking-wide text-slate-900">
        {title}
      </h3>

      <div className="flex items-center gap-2 pb-1.5">
        <span
          className="rounded-md px-3 py-1 text-[13px] font-bold text-white"
          style={{ backgroundColor: UMRAH_PDF_TEAL }}
        >
          {hotel.name || "Hotel to be confirmed"}
        </span>
        <span className="text-[13px] font-bold text-slate-900">or Similar</span>
      </div>

      <p className="pb-0.5 text-[12px] text-slate-700">📍 {hotel.location || "—"}</p>
      {hotel.distance ? (
        <p className="pb-3 text-[12px] italic text-slate-800">({hotel.distance})</p>
      ) : (
        <div className="pb-3" />
      )}

      <div className="max-w-[450px]">
        <StayRow label="Check-in:" value={hotel.checkIn} />
        <StayRow label="Check-out:" value={hotel.checkOut} />
        <StayRow label="Room:" value={hotel.roomType} />
        <StayRow label="Board:" value={hotel.board} />
      </div>
    </div>
  );
}

function HotelNotesFooter() {
  return (
    <div className="mt-auto space-y-2 border-t border-slate-300 pt-4 pb-8">
      <p
        className="text-center text-[11.5px] font-semibold italic leading-snug"
        style={{ color: UMRAH_PDF_RED }}
      >
        {UMRAH_HOTEL_NOTES.extraBeds}
      </p>
      <p className="text-center text-[10.5px] text-slate-800">
        {UMRAH_HOTEL_NOTES.checkTimes}
      </p>
      <div className="text-center text-[10.5px] leading-snug text-slate-800">
        <p className="italic">{UMRAH_HOTEL_NOTES.roomPolicyTitle}</p>
        <p>{UMRAH_HOTEL_NOTES.roomPolicy}</p>
      </div>
      <div className="text-center text-[10.5px] leading-snug text-slate-800">
        <p className="italic">{UMRAH_HOTEL_NOTES.roomIssuesTitle}</p>
        <p>{UMRAH_HOTEL_NOTES.roomIssues}</p>
      </div>
    </div>
  );
}

type TClassicUmrahOptionHotelsPageContentProps = {
  optionNumber: number;
  hotels: TFilledHotelStay[];
  showNotes: boolean;
};

function ClassicUmrahOptionHotelsPageContent({
  optionNumber,
  hotels,
  showNotes,
}: TClassicUmrahOptionHotelsPageContentProps) {
  return (
    <ClassicUmrahPageShell>
      <h2 className="text-center text-[16px] font-bold">Option- {optionNumber}</h2>
      <h2 className="pb-4 text-center text-[16px] font-bold">HOTELS</h2>

      {hotels.map(({ hotel, index }, displayIndex) => (
        <div key={`hotel-block-${index}`}>
          {displayIndex > 0 ? (
            <p className="py-4 text-center text-[13px] tracking-wide text-slate-700">
              --------------------------------- oOo ---------------------------------
            </p>
          ) : null}
          <HotelBlock title={getHotelStayLabel(hotel, index)} hotel={hotel} />
        </div>
      ))}

      {showNotes ? <HotelNotesFooter /> : null}
    </ClassicUmrahPageShell>
  );
}

type TClassicUmrahOptionHotelsPageProps = {
  option: TQuotationOption;
  optionNumber: number;
};

export function ClassicUmrahOptionHotelsPage({
  option,
  optionNumber,
}: TClassicUmrahOptionHotelsPageProps) {
  if (!isHotelSectionExported(option)) return null;

  const hotelPages = chunkFilledHotelStays(listFilledHotelStays(option));
  const lastPageIndex = hotelPages.length - 1;

  return (
    <>
      {hotelPages.map((hotels, pageIndex) => (
        <ClassicUmrahOptionHotelsPageContent
          key={`option-${optionNumber}-hotels-page-${pageIndex}`}
          optionNumber={optionNumber}
          hotels={hotels}
          showNotes={pageIndex === lastPageIndex}
        />
      ))}
    </>
  );
}
