import { Header } from "@/components/layout/header";
import {
  ArtistHeroSkeleton,
  TimelineSkeleton,
  TrackListSkeleton,
  ChartSkeleton,
  FunFactsSkeleton,
} from "@/components/ui/skeletons";

export default function ArtistLoading() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ArtistHeroSkeleton />

        <div className="max-w-6xl mx-auto px-4 space-y-16 py-12">
          {/* Bio skeleton */}
          <div className="space-y-3">
            <div className="h-7 w-32 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-24 w-full rounded-2xl bg-gray-200 animate-pulse" />
          </div>

          {/* Timeline skeleton */}
          <div className="space-y-3">
            <div className="h-7 w-48 rounded-lg bg-gray-200 animate-pulse" />
            <TimelineSkeleton />
          </div>

          {/* Chart skeleton */}
          <ChartSkeleton />

          {/* Tracks skeleton */}
          <div className="space-y-3">
            <div className="h-7 w-32 rounded-lg bg-gray-200 animate-pulse" />
            <TrackListSkeleton count={10} />
          </div>

          {/* Fun facts skeleton */}
          <FunFactsSkeleton />
        </div>
      </main>
    </>
  );
}
