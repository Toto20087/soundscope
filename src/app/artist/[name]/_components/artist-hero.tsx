"use client";

import { Share2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import type { Artist } from "@/lib/types";

interface ArtistHeroProps {
  artist: Artist;
  albumCount: number;
}

export function ArtistHero({ artist, albumCount }: ArtistHeroProps) {
  const hasImage =
    artist.image &&
    !artist.image.includes("2a96cbd8b46e442fc41c2b86b821562f");

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${artist.name} | SoundScope`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {
      // cancelled
    }
  };

  return (
    <section className="relative min-h-[870px] flex flex-col justify-end pb-20 pt-32">
      {/* Background image */}
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl md:rounded-lg">
        {hasImage ? (
          <img
            src={artist.image!}
            alt=""
            className="w-full h-full object-cover opacity-90 brightness-75 grayscale contrast-125"
            aria-hidden="true"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f9f9] via-transparent to-transparent" />
      </div>

      {/* Share button */}
      <button
        onClick={handleShare}
        className="absolute top-8 right-8 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        aria-label="Share artist profile"
      >
        <Share2 className="w-5 h-5 text-zinc-600" />
      </button>

      {/* Content */}
      <div className="space-y-6">
        {/* Genre pills */}
        {artist.tags.length > 0 && (
          <div className="flex gap-2">
            {artist.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase text-white transition-colors duration-300"
                style={{ backgroundColor: "var(--accent-hex)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Artist name */}
        <h1 className="font-heading font-black text-7xl md:text-9xl text-text-primary tracking-tighter leading-none">
          {artist.name}
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-12 pt-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-text-tertiary font-bold opacity-60">
              Monthly Listeners
            </span>
            <span className="font-heading text-4xl font-black">
              {formatNumber(artist.listeners)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-text-tertiary font-bold opacity-60">
              Total Plays
            </span>
            <span className="font-heading text-4xl font-black">
              {formatNumber(artist.playcount)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-text-tertiary font-bold opacity-60">
              Studio Albums
            </span>
            <span className="font-heading text-4xl font-black">
              {albumCount}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
