/** Fixed column widths (px) — logo column must fit widest airline marks (e.g. QR). */
export const ITINERARY_TABLE_COLUMNS = {
  logo: 168,
  date: 118,
  flightNo: 92,
  operatedBy: 152,
  depart: 78,
  from: 236,
  arrive: 128,
  at: 236,
  duration: 88,
  transit: 96,
} as const;

export const ITINERARY_TABLE_MIN_WIDTH = Object.values(
  ITINERARY_TABLE_COLUMNS,
).reduce((sum, w) => sum + w, 0);

export type ItineraryTableColumn = keyof typeof ITINERARY_TABLE_COLUMNS;

export const ITINERARY_TABLE_COLUMN_KEYS = Object.keys(
  ITINERARY_TABLE_COLUMNS,
) as ItineraryTableColumn[];

/** Cell padding (px) — matches `px-3` in preview table cells. */
export const ITINERARY_TABLE_CELL_PADDING_X = 24;

/** Proportional column width for full-width preview (export uses fixed px). */
export function itineraryColumnWidthPercent(
  column: ItineraryTableColumn,
): string {
  const width = ITINERARY_TABLE_COLUMNS[column];
  return `${((width / ITINERARY_TABLE_MIN_WIDTH) * 100).toFixed(4)}%`;
}

/** Max logo height inside the first column (px) — matches cell padding + row height. */
export const AIRLINE_LOGO_MAX_HEIGHT = 56;

/** Minimum logo cell height (px) for readable preview rows. */
export const ITINERARY_LOGO_CELL_MIN_HEIGHT = 62;

/** Tight edge padding applied only during PNG/PDF capture (px). */
export const ITINERARY_EXPORT_PADDING = 3;

/** html2canvas scale — 3× gives crisp PNG/PDF on retina and print. */
export const ITINERARY_EXPORT_CANVAS_SCALE = 3;

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
  header: "13px",
  cell: "14px",
  cellSmall: "12px",
} as const;
