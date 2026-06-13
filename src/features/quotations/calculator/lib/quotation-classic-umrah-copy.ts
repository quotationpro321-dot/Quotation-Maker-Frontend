/**
 * Static copy and brand values for the classic Umrah PDF pages.
 * Mirrors the agency's reference quotation document — edit here, not in pages.
 */

export const UMRAH_PDF_TEAL = "#24595f";
export const UMRAH_PDF_RED = "#c00000";

export const UMRAH_INVITE_LINE =
  "[With great pleasure, we invite you to explore our exclusive Umrah packages, each thoughtfully crafted to make your pilgrimage a truly blessed experience]";

export const UMRAH_HOTEL_NOTES = {
  extraBeds:
    "Triple and Quad rooms will have additional extra beds which are not standard bedding and extra beds sizes will be smaller than standard beds.",
  checkTimes:
    "Saudi Hotel check-in and out time: Check in: 17:00 | Check out: 12:00",
  roomPolicyTitle: "Room Policy:",
  roomPolicy:
    "All double/twin rooms are subject to availability. Triple/quad rooms include extra beds (smaller than standard).",
  roomIssuesTitle: "Room Issues:",
  roomIssues:
    "Report any problems (e.g., broken fixtures, odors) immediately to hotel reception. Alsama Tours will assist but is not liable for unresolved issues.",
} as const;

export const UMRAH_SERVICE_CHECKLIST: Array<{
  id: "guide" | "ziyarah" | "train" | "manager" | "esim";
  label: string;
}> = [
  { id: "guide", label: "Complementary Local Umrah guide and ground assistance." },
  { id: "ziyarah", label: "Ziyarah included in Makkah & Madinah with guide." },
  { id: "train", label: "Haramain Bullet Train Makkah to Madinah Included." },
  { id: "manager", label: "Dedicated Umrah Manager." },
  { id: "esim", label: "Complimentary e-sim for One Person In Saudi." },
];

export const UMRAH_VISA_NOTE =
  "Please note: A supplementary fee of £100 applies for Umrah visas and £70 for Saudi tourist visas for non-British passport holders. Additional documentation may be required.";

export const UMRAH_TRANSFER_INSTRUCTION = {
  title: "Transfer Instruction: (Must read)",
  body: "To ensure a seamless transfer experience, we recommend purchasing a local SIM card (such as STC, Zain, Mobily, etc.) upon landing at the Saudi airport. After claiming your baggage, please contact Muhib Al Helal on +966 56 437 3190, our Alsama Saudi Operation Manager. He will provide you with detailed information about your assigned driver and the pick-up location. Having a local SIM card will enable you to easily communicate with our team and ensure a smooth and convenient transfer. Please feel free to reach out if you have any questions or need further assistance.",
  driversNote:
    "Please Note: Drivers will wait a maximum of 30 minutes while picking up from Makkah & Madinah Hotel.",
} as const;

export const UMRAH_BANK_DETAILS = {
  title: "Business Bank Details:",
  companyName: "TRAVEL PRO LTD",
  accountNumber: "Account number: 01850156",
  sortCode: "Sort code: 04-29-09",
  paymentRef: "Payment ref:",
} as const;

export const UMRAH_CANCELLATION_ROWS = [
  { label: "Flight", value: "Non-Refundable" },
  { label: "Hotel", value: "Non-Refundable" },
  { label: "Transport", value: "Non-Refundable" },
  { label: "Visa", value: "Non-Refundable" },
] as const;

export const UMRAH_CANCELLATION_NOTES = [
  "[N.B: City or other taxes are not included in the above prices. If any of the taxes are applicable, these should be paid on the spot.]",
  "All visa fees are non-refundable. If your EVW visa or 1-year multiple-entry visa is rejected, we will try to issue alternative Saudi visas, such as an Umrah visa; however, please be advised that new visa fees, including any applicable administrative fees, will be required. Please note that fees for rejected visas are also non-refundable.",
  "Alsama Tours assumes no responsibility for visa rejections, as these decisions are entirely at the discretion of the Saudi Ministry of Hajj and Umrah. If your visa is part of an Umrah package, please be aware that in the case of visa rejections, other components of your booking will be subject to separate terms and conditions regarding cancellations and changes.",
] as const;

export const UMRAH_CONSULTANT = {
  title: "Umrah Travel Consultant",
  phone: "020 8077 5357",
  email: "info@alsama.co.uk",
  website: "alsama.co.uk",
} as const;
