import { format } from "date-fns";
import { Hotel, MapPin, Plane, Receipt } from "lucide-react";

import {
  calculateGross,
  formatQuotationMoney,
} from "@/features/quotations/calculator/lib/calculate-quotation";
import { hasExportableCustomerNote } from "@/features/quotations/calculator/lib/quotation-customer-note";
import { hasFlightItineraryContent, getFlightItineraryImage, getFlightItineraryMode } from "@/features/quotations/calculator/lib/quotation-flight-itinerary";
import { listHotelSlots } from "@/features/quotations/calculator/lib/quotation-hotel-slots";
import {
  hasGroundServicesInExport,
  isFlightSectionExported,
  isHotelSectionExported,
  isTransferSectionExported,
} from "@/features/quotations/calculator/lib/quotation-section-export";
import { formatTransferRouteEndpoint } from "@/features/quotations/calculator/lib/quotation-transfer.constants";
import { listCheckedIncludedServiceLabels } from "@/features/quotations/calculator/lib/quotation-custom-included-services";
import type { TQuotationTemplateProps } from "@/features/quotations/calculator/lib/quotation-template.types";
import { QuotationFlightItineraryImagePreview } from "@/features/quotations/calculator/ui/quotation-flight-itinerary-image-preview";

type TQuotationTemplateContentProps = TQuotationTemplateProps & {
  variant?: "classic" | "modern" | "compact";
};

export function QuotationTemplateContent({
  draft,
  option,
  totals,
  currency,
  variant = "classic",
}: TQuotationTemplateContentProps) {
  const issuedDate = format(new Date(draft.quotationDate), "d MMMM yyyy");
  const adultGross = calculateGross(option, option.flightAdult);
  const isCompact = variant === "compact";
  const includedServiceLabels = listCheckedIncludedServiceLabels(option);
  const hasTransferContent =
    isTransferSectionExported(option) &&
    (option.vehicleName ||
      option.routes.some((route) => route.from || route.to) ||
      includedServiceLabels.length > 0);
  const filledHotels = listHotelSlots(option).filter(
    ({ hotel }) => hotel.name || hotel.location,
  );

  return (
    <div data-quotation-export-content className="space-y-8 text-foreground">
      <div
        className={
          variant === "modern"
            ? "rounded! bg-brand-primary px-6 py-5 text-white"
            : "border-b-2 border-foreground pb-6"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={
                variant === "modern"
                  ? "text-xs font-semibold uppercase tracking-wide text-white/80"
                  : "text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              }
            >
              Quotation
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {draft.customerName || "Valued Customer"}
            </h2>
            <p
              className={
                variant === "modern"
                  ? "text-sm text-white/90"
                  : "text-sm text-muted-foreground"
              }
            >
              {draft.customerNumber || "N/A"}
            </p>
          </div>
          <div className="text-right">
            <p
              className={
                variant === "modern"
                  ? "text-xs uppercase text-white/80"
                  : "text-xs uppercase text-muted-foreground"
              }
            >
              Date issued
            </p>
            <p className="font-semibold">{issuedDate}</p>
          </div>
        </div>
      </div>

      {isFlightSectionExported(option) && hasFlightItineraryContent(option) ? (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Plane className="size-4 text-brand-primary" />
            Flight itinerary
          </h3>
          {getFlightItineraryMode(option) === "image" &&
          getFlightItineraryImage(option) ? (
            <div className="rounded! border border-border bg-muted/20 p-3">
              <QuotationFlightItineraryImagePreview
                src={getFlightItineraryImage(option)}
              />
            </div>
          ) : (
            <div className={isCompact ? "space-y-2" : "space-y-3"}>
              {option.flightSegments.map((seg) => (
                <div
                  key={`${seg.flightNumber}-${seg.segmentOrder}`}
                  className="rounded! border border-border bg-muted/20 p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold">{seg.flightNumber}</span>
                    <span className="text-muted-foreground">
                      {seg.departureDateDisplay}
                    </span>
                  </div>
                  <p className="mt-1">
                    {seg.fromCode} → {seg.toCode} · {seg.departureTime} –{" "}
                    {seg.arrivalTime}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : null}

      {isHotelSectionExported(option) && filledHotels.length > 0 ? (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <Hotel className="size-4 text-brand-primary" />
            Accommodation
          </h3>
          <div className={isCompact ? "grid gap-2" : "grid gap-3 sm:grid-cols-3"}>
            {filledHotels.map(({ index, hotel }) => (
              <div
                key={`hotel-stay-${index}`}
                className="rounded! border border-border p-3 text-sm"
              >
                <p className="text-xs uppercase text-muted-foreground">
                  {hotel.location || "Hotel stay"}
                </p>
                {hotel.name ? <p className="font-semibold">{hotel.name}</p> : null}
                {hotel.checkIn || hotel.checkOut ? (
                  <p className="text-muted-foreground">
                    {hotel.checkIn || "—"} → {hotel.checkOut || "—"}
                  </p>
                ) : null}
                {hotel.board ? (
                  <p className="text-muted-foreground">Board: {hotel.board}</p>
                ) : null}
                <p className="text-muted-foreground">
                  {hotel.roomType ? `Room: ${hotel.roomType}` : "Room: N/A"}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {hasTransferContent ? (
        <section className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
            <MapPin className="size-4 text-brand-primary" />
            Transfers
          </h3>
          {option.vehicleName ? (
            <div className="rounded! border border-border p-3 text-sm">
              <p className="text-xs uppercase text-muted-foreground">Vehicle</p>
              <p className="font-semibold">{option.vehicleName}</p>
              <p className="text-muted-foreground">
                {option.vehicleQuantity} unit(s)
              </p>
            </div>
          ) : null}
          {includedServiceLabels.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              Included: {includedServiceLabels.join(", ")}
            </p>
          ) : null}
          <div className="space-y-2">
            {option.routes
              .filter((route) => route.from || route.to)
              .map((route) => (
                <div
                  key={route.id}
                  className="rounded! border border-border px-3 py-2 text-sm"
                >
                  {formatTransferRouteEndpoint(route.from) || "—"}{" "}
                  →{" "}
                  {formatTransferRouteEndpoint(route.to) || "—"}
                </div>
              ))}
          </div>
          {option.transferCost > 0 ? (
            <p className="text-sm font-medium">
              Transfer cost: {formatQuotationMoney(option.transferCost, currency)}
            </p>
          ) : null}
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
          <Receipt className="size-4 text-brand-primary" />
          Package breakdown
        </h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="py-2 text-left font-semibold">Description</th>
              <th className="py-2 text-right font-semibold">Per person</th>
            </tr>
          </thead>
          <tbody>
            {isFlightSectionExported(option) ? (
              <tr className="border-b border-border/60">
                <td className="py-3">Flight services</td>
                <td className="py-3 text-right font-medium">
                  {formatQuotationMoney(option.flightAdult, currency)}
                </td>
              </tr>
            ) : null}
            {hasGroundServicesInExport(option) ? (
              <tr className="border-b border-border/60">
                <td className="py-3">Ground services & visas</td>
                <td className="py-3 text-right font-medium">
                  {formatQuotationMoney(totals.perPersonServiceCost, currency)}
                </td>
              </tr>
            ) : null}
            <tr className="border-b border-border/60">
              <td className="py-3">Markup</td>
              <td className="py-3 text-right font-medium">
                {formatQuotationMoney(option.markupPerPerson, currency)}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td className="pt-4 font-bold">Total per adult</td>
              <td className="pt-4 text-right text-xl font-bold text-brand-primary">
                {formatQuotationMoney(adultGross, currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </section>

      {hasExportableCustomerNote(option) ? (
        <section className="rounded! border border-border bg-muted/20 p-4 text-sm">
          <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Customer notes
          </p>
          <p className="whitespace-pre-line">{option.customerNote.trim()}</p>
        </section>
      ) : null}
    </div>
  );
}
