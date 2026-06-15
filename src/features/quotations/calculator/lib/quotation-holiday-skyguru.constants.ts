/**
 * Brand values and static copy for the SkyGuru holiday quotation PDF/preview.
 * Mirrors the agency reference document — edit here, not in the page components.
 */

export const HOLIDAY_PAGE_MARGIN_PX = 56;

export const HOLIDAY_PDF_BLUE = "#15357e";
export const HOLIDAY_PDF_BLUE_DARK = "#0e2456";
export const HOLIDAY_PDF_BLUE_SOFT = "#eef3fb";
export const HOLIDAY_PDF_RED = "#c00000";

export const HOLIDAY_SKYGURU_ASSETS = {
  coverPage: "/quotations/holiday/holiday-cover-page.png",
  /** Filename contains a space — encoded so it loads in <img> and html2canvas. */
  logo: "/quotations/SKYGURU%20LOGO.png",
  bookWithConfidence: "/quotations/book-with-confidence.png",
} as const;

export const HOLIDAY_GREETING = {
  salutation: "Hello,",
  body: "I am pleased to offer you the following package.",
} as const;

export const HOLIDAY_DEFAULT_CABIN_LUGGAGE = "Carry-on baggage 15KG (45 × 36 × 20 cm)";

export const HOLIDAY_PRICING_TAX_NOTE = "Exc. local tax";

export const HOLIDAY_BOOKING_TERMS = [
  "Non-Refundable: Flights and hotels are non-refundable once booked.",
  "Taxes: City and other taxes are not included and must be paid on the spot.",
  "Price Variability: Prices may change based on availability at the time of booking.",
  "Cancellation Policy: Cancellation after confirmation will incur fees.",
  "Visa & Passport: Ensure your passport is valid for at least 6 months beyond your return date.",
  "Disclaimer: Any unintentional error or mistake in this quotation will not be entertained and is subject to availability.",
] as const;

export const HOLIDAY_NEXT_STEPS_INTRO = "To confirm your booking, please:";

export const HOLIDAY_NEXT_STEPS = [
  "Review the quotation and select your preferred option.",
  "Contact the correspondent or reach out to us using the details below to proceed with the booking.",
  "Make the required deposit to secure your booking to the bank details below.",
] as const;

export const HOLIDAY_DEPOSIT_ROWS = [
  "First Deposit",
  "Second Deposit",
  "Final Deposit",
] as const;

export const HOLIDAY_BANK_DETAILS = {
  title: "Business Bank Details:",
  companyName: "TRAVEL PRO LTD",
  accountNumber: "Account number: 01850156",
  sortCode: "Sort code: 04-29-09",
  paymentRef: "Payment ref:",
} as const;

export const HOLIDAY_CANCELLATION_ROWS = [
  { label: "Flight", value: "Non-Refundable" },
  { label: "Hotel", value: "Non-Refundable" },
  { label: "Transport", value: "Non-Refundable" },
  { label: "Visa", value: "Non-Refundable" },
] as const;

export const HOLIDAY_TAX_NOTE =
  "[N.B: City or other taxes are not included in the above prices. If any of the taxes are applicable, these should be paid on the spot.]";

export const SKYGURU_CONTACT = {
  consultantTitle: "Holiday Travel Consultant",
  whatsapp: "+44 7960 046798",
  email: "sales@skyguru.co.uk",
  website: "skyguru.co.uk",
} as const;
