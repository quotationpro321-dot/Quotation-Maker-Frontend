import {
  HOLIDAY_BOOKING_TERMS,
  HOLIDAY_NEXT_STEPS,
  HOLIDAY_NEXT_STEPS_INTRO,
  HOLIDAY_PDF_BLUE,
  SKYGURU_CONTACT,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";

import { HolidaySkyguruPageShell } from "./holiday-skyguru-page-shell";
import {
  HolidayBulletList,
  HolidaySectionHeading,
} from "./holiday-skyguru-primitives";

export function HolidaySkyguruBookingInfoPage() {
  return (
    <HolidaySkyguruPageShell>
      <div className="pb-6">
        <HolidaySectionHeading>Important Information</HolidaySectionHeading>
        <div className="border border-t-0 border-slate-300 px-4 py-4">
          <HolidayBulletList items={HOLIDAY_BOOKING_TERMS} />
        </div>
      </div>

      <div>
        <HolidaySectionHeading>
          Next Steps to Confirm the Booking
        </HolidaySectionHeading>
        <div className="space-y-3 border border-t-0 border-slate-300 px-4 py-4">
          <p className="text-[12.5px] text-slate-800">
            {HOLIDAY_NEXT_STEPS_INTRO}
          </p>
          <ol className="space-y-2">
            {HOLIDAY_NEXT_STEPS.map((step, index) => (
              <li
                key={step.slice(0, 32)}
                className="flex gap-3 text-[12.5px] leading-snug text-slate-800"
              >
                <span
                  className="flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: HOLIDAY_PDF_BLUE }}
                >
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-x-8 gap-y-1 pt-1 text-[12.5px] font-semibold text-slate-900">
            <span>WhatsApp: {SKYGURU_CONTACT.whatsapp}</span>
            <span>Email: {SKYGURU_CONTACT.email}</span>
          </div>
        </div>
      </div>
    </HolidaySkyguruPageShell>
  );
}
