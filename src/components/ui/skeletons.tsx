import { cn } from "@/lib/utils";

function Pulse({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse rounded-lg bg-white/10", className)} />
  );
}

export function ArtistHeroSkeleton() {
  return (
    <div className="relative w-full">
      {/* Banner background */}
      <Pulse className="h-64 w-full rounded-none" />

      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Avatar */}
          <Pulse className="w-40 h-40 rounded-2xl shrink-0" />

          <div className="flex-1 space-y-4 pt-4">
            {/* Name */}
            <Pulse className="h-10 w-64" />
            {/* Tags */}
            <div className="flex gap-2">
              <Pulse className="h-6 w-16 rounded-full" />
              <Pulse className="h-6 w-20 rounded-full" />
              <Pulse className="h-6 w-14 rounded-full" />
            </div>
            {/* Stats */}
            <div className="flex gap-4">
              <Pulse className="h-20 w-32 rounded-2xl" />
              <Pulse className="h-20 w-32 rounded-2xl" />
              <Pulse className="h-20 w-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TrackListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          {/* Rank */}
          <Pulse className="h-5 w-8" />
          {/* Album art */}
          <Pulse className="h-12 w-12 rounded-md shrink-0" />
          {/* Track info */}
          <div className="flex-1 space-y-2">
            <Pulse className="h-4 w-48" />
            <Pulse className="h-3 w-24" />
          </div>
          {/* Duration */}
          <Pulse className="h-4 w-12" />
          {/* Popularity bar */}
          <Pulse className="h-1 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="space-y-6">
      {/* Timeline line */}
      <div className="flex items-center gap-4 overflow-hidden py-8">
        <Pulse className="h-[2px] flex-1 rounded-full" />
      </div>
      {/* Timeline nodes */}
      <div className="flex gap-8 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <Pulse className="w-12 h-12 rounded-full" />
            <Pulse className="h-3 w-20" />
            <Pulse className="h-3 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      {/* Toggle pills */}
      <div className="flex gap-2">
        <Pulse className="h-8 w-24 rounded-full" />
        <Pulse className="h-8 w-20 rounded-full" />
        <Pulse className="h-8 w-20 rounded-full" />
      </div>
      {/* Chart area */}
      <Pulse className="h-[300px] w-full rounded-xl" />
    </div>
  );
}

export function AlbumCardSkeleton() {
  return (
    <div className="space-y-3">
      <Pulse className="aspect-square w-full rounded-xl" />
      <Pulse className="h-4 w-3/4" />
      <Pulse className="h-3 w-1/2" />
    </div>
  );
}

export function FunFactsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Pulse key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}
