import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-stone-200",
        className
      )}
    />
  );
}

export function TestCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function LabCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-start gap-3">
        <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <Skeleton className="h-5 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-3" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export { Skeleton };
