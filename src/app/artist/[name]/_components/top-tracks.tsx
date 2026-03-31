import { formatNumber } from "@/lib/utils";
import type { Track } from "@/lib/types";

interface TopTracksProps {
  tracks: Track[];
  artistName: string;
}

export function TopTracks({ tracks, artistName }: TopTracksProps) {
  const maxPlaycount = tracks.length > 0 ? tracks[0].playcount : 1;

  return (
    <div className="space-y-4">
      {tracks.map((track, i) => {
        const percentage = maxPlaycount > 0 ? Math.round((track.playcount / maxPlaycount) * 100) : 0;
        const rank = String(i + 1).padStart(2, "0");

        return (
          <a
            key={track.name}
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-8 py-6 group hover:bg-zinc-50 transition-colors px-6 rounded-[2rem]"
          >
            {/* Rank number — large, faded */}
            <span className="font-heading text-5xl font-black text-zinc-300 w-16 shrink-0">
              {rank}
            </span>

            {/* Track info + bar */}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-3">
                <h4 className="font-heading text-xl font-bold truncate">{track.name}</h4>
                {track.albumName && (
                  <span className="bg-zinc-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shrink-0">
                    {track.albumName.length > 15 ? track.albumName.substring(0, 13) + "..." : track.albumName}
                  </span>
                )}
              </div>
              <div className="mt-3 w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: "var(--accent-hex)",
                  }}
                />
              </div>
            </div>

            {/* Play count — right side */}
            <div className="text-right shrink-0">
              <span className="font-heading text-lg font-black">{formatNumber(track.playcount)}</span>
              <p className="text-[10px] uppercase opacity-40 font-bold">Plays</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
