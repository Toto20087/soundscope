"use client";

import { useState } from "react";
import Link from "next/link";
import { formatNumber } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import type { Album } from "@/lib/types";

interface AlbumTimelineProps {
  albums: Album[];
  artistName: string;
}

export function AlbumTimeline({ albums, artistName }: AlbumTimelineProps) {
  const [filter, setFilter] = useState<"all" | "album">("all");
  const isDesktop = useIsDesktop();

  const datedAlbums = albums.filter((a) => a.releaseYear !== null);
  const filteredAlbums =
    filter === "album"
      ? datedAlbums.filter((a) => a.albumType === "Album" || a.albumType === null || a.albumType === "EP")
      : datedAlbums;

  const maxPlaycount = Math.max(...filteredAlbums.map((a) => a.playcount), 1);

  return (
    <div className="space-y-8">
      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "album"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f ? "text-white" : "bg-zinc-100 text-text-secondary hover:bg-zinc-200"
            }`}
            style={filter === f ? { backgroundColor: "var(--accent-hex)" } : undefined}
          >
            {f === "all" ? "All Releases" : "Studio Albums"}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        {isDesktop && (
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-zinc-200 -z-0" />
        )}

        <div className="flex overflow-x-auto gap-8 md:gap-12 pb-8 pt-4 no-scrollbar relative z-10 snap-x">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

          {filteredAlbums.map((album) => {
            const ratio = maxPlaycount > 0 ? album.playcount / maxPlaycount : 0;
            const isTop = album.playcount === maxPlaycount && filteredAlbums.length > 1;
            // Size varies: w-48 to w-80 based on popularity
            const width = Math.round(192 + ratio * 128);

            return (
              <Link
                key={album.name}
                href={`/artist/${encodeURIComponent(artistName)}/album/${encodeURIComponent(album.name)}`}
                className="flex-shrink-0 snap-center group"
                style={{ width }}
              >
                <div
                  className={`aspect-square bg-zinc-200 rounded-[2rem] overflow-hidden transition-transform hover:scale-105 duration-500 ${
                    isTop
                      ? "shadow-2xl border-4 transition-colors duration-300"
                      : "shadow-xl"
                  }`}
                  style={isTop ? { borderColor: "var(--accent-hex)", boxShadow: `0 25px 50px -12px rgba(var(--accent-rgb), 0.3)` } : { boxShadow: `0 25px 50px -12px rgba(var(--accent-rgb), 0.05)` }}
                >
                  {album.image ? (
                    <img
                      src={album.image}
                      alt={album.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-300 flex items-center justify-center text-zinc-500 text-sm">
                      No Cover
                    </div>
                  )}
                </div>
                <div className="mt-6 text-center">
                  <h3 className="font-heading font-bold text-lg truncate px-2">{album.name}</h3>
                  <p className="text-xs uppercase tracking-widest opacity-60 mt-1">{album.releaseYear}</p>
                  <p className="text-xs text-text-tertiary mt-1">{formatNumber(album.playcount)} plays</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
