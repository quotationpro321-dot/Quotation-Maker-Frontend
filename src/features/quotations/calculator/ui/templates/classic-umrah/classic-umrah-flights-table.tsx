import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";
import { AirlineLogo } from "@/features/flight-converter/ui/airline-logo";
import { UMRAH_PDF_TEAL } from "@/features/quotations/calculator/lib/quotation-classic-umrah-copy";

/** Fixed column widths (px) tuned to fill the A4 flights page exactly. */
const COLUMN_WIDTHS = {
  logo: 66,
  date: 58,
  airline: 70,
  flightNo: 52,
  depart: 48,
  from: 132,
  arrive: 56,
  at: 130,
  duration: 72,
  transit: 70,
} as const;

const TABLE_WIDTH = Object.values(COLUMN_WIDTHS).reduce((sum, w) => sum + w, 0);

const HEADERS: Array<{ key: keyof typeof COLUMN_WIDTHS; label: string }> = [
  { key: "logo", label: "" },
  { key: "date", label: "Date" },
  { key: "airline", label: "Airline" },
  { key: "flightNo", label: "Flight No" },
  { key: "depart", label: "Depart" },
  { key: "from", label: "From" },
  { key: "arrive", label: "Arrive" },
  { key: "at", label: "At" },
  { key: "duration", label: "Duration" },
  { key: "transit", label: "Transit" },
];

function splitArrivalDisplay(display: string): {
  time: string;
  note: string | null;
} {
  const idx = display.indexOf(" (");
  if (idx === -1) return { time: display, note: null };
  return { time: display.slice(0, idx), note: display.slice(idx + 2, -1) };
}

const cellBase =
  "border border-slate-400 align-middle px-1.5 py-2 text-center text-[10px] leading-tight break-words overflow-hidden";

/** Matches the calculator itinerary preview's alternate-row shade. */
const ROW_ALT_BG = "#F5F5F5";
const ROW_BG = "#ffffff";

export function ClassicUmrahFlightsTable({
  segments,
}: {
  segments: NormalizedSegment[];
}) {
  return (
    <table
      className="border-collapse"
      style={{ width: TABLE_WIDTH, tableLayout: "fixed" }}
    >
      <colgroup>
        {HEADERS.map((header) => (
          <col key={header.key} style={{ width: COLUMN_WIDTHS[header.key] }} />
        ))}
      </colgroup>

      <thead>
        <tr style={{ backgroundColor: UMRAH_PDF_TEAL }}>
          {HEADERS.map((header) => (
            <th
              key={header.key}
              className="border border-slate-400 px-1.5 py-2 text-center text-[10px] font-bold leading-tight text-white"
            >
              {header.label}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {segments.map((seg, index) => {
          const arrival = splitArrivalDisplay(seg.arrivalDisplay);
          const isAlt = index % 2 === 1;

          return (
            <tr
              key={`${seg.segmentOrder}-${index}`}
              style={{ backgroundColor: isAlt ? ROW_ALT_BG : ROW_BG }}
            >
              <td className={cellBase}>
                <div className="mx-auto flex h-6 max-w-full items-center justify-center">
                  <AirlineLogo segment={seg} maxHeightPx={24} />
                </div>
              </td>
              <td className={cellBase}>{seg.departureDateDisplay}</td>
              <td className={cellBase}>{seg.airlineName}</td>
              <td className={cellBase}>{seg.flightNumber}</td>
              <td className={`${cellBase} font-semibold`}>{seg.departureTime}</td>
              <td className={cellBase}>
                {seg.fromName} ({seg.fromCode})
              </td>
              <td className={`${cellBase} font-semibold`}>
                {arrival.time}
                {arrival.note ? (
                  <span className="mt-0.5 block text-[8px] font-medium italic text-slate-500">
                    ({arrival.note})
                  </span>
                ) : null}
              </td>
              <td className={cellBase}>
                {seg.toName} ({seg.toCode})
              </td>
              <td className={cellBase}>{seg.durationDisplay}</td>
              <td className={cellBase}>{seg.transitDisplay}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
