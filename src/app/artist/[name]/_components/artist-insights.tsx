"use client";

import dynamic from "next/dynamic";
import { ChartSkeleton } from "@/components/ui/skeletons";
import type { Album, Track } from "@/lib/types";
import {
  getPopularityDistribution,
  getAlbumRadarData,
  getDurationDistribution,
  getGenreEvolution,
  getPopularityTimeline,
  getReplayValueData,
  getTrackConcentration,
} from "@/lib/insights";

const LazyPieChart = dynamic(
  () => import("@/components/charts/pie-chart-wrapper").then((m) => ({ default: m.PieChartWrapperInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyRadarChart = dynamic(
  () => import("@/components/charts/radar-chart-wrapper").then((m) => ({ default: m.RadarChartWrapperInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyScatterChart = dynamic(
  () => import("@/components/charts/scatter-chart-wrapper").then((m) => ({ default: m.ScatterChartWrapperInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyBarChart = dynamic(
  () => import("@/components/charts/bar-chart-wrapper").then((m) => ({ default: m.BarChartWrapperInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyPopularityTimeline = dynamic(
  () => import("@/components/charts/popularity-timeline-chart").then((m) => ({ default: m.PopularityTimelineChartInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyReplayValue = dynamic(
  () => import("@/components/charts/replay-value-chart").then((m) => ({ default: m.ReplayValueChartInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const LazyTrackConcentration = dynamic(
  () => import("@/components/charts/track-concentration-chart").then((m) => ({ default: m.TrackConcentrationChartInner })),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

interface ArtistInsightsProps {
  albums: Album[];
  topTracks: Track[];
}

export function ArtistInsights({ albums, topTracks }: ArtistInsightsProps) {
  const popularityData = getPopularityDistribution(albums);
  const radarData = getAlbumRadarData(albums);
  const durationData = getDurationDistribution(topTracks, albums);
  const genreData = getGenreEvolution(albums);
  const timelineData = getPopularityTimeline(albums);
  const replayData = getReplayValueData(albums);
  const concentrationData = getTrackConcentration(topTracks, albums);

  const hasAnyData =
    popularityData.length > 0 || radarData !== null || timelineData.length > 0;

  if (!hasAnyData) return null;

  const avgDuration =
    durationData.length > 0
      ? Math.round((durationData.reduce((s, d) => s + d.duration, 0) / durationData.length) * 10) / 10
      : undefined;

  const genreChartData = genreData.map((g) => ({
    name: `${g.albumName.substring(0, 12)}${g.albumName.length > 12 ? "..." : ""} (${g.year})`,
    genres: g.tags.length,
  }));

  // Build chart list dynamically so we can ensure pairs fill rows
  const charts: Array<{ key: string; span: 1 | 2; node: React.ReactNode }> = [];

  // Row 1: Career Arc — always full width
  if (timelineData.length > 2) {
    charts.push({
      key: "career-arc", span: 2,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Career Arc</h3>
          <p className="text-xs text-text-tertiary mb-6">Album popularity over time — the rise, peak, and evolution</p>
          <LazyPopularityTimeline data={timelineData} color="var(--accent-hex)" />
        </div>
      ),
    });
  }

  // Row 2: Pie + Radar
  if (popularityData.length > 0) {
    charts.push({
      key: "popularity", span: 1,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Popularity Distribution</h3>
          <p className="text-xs text-text-tertiary mb-4">How plays are spread across albums</p>
          <LazyPieChart data={popularityData.map((d) => ({ name: d.name, value: d.playcount }))} accentColor="var(--accent-hex)" />
        </div>
      ),
    });
  }

  if (radarData) {
    charts.push({
      key: "radar", span: 1,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Artist Profile</h3>
          <p className="text-xs text-text-tertiary mb-4">Reach, consistency, versatility, and more (0-100)</p>
          <LazyRadarChart data={radarData} height={280} color="var(--accent-hex)" />
        </div>
      ),
    });
  }

  // Row 3: Replay Value + Track Concentration
  if (replayData.length > 2) {
    charts.push({
      key: "replay", span: 1,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Replay Value</h3>
          <p className="text-xs text-text-tertiary mb-4">Listeners vs plays — bigger dots = higher replay ratio</p>
          <LazyReplayValue data={replayData} color="var(--accent-hex)" />
        </div>
      ),
    });
  }

  if (concentrationData) {
    charts.push({
      key: "concentration", span: 1,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Track Concentration</h3>
          <p className="text-xs text-text-tertiary mb-4">Top 5 tracks vs the rest of the catalog</p>
          <LazyTrackConcentration topPercentage={concentrationData.topPercentage} topPlays={concentrationData.topTracksPlays} restPlays={concentrationData.restPlays} isHitsArtist={concentrationData.isHitsArtist} color="var(--accent-hex)" />
        </div>
      ),
    });
  }

  // Row 4: Duration + Genre — or expand if one is missing
  if (durationData.length > 4) {
    charts.push({
      key: "duration", span: 1,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Track Duration</h3>
          <p className="text-xs text-text-tertiary mb-4">Each dot is a track. <span className="text-error font-medium">Red = outlier</span></p>
          <LazyScatterChart data={durationData} averageDuration={avgDuration} height={250} color="var(--accent-hex)" />
        </div>
      ),
    });
  }

  if (genreChartData.length > 2) {
    charts.push({
      key: "genre", span: 1,
      node: (
        <div className="bg-zinc-50 p-8 rounded-[2rem]">
          <h3 className="text-sm uppercase font-bold tracking-widest opacity-60 mb-1">Genre Diversity</h3>
          <p className="text-xs text-text-tertiary mb-4">Distinct genres per album over time</p>
          <LazyBarChart data={genreChartData} dataKey="genres" xAxisKey="name" color="var(--accent-hex)" height={250} />
        </div>
      ),
    });
  }

  // Fix orphans: if a span-1 chart would be alone at the end, expand it to full width
  const processed: typeof charts = [];
  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i];
    if (chart.span === 1) {
      // Check if there's a next span-1 to pair with
      const next = charts[i + 1];
      if (next && next.span === 1) {
        processed.push(chart);
        processed.push(next);
        i++; // skip next since we consumed it
      } else {
        // Alone — expand to full width
        processed.push({ ...chart, span: 2 });
      }
    } else {
      processed.push(chart);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {processed.map((chart) => (
        <div key={chart.key} className={chart.span === 2 ? "md:col-span-2" : ""}>
          {chart.node}
        </div>
      ))}
    </div>
  );
}
