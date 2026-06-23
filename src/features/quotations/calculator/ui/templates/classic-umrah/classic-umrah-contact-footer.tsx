import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaPhone,
  FaStar,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa6";

import AlsamaLogoSvg from "@/components/common/AlsamaLogoSvg";
import {
  UMRAH_CONSULTANT,
  UMRAH_PDF_TEAL,
} from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";

import { CLASSIC_UMRAH_PAGE_MARGIN_PX } from "./classic-umrah-page-shell";

function ContactRow({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-slate-900">
      <span
        className="flex size-7 items-center justify-center rounded-full border text-[13px]"
        style={{ borderColor: UMRAH_PDF_TEAL, color: UMRAH_PDF_TEAL }}
      >
        {icon}
      </span>
      {text}
    </div>
  );
}

function TrustpilotBadge() {
  return (
    <div className="flex flex-col items-start gap-1">
      <p className="text-[11px] font-bold text-slate-900">Rated Excellent</p>
      <div className="flex gap-px">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className="flex size-4 items-center justify-center bg-[#00b67a]"
          >
            <FaStar className="size-2.5 text-white" />
          </span>
        ))}
      </div>
      <p className="flex items-center gap-1 text-[11px] font-bold text-slate-900">
        <FaStar className="size-3 text-[#00b67a]" /> Trustpilot
      </p>
    </div>
  );
}

export function ClassicUmrahContactFooter({
  consultantName,
  consultantWhatsapp,
  consultantDesignation,
}: {
  consultantName: string;
  consultantWhatsapp: string;
  consultantDesignation: string;
}) {
  const whatsappText = consultantWhatsapp.trim() || "WhatsApp number not set";
  const designationText =
    consultantDesignation.trim() || UMRAH_CONSULTANT.title;
  return (
    <div className="mt-auto">
      <div className="flex items-center justify-between gap-6 px-2 pb-6">
        <div className="bg-gradient-to-r from-slate-200 via-slate-100 to-white py-4 pl-4 pr-10">
          <p className="font-serif text-[24px] tracking-wide text-slate-900">
            {consultantName}
          </p>
          <p className="text-[12px] font-semibold tracking-wide text-slate-700">
            {designationText}
          </p>
        </div>

        <div className="space-y-2.5">
          <ContactRow icon={<FaWhatsapp />} text={whatsappText} />
          <ContactRow icon={<FaPhone />} text={UMRAH_CONSULTANT.phone} />
          <ContactRow icon={<FaEnvelope />} text={UMRAH_CONSULTANT.email} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <AlsamaLogoSvg className="h-16 w-auto" />
          <TrustpilotBadge />
        </div>
      </div>

      <div
        className="flex items-center justify-between px-6 py-2.5"
        style={{
          backgroundColor: UMRAH_PDF_TEAL,
          marginLeft: -CLASSIC_UMRAH_PAGE_MARGIN_PX,
          marginRight: -CLASSIC_UMRAH_PAGE_MARGIN_PX,
        }}
      >
        <p className="text-[12px] font-semibold text-white">
          {UMRAH_CONSULTANT.website}
        </p>
        <div className="flex items-center gap-2 text-white">
          <FaFacebookF className="size-3.5" />
          <FaInstagram className="size-3.5" />
          <FaEnvelope className="size-3.5" />
          <FaTiktok className="size-3.5" />
        </div>
      </div>
    </div>
  );
}
