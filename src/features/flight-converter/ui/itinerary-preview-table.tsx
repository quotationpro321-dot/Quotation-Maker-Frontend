"use client";

import { forwardRef, useLayoutEffect, useState } from "react";

import { EXPORT_ROOT_ATTR } from "@/features/flight-converter/lib/export-itinerary";
import {
  EXPORT_TABLE_FONT,
  EXPORT_TABLE_FONT_FAMILY,
  ITINERARY_LOGO_CELL_MIN_HEIGHT,
  itineraryColumnWidthPercent,
  QUOTATION_PREVIEW_TABLE_FONT,
  type ItineraryTableLayout,
} from "@/features/flight-converter/lib/itinerary-table-layout";
import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";
import { AirlineLogo } from "@/features/flight-converter/ui/airline-logo";
import { cn } from "@/lib/utils";

type ItineraryPreviewTableProps = {
  segments: NormalizedSegment[];
  layout?: ItineraryTableLayout;
  flightNoHeaderMultiline?: boolean;
  /** Lock export styling (e.g. classic Umrah PDF pages always use light). */
  exportTheme?: "light" | "dark";
};

function splitArrivalDisplay(display: string) {
  const idx = display.indexOf(" (");
  if (idx === -1) return { time: display, note: null as string | null };
  return {
    time: display.slice(0, idx),
    note: display.slice(idx + 2),
  };
}

function readHtmlDarkClass(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Keep `data-export-theme` in sync with `<html class="dark">` immediately on toggle.
 * `next-themes` `resolvedTheme` alone can lag a frame behind the real DOM class.
 */
function useSyncExportThemeAttr(): "light" | "dark" {
  const [exportTheme, setExportTheme] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" ? readHtmlDarkClass() : "light",
  );

  useLayoutEffect(() => {
    const sync = () => setExportTheme(readHtmlDarkClass());
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return exportTheme;
}

function MultilineHeader({ lines }: { lines: [string, string] }) {
  return (
    <span className="inline-block leading-tight">
      {lines[0]}
      <br />
      {lines[1]}
    </span>
  );
}

export const ItineraryPreviewTable = forwardRef<
  HTMLDivElement,
  ItineraryPreviewTableProps
>(function ItineraryPreviewTable(
  { segments, layout = "converter", flightNoHeaderMultiline, exportTheme: exportThemeProp },
  ref,
) {
  const syncedTheme = useSyncExportThemeAttr();
  const exportTheme = exportThemeProp ?? syncedTheme;
  const isQuotation = layout === "quotation";
  const useMultilineFlightNo = flightNoHeaderMultiline ?? isQuotation;
  const fonts = isQuotation ? QUOTATION_PREVIEW_TABLE_FONT : EXPORT_TABLE_FONT;

  const thClass = cn(
    "border border-border align-middle font-bold text-foreground",
    isQuotation
      ? "px-2 py-2 text-center text-[13px] leading-snug whitespace-normal"
      : "px-3 py-3 text-left whitespace-nowrap",
  );
  const tdClass = cn(
    "border border-border align-middle text-foreground font-normal",
    isQuotation ? "px-2 py-2.5 break-words text-[14px]" : "px-3 py-3 break-words",
  );

  return (
    <div
      ref={ref}
      {...{ [EXPORT_ROOT_ATTR]: "" }}
      data-export-theme={exportTheme}
      className="w-full bg-card text-card-foreground"
    >
      <div data-export-scroll className="w-full overflow-x-hidden">
        <table
          className="w-full border-collapse border border-border"
          style={{
            tableLayout: "fixed",
            width: "100%",
            fontSize: fonts.cell,
            fontFamily: EXPORT_TABLE_FONT_FAMILY,
            fontWeight: 400,
            lineHeight: 1.45,
            letterSpacing: "0.01em",
            textRendering: "geometricPrecision",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          <colgroup>
            <col style={{ width: itineraryColumnWidthPercent("logo", layout) }} />
            <col style={{ width: itineraryColumnWidthPercent("date", layout) }} />
            <col
              style={{ width: itineraryColumnWidthPercent("operatedBy", layout) }}
            />
            <col
              style={{ width: itineraryColumnWidthPercent("flightNo", layout) }}
            />
            <col
              style={{ width: itineraryColumnWidthPercent("depart", layout) }}
            />
            <col style={{ width: itineraryColumnWidthPercent("from", layout) }} />
            <col
              style={{ width: itineraryColumnWidthPercent("arrive", layout) }}
            />
            <col style={{ width: itineraryColumnWidthPercent("at", layout) }} />
            <col
              style={{ width: itineraryColumnWidthPercent("duration", layout) }}
            />
            <col
              style={{ width: itineraryColumnWidthPercent("transit", layout) }}
            />
          </colgroup>
          <thead>
            <tr>
              <th
                className={thClass}
                data-logo-cell
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              />
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                Date
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                Airline
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                {useMultilineFlightNo ? (
                  <MultilineHeader lines={["Flight", "No"]} />
                ) : (
                  "Flight No"
                )}
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                Depart
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                From
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                Arrive
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                At
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                Duration
              </th>
              <th
                className={thClass}
                style={{ fontSize: fonts.header, fontWeight: 700 }}
              >
                Transit
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.map((seg, idx) => {
              const arrival = splitArrivalDisplay(seg.arrivalDisplay);
              const rowAlt = idx % 2 === 1;

              return (
                <tr
                  key={`${seg.segmentOrder}-${idx}`}
                  className={rowAlt ? "export-row-alt bg-[#F5F5F5]" : "bg-card"}
                >
                  <td
                    data-logo-cell
                    className={`${tdClass} overflow-hidden text-center`}
                    style={{ minHeight: ITINERARY_LOGO_CELL_MIN_HEIGHT }}
                  >
                    <AirlineLogo segment={seg} />
                  </td>
                  <td className={tdClass}>{seg.departureDateDisplay}</td>
                  <td
                    className={tdClass}
                    style={{ fontSize: fonts.cellSmall }}
                  >
                    {seg.airlineName}
                  </td>
                  <td className={cn(tdClass, "whitespace-nowrap")}>
                    {seg.flightNumber}
                  </td>
                  <td className={cn(tdClass, "whitespace-nowrap")}>
                    {seg.departureTime}
                  </td>
                  <td className={tdClass}>
                    {seg.fromName} ({seg.fromCode})
                  </td>
                  <td className={tdClass}>
                    <span>{arrival.time}</span>
                    {arrival.note && (
                      <span
                        className="mt-0.5 block text-xs italic font-medium text-muted-foreground"
                        style={{ fontSize: fonts.cellSmall }}
                      >
                        ({arrival.note})
                      </span>
                    )}
                  </td>
                  <td className={tdClass}>
                    {seg.toName} ({seg.toCode})
                  </td>
                  <td className={cn(tdClass, "whitespace-nowrap")}>
                    {seg.durationDisplay}
                  </td>
                  <td className={cn(tdClass, "whitespace-nowrap")}>
                    {seg.transitDisplay}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
