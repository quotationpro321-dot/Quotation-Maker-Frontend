import { Skeleton } from "@/components/ui/skeleton";

export function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36 rounded!" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[360px] rounded! xl:col-span-8" />
        <Skeleton className="h-[360px] rounded! xl:col-span-4" />
      </div>
      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-64 rounded! xl:col-span-5" />
        <Skeleton className="h-64 rounded! xl:col-span-7" />
      </div>
    </div>
  );
}
