/** Fixed column widths (px) — logo column must fit widest airline marks (e.g. QR). */
export const ITINERARY_TABLE_COLUMNS = {
  logo: 148,
  date: 100,
  flightNo: 80,
  operatedBy: 132,
  depart: 68,
  from: 204,
  arrive: 112,
  at: 204,
  duration: 76,
  transit: 84,
} as const;

export const ITINERARY_TABLE_MIN_WIDTH = Object.values(ITINERARY_TABLE_COLUMNS).reduce(
  (sum, w) => sum + w,
  0,
);

/** Max logo height inside the first column (px) — matches cell padding + row height. */
export const AIRLINE_LOGO_MAX_HEIGHT = 48;

export type ItineraryExportTheme = "light" | "dark";

/** Colors for itinerary preview + canvas/print exports (matches light/dark UI). */
export const ITINERARY_EXPORT_THEME: Record<
  ItineraryExportTheme,
  {
    bg: string;
    fg: string;
    border: string;
    headerBg: string;
    rowAltBg: string;
    canvasBg: string;
  }
> = {
  light: {
    bg: "#ffffff",
    fg: "#0f172a",
    border: "#0f172a",
    headerBg: "#f1f5f9",
    rowAltBg: "#f8fafc",
    canvasBg: "#ffffff",
  },
  dark: {
    bg: "#0f172a",
    fg: "#e2e8f0",
    border: "#64748b",
    headerBg: "#1e293b",
    rowAltBg: "#172554",
    canvasBg: "#0f172a",
  },
};

export const EXPORT_TABLE_FONT = {
  header: "11px",
  cell: "12px",
  cellSmall: "11px",
} as const;
