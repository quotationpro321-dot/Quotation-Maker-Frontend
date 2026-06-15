import { cn } from "@/lib/utils";

type TQuotationFlightItineraryImagePreviewProps = {
  src: string;
  alt?: string;
  className?: string;
  maxWidthPx?: number;
};

export function QuotationFlightItineraryImagePreview({
  src,
  alt = "Flight itinerary",
  className,
  maxWidthPx,
}: TQuotationFlightItineraryImagePreviewProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URLs for PDF export
    <img
      src={src}
      alt={alt}
      className={cn("mx-auto block h-auto max-w-full object-contain", className)}
      style={maxWidthPx ? { maxWidth: maxWidthPx } : undefined}
    />
  );
}
