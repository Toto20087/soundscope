import { PopularityBar } from "@/components/ui/popularity-bar";
import { formatNumber } from "@/lib/utils";
import type { Track } from "@/lib/types";

interface TopTracksProps {
  tracks: Track[];
  artistName: string;
}

export function TopTracks({ tracks }: TopTracksProps) {
  const maxPlaycount = tracks.length > 0 ? tracks[0].playcount : 1;

  return (
    <div className="space-y-1">
      {tracks.map((track, i) => (
        <div
          key={track.name}
          className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
        >
          {/* Rank */}
          <span className="w-8 text-right text-sm font-mono text-text-tertiary">
            {track.rank || i + 1}
          </span>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate group-hover:text-white transition-colors">
              {track.name}
            </p>
            <p className="text-xs text-text-tertiary">
              {formatNumber(track.playcount)} plays
            </p>
          </div>

          {/* Popularity bar */}
          <PopularityBar
            value={track.playcount}
            max={maxPlaycount}
            className="hidden sm:flex"
          />
        </div>
      ))}

      {tracks.length === 0 && (
        <p className="text-text-tertiary text-sm text-center py-8">
          No tracks found for this artist.
        </p>
      )}
    </div>
  );
}
