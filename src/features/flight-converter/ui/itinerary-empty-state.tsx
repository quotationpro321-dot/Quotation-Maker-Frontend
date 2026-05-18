import { Plane } from "lucide-react";

export function ItineraryEmptyState() {
  return (
    <div className="rounded! border border-dashed border-border bg-card py-16 text-center">
      <div className="mb-4 inline-flex size-16 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary ring-1 ring-brand-primary/20">
        <Plane className="size-8" />
      </div>
      <h3 className="text-xl font-semibold">Ready to convert?</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Paste your GDS itinerary above, then click Convert to generate a client-ready table.
      </p>
    </div>
  );
}
