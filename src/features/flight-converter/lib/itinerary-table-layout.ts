/** Fixed column widths (px) — logo column must fit widest airline marks (e.g. QR). */
export const ITINERARY_TABLE_COLUMNS = {
  logo: 160,
  date: 116,
  flightNo: 96,
  operatedBy: 160,
  depart: 86,
  from: 220,
  arrive: 128,
  at: 220,
  duration: 112,
  transit: 104,
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

/** html2canvas scale — 6× targets 4K-like PNG/PDF clarity. */
export const ITINERARY_EXPORT_CANVAS_SCALE = 6;

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
    headerBg: "#ffffff",
    rowAltBg: "#F5F5F5",
    canvasBg: "#ffffff",
  },
  dark: {
    bg: "#0f172a",
    fg: "#e2e8f0",
    border: "#64748b",
    headerBg: "#0f172a",
    rowAltBg: "#F5F5F5",
    canvasBg: "#0f172a",
  },
};

export const EXPORT_TABLE_FONT = {
  header: "16px",
  cell: "16px",
  cellSmall: "14px",
} as const;

export const EXPORT_TABLE_FONT_FAMILY =
  'var(--font-raleway), Raleway, var(--font-inter), "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
