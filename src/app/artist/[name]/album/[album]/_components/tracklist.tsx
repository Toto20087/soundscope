import { formatDuration } from "@/lib/utils";
import type { Track } from "@/lib/types";

interface TracklistProps {
  tracks: Track[];
}

export function Tracklist({ tracks }: TracklistProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      {tracks.map((track, i) => (
        <div
          key={track.name}
          className="flex items-center gap-4 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-b-0"
        >
          {/* Track number */}
          <span className="w-8 text-right text-sm font-mono text-text-tertiary">
            {track.rank || i + 1}
          </span>

          {/* Track name */}
          <span className="flex-1 text-sm text-text-primary truncate">
            {track.name}
          </span>

          {/* Duration */}
          <span className="text-sm font-mono text-text-tertiary shrink-0">
            {formatDuration(track.duration)}
          </span>
        </div>
      ))}
    </div>
  );
}
