import Link from "next/link";
import type { SimilarArtist } from "@/lib/types";

interface SimilarArtistsProps {
  artists: SimilarArtist[];
}

export function SimilarArtists({ artists }: SimilarArtistsProps) {
  if (artists.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {artists.map((artist) => (
        <Link
          key={artist.name}
          href={`/artist/${encodeURIComponent(artist.name)}`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-text-secondary hover:bg-white/10 hover:text-text-primary transition-all"
        >
          {artist.name}
        </Link>
      ))}
    </div>
  );
}
