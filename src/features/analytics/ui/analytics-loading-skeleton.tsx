import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-72 rounded!" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded!" />
        ))}
      </div>
      <Skeleton className="h-[320px] rounded!" />
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[320px] rounded! xl:col-span-5" />
        <Skeleton className="h-[320px] rounded! xl:col-span-7" />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[320px] rounded! xl:col-span-5" />
        <Skeleton className="h-[320px] rounded! xl:col-span-7" />
      </div>
      <Skeleton className="h-64 rounded!" />
    </div>
  );
}
