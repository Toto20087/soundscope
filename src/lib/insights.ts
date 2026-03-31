import type { Album, Track } from "./types";

// ============================================================
// Track Duration Statistics
// ============================================================

export interface DurationStats {
  mean: number;
  median: number;
  shortest: { name: string; duration: number };
  longest: { name: string; duration: number };
  outliers: Array<{ name: string; duration: number; type: "long" | "short" }>;
}

/**
 * Calculate track duration statistics with IQR-based outlier detection.
 */
export function getTrackDurationStats(
  tracks: Array<{ name: string; duration: number | null }>
): DurationStats | null {
  const valid = tracks
    .filter((t) => t.duration && t.duration > 0)
    .map((t) => ({ name: t.name, duration: t.duration! }));

  if (valid.length < 4) return null;

  const sorted = [...valid].sort((a, b) => a.duration - b.duration);
  const durations = sorted.map((t) => t.duration);

  const mean = durations.reduce((s, d) => s + d, 0) / durations.length;
  const mid = Math.floor(durations.length / 2);
  const median =
    durations.length % 2 === 0
      ? (durations[mid - 1] + durations[mid]) / 2
      : durations[mid];

  // IQR outlier detection
  const q1 = durations[Math.floor(durations.length * 0.25)];
  const q3 = durations[Math.floor(durations.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const outliers = valid
    .filter((t) => t.duration < lowerBound || t.duration > upperBound)
    .map((t) => ({
      name: t.name,
      duration: t.duration,
      type: (t.duration > upperBound ? "long" : "short") as "long" | "short",
    }));

  return {
    mean,
    median,
    shortest: sorted[0],
    longest: sorted[sorted.length - 1],
    outliers,
  };
}

// ============================================================
// Genre Evolution Over Time
// ============================================================

export interface GenreTimelineEntry {
  year: number;
  albumName: string;
  tags: string[];
}

/**
 * Extract genre evolution from albums with dates.
 */
export function getGenreEvolution(albums: Album[]): GenreTimelineEntry[] {
  return albums
    .filter((a) => a.releaseYear && a.tags && a.tags.length > 0)
    .sort((a, b) => (a.releaseYear || 0) - (b.releaseYear || 0))
    .map((a) => ({
      year: a.releaseYear!,
      albumName: a.name,
      tags: a.tags!.slice(0, 3),
    }));
}

// ============================================================
// Popularity Distribution
// ============================================================

export interface PopularitySlice {
  name: string;
  playcount: number;
  percentage: number;
}

/**
 * Calculate how plays are distributed across albums.
 */
export function getPopularityDistribution(albums: Album[]): PopularitySlice[] {
  const total = albums.reduce((s, a) => s + a.playcount, 0);
  if (total === 0) return [];

  return albums
    .filter((a) => a.playcount > 0)
    .sort((a, b) => b.playcount - a.playcount)
    .slice(0, 8) // Top 8 for readability
    .map((a) => ({
      name: a.name.length > 20 ? a.name.substring(0, 18) + "..." : a.name,
      playcount: a.playcount,
      percentage: Math.round((a.playcount / total) * 100),
    }));
}

// ============================================================
// Album Radar Metrics (normalized 0-100)
// ============================================================

export interface RadarMetric {
  metric: string;
  value: number;
  fullMark: number;
}

/**
 * Calculate meaningful artist profile metrics (0-100 scale).
 * Uses data we can actually derive from Last.fm + MusicBrainz.
 */
export function getAlbumRadarData(albums: Album[]): RadarMetric[] | null {
  if (albums.length < 2) return null;

  const maxPlaycount = Math.max(...albums.map((a) => a.playcount));
  const maxTracks = Math.max(
    ...albums.map((a) => a.trackCount || 0).filter(Boolean)
  );
  const maxDuration = Math.max(
    ...albums.map((a) => a.totalDuration || 0).filter(Boolean)
  );
  const maxListeners = Math.max(
    ...albums.map((a) => a.listeners || 0).filter(Boolean)
  );

  const avgPlaycount =
    albums.reduce((s, a) => s + a.playcount, 0) / albums.length;
  const avgTracks =
    albums.reduce((s, a) => s + (a.trackCount || 0), 0) / albums.length;
  const avgDuration =
    albums.reduce((s, a) => s + (a.totalDuration || 0), 0) / albums.length;
  const avgListeners =
    albums.reduce((s, a) => s + (a.listeners || 0), 0) / albums.length;

  // Consistency: how evenly distributed are plays across albums? (high = even, low = one-hit)
  const playVariance = albums.length > 1
    ? 1 - (Math.max(...albums.map(a => a.playcount)) / albums.reduce((s, a) => s + a.playcount, 0))
    : 0.5;

  // Longevity: career span in years (capped at 30)
  const datedAlbums = albums.filter(a => a.releaseYear);
  const careerSpan = datedAlbums.length >= 2
    ? Math.max(...datedAlbums.map(a => a.releaseYear!)) - Math.min(...datedAlbums.map(a => a.releaseYear!))
    : 0;

  // Prolificacy: albums per decade
  const albumsPerDecade = careerSpan > 0 ? (albums.length / careerSpan) * 10 : albums.length;

  // Genre range: how many unique tags across all albums
  const allTags = new Set(albums.flatMap(a => a.tags || []));

  return [
    {
      metric: "Reach",
      value: maxListeners > 0 ? Math.round((avgListeners / maxListeners) * 100) : 0,
      fullMark: 100,
    },
    {
      metric: "Prolificacy",
      value: Math.min(Math.round(albumsPerDecade * 15), 100),
      fullMark: 100,
    },
    {
      metric: "Depth",
      value: maxTracks > 0 ? Math.round((avgTracks / maxTracks) * 100) : 0,
      fullMark: 100,
    },
    {
      metric: "Consistency",
      value: Math.round(playVariance * 100),
      fullMark: 100,
    },
    {
      metric: "Longevity",
      value: Math.min(Math.round((careerSpan / 25) * 100), 100),
      fullMark: 100,
    },
    {
      metric: "Versatility",
      value: Math.min(Math.round((allTags.size / 8) * 100), 100),
      fullMark: 100,
    },
  ];
}

// ============================================================
// Duration Distribution for scatter chart
// ============================================================

export interface DurationPoint {
  name: string;
  duration: number; // minutes
  playcount: number;
  isOutlier: boolean;
}

/**
 * Prepare track data for scatter/dot chart showing duration distribution.
 */
export function getDurationDistribution(
  tracks: Track[],
  albums: Album[]
): DurationPoint[] {
  // Try to get durations from album tracks
  const allTracks: DurationPoint[] = [];

  for (const album of albums) {
    if (!album.tracks) continue;
    for (const track of album.tracks) {
      if (track.duration && track.duration > 0) {
        allTracks.push({
          name:
            track.name.length > 25
              ? track.name.substring(0, 23) + "..."
              : track.name,
          duration: Math.round((track.duration / 60) * 10) / 10,
          playcount: track.playcount || 0,
          isOutlier: false,
        });
      }
    }
  }

  if (allTracks.length < 4) return allTracks;

  // Mark outliers
  const durations = allTracks.map((t) => t.duration).sort((a, b) => a - b);
  const q1 = durations[Math.floor(durations.length * 0.25)];
  const q3 = durations[Math.floor(durations.length * 0.75)];
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;

  return allTracks.map((t) => ({
    ...t,
    isOutlier: t.duration < lower || t.duration > upper,
  }));
}

// ============================================================
// Album Popularity Over Time (Area/Line chart)
// ============================================================

export interface PopularityTimelinePoint {
  year: number;
  name: string;
  playcount: number;
  listeners: number;
}

/**
 * Album popularity ordered chronologically — shows the career arc.
 */
export function getPopularityTimeline(albums: Album[]): PopularityTimelinePoint[] {
  return albums
    .filter((a) => a.releaseYear !== null && a.playcount > 0)
    .sort((a, b) => (a.releaseYear || 0) - (b.releaseYear || 0))
    .map((a) => ({
      year: a.releaseYear!,
      name: a.name.length > 18 ? a.name.substring(0, 16) + "..." : a.name,
      playcount: a.playcount,
      listeners: a.listeners || 0,
    }));
}

// ============================================================
// Listeners vs Plays (Replay Value scatter)
// ============================================================

export interface ReplayValuePoint {
  name: string;
  listeners: number;
  playcount: number;
  replayRatio: number; // plays per listener
  image: string | null;
}

/**
 * Each album as a point: listeners (X) vs plays (Y).
 * High replay ratio = dedicated fanbase. Low = broad but shallow reach.
 */
export function getReplayValueData(albums: Album[]): ReplayValuePoint[] {
  return albums
    .filter((a) => (a.listeners || 0) > 0 && a.playcount > 0)
    .map((a) => ({
      name: a.name.length > 20 ? a.name.substring(0, 18) + "..." : a.name,
      listeners: a.listeners || 0,
      playcount: a.playcount,
      replayRatio: Math.round((a.playcount / (a.listeners || 1)) * 10) / 10,
      image: a.image,
    }))
    .sort((a, b) => b.playcount - a.playcount);
}

// ============================================================
// Top Track Concentration
// ============================================================

export interface TrackConcentration {
  topTracksPlays: number;
  restPlays: number;
  topPercentage: number;
  totalPlays: number;
  isHitsArtist: boolean; // top 5 tracks > 60% of total
}

/**
 * What % of total plays comes from the top 5 tracks vs the rest.
 */
export function getTrackConcentration(
  topTracks: Track[],
  albums: Album[]
): TrackConcentration | null {
  if (topTracks.length < 5) return null;

  const top5Plays = topTracks.slice(0, 5).reduce((s, t) => s + t.playcount, 0);
  const totalAlbumPlays = albums.reduce((s, a) => s + a.playcount, 0);

  // Use whichever is larger as the denominator
  const totalPlays = Math.max(top5Plays, totalAlbumPlays);
  if (totalPlays === 0) return null;

  const topPercentage = Math.round((top5Plays / totalPlays) * 100);

  return {
    topTracksPlays: top5Plays,
    restPlays: Math.max(0, totalPlays - top5Plays),
    topPercentage: Math.min(topPercentage, 100),
    totalPlays,
    isHitsArtist: topPercentage > 60,
  };
}
