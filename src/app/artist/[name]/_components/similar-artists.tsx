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
          className="inline-flex items-center px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm text-text-secondary hover:bg-gray-100 hover:text-text-primary transition-all"
        >
          {artist.name}
        </Link>
      ))}
    </div>
  );
}
