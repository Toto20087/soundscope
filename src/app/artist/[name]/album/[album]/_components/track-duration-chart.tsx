"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/skeletons";
import type { Track } from "@/lib/types";

const LazyBarChart = dynamic(
  () =>
    import("@/components/charts/bar-chart-wrapper").then((mod) => ({
      default: mod.BarChartWrapperInner,
    })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface TrackDurationChartProps {
  tracks: Track[];
}

export function TrackDurationChart({ tracks }: TrackDurationChartProps) {
  const chartData = tracks
    .filter((t) => t.duration && t.duration > 0)
    .map((track) => ({
      name: track.name.length > 15
        ? track.name.substring(0, 15) + "..."
        : track.name,
      duration: Math.round((track.duration || 0) / 60 * 10) / 10, // Convert to minutes
    }));

  if (chartData.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-4">
      <LazyBarChart
        data={chartData}
        dataKey="duration"
        xAxisKey="name"
        color="#22D3EE"
        height={250}
      />
    </div>
  );
}
