import { Skeleton } from "@/components/ui/skeleton";

export function QuotationsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-10 w-40 rounded!" />
      </div>
      <div className="space-y-4 rounded! border border-border p-4">
        <Skeleton className="h-10 w-full max-w-md rounded!" />
        <Skeleton className="h-64 w-full rounded!" />
      </div>
    </div>
  );
}
