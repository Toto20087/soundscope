"use client";

import { ChartContainer } from "@/components/charts/chart-container";
import type { Album } from "@/lib/types";

interface AlbumComparisonChartProps {
  albums: Album[];
}

const METRICS = [
  { key: "playcount", label: "Playcount", color: "#8B5CF6" },
  { key: "listeners", label: "Listeners", color: "#22D3EE" },
  { key: "trackCount", label: "Tracks", color: "#34D399" },
];

export function AlbumComparisonChart({ albums }: AlbumComparisonChartProps) {
  const chartData = albums.map((album) => ({
    name: album.releaseYear
      ? `${album.name.substring(0, 12)}${album.name.length > 12 ? "..." : ""} (${album.releaseYear})`
      : album.name.substring(0, 15),
    playcount: album.playcount,
    listeners: album.listeners || 0,
    trackCount: album.trackCount || 0,
  }));

  return (
    <ChartContainer
      title="Album Comparison"
      data={chartData}
      metrics={METRICS}
      chartType="bar"
    />
  );
}
