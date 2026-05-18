"use client";

import { forwardRef, useLayoutEffect, useState } from "react";

import { EXPORT_ROOT_ATTR } from "@/features/flight-converter/lib/export-itinerary";
import {
  EXPORT_TABLE_FONT,
  ITINERARY_TABLE_COLUMNS,
  ITINERARY_TABLE_MIN_WIDTH,
} from "@/features/flight-converter/lib/itinerary-table-layout";
import { AirlineLogo } from "@/features/flight-converter/ui/airline-logo";
import type { NormalizedSegment } from "@/features/flight-converter/types/flight-converter.types";

type ItineraryPreviewTableProps = {
  segments: NormalizedSegment[];
};

const thClass =
  "border border-border px-2 py-2 text-left font-bold uppercase text-foreground bg-muted";
const tdClass = "border border-border px-2 py-2 align-middle text-foreground break-words";

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

export const ItineraryPreviewTable = forwardRef<HTMLDivElement, ItineraryPreviewTableProps>(
  function ItineraryPreviewTable({ segments }, ref) {
    const exportTheme = useSyncExportThemeAttr();
    const cols = ITINERARY_TABLE_COLUMNS;

    return (
      <div
        ref={ref}
        {...{ [EXPORT_ROOT_ATTR]: "" }}
        data-export-theme={exportTheme}
        className="mx-auto w-max max-w-full bg-card p-4 text-card-foreground"
      >
        <div data-export-scroll className="w-full overflow-x-auto md:overflow-visible">
          <table
            className="border-collapse border border-border"
            style={{
              tableLayout: "fixed",
              width: `${ITINERARY_TABLE_MIN_WIDTH}px`,
              minWidth: `${ITINERARY_TABLE_MIN_WIDTH}px`,
              fontSize: EXPORT_TABLE_FONT.cell,
            }}
          >
            <colgroup>
              <col style={{ width: cols.logo }} />
              <col style={{ width: cols.date }} />
              <col style={{ width: cols.flightNo }} />
              <col style={{ width: cols.operatedBy }} />
              <col style={{ width: cols.depart }} />
              <col style={{ width: cols.from }} />
              <col style={{ width: cols.arrive }} />
              <col style={{ width: cols.at }} />
              <col style={{ width: cols.duration }} />
              <col style={{ width: cols.transit }} />
            </colgroup>
            <thead>
              <tr className="bg-muted">
                <th
                  className={thClass}
                  data-logo-cell
                  style={{ fontSize: EXPORT_TABLE_FONT.header }}
                />
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  Date
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  Flight No
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  Operated By
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  Depart
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  From
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  Arrive
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  At
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
                  Duration
                </th>
                <th className={thClass} style={{ fontSize: EXPORT_TABLE_FONT.header }}>
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
                    className={
                      rowAlt ? "export-row-alt bg-muted/30 dark:bg-muted/25" : "bg-card"
                    }
                  >
                    <td
                      data-logo-cell
                      className={`${tdClass} text-center`}
                      style={{ minHeight: 52 }}
                    >
                      <AirlineLogo segment={seg} />
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-semibold`}>
                      {seg.departureDateDisplay}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-semibold`}>
                      {seg.flightNumber}
                    </td>
                    <td className={tdClass} style={{ fontSize: EXPORT_TABLE_FONT.cellSmall }}>
                      {seg.airlineName}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-semibold`}>
                      {seg.departureTime}
                    </td>
                    <td className={tdClass}>
                      {seg.fromName} ({seg.fromCode})
                    </td>
                    <td className={`${tdClass} whitespace-nowrap font-semibold`}>
                      <span>{arrival.time}</span>
                      {arrival.note && (
                        <span
                          className="mt-0.5 block text-xs italic font-semibold text-muted-foreground"
                          style={{ fontSize: "11px" }}
                        >
                          ({arrival.note})
                        </span>
                      )}
                    </td>
                    <td className={tdClass}>
                      {seg.toName} ({seg.toCode})
                    </td>
                    <td className={`${tdClass} whitespace-nowrap`}>{seg.durationDisplay}</td>
                    <td className={`${tdClass} whitespace-nowrap font-semibold`}>
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
  },
);
