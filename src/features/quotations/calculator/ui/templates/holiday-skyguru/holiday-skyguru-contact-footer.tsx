import { FaEnvelope, FaGlobe, FaWhatsapp } from "react-icons/fa6";

import {
  HOLIDAY_PAGE_MARGIN_PX,
  HOLIDAY_PDF_BLUE,
  HOLIDAY_SKYGURU_ASSETS,
  SKYGURU_CONTACT,
} from "@/features/quotations/calculator/lib/quotation-holiday-skyguru.constants";

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-slate-900">
      <span
        className="flex size-7 items-center justify-center rounded-full border text-[13px]"
        style={{ borderColor: HOLIDAY_PDF_BLUE, color: HOLIDAY_PDF_BLUE }}
      >
        {icon}
      </span>
      {text}
    </div>
  );
}

export function HolidaySkyguruContactFooter({
  consultantName,
  consultantWhatsapp,
  consultantDesignation,
}: {
  consultantName: string;
  consultantWhatsapp: string;
  consultantDesignation: string;
}) {
  const whatsappText = consultantWhatsapp.trim() || SKYGURU_CONTACT.whatsapp;
  const designationText =
    consultantDesignation.trim() || SKYGURU_CONTACT.consultantTitle;

  return (
    <div className="mt-auto">
      <div className="flex items-end justify-between gap-6 px-2 pb-6">
        <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-white py-4 pl-4 pr-10">
          <p className="font-serif text-[22px] tracking-wide text-slate-900">
            {consultantName || "SkyGuru Travel"}
          </p>
          <p className="text-[12px] font-semibold tracking-wide text-slate-700">
            {designationText}
          </p>
        </div>

        <div className="space-y-2.5">
          <ContactRow icon={<FaWhatsapp />} text={whatsappText} />
          <ContactRow icon={<FaEnvelope />} text={SKYGURU_CONTACT.email} />
          <ContactRow icon={<FaGlobe />} text={SKYGURU_CONTACT.website} />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HOLIDAY_SKYGURU_ASSETS.logo}
          alt="SkyGuru"
          className="h-12 w-auto object-contain"
          draggable={false}
        />
      </div>

      <div
        className="flex items-center justify-center py-2.5 text-[12px] font-semibold text-white"
        style={{
          backgroundColor: HOLIDAY_PDF_BLUE,
          marginLeft: -HOLIDAY_PAGE_MARGIN_PX,
          marginRight: -HOLIDAY_PAGE_MARGIN_PX,
        }}
      >
        {SKYGURU_CONTACT.website}
      </div>
    </div>
  );
}
