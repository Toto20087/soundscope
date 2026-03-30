"use client";

import { Users, Headphones, Disc3, Share2 } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { GenreChip } from "@/components/ui/genre-chip";
import { getInitials, formatNumber } from "@/lib/utils";
import type { Artist } from "@/lib/types";

interface ArtistHeroProps {
  artist: Artist;
  albumCount: number;
}

export function ArtistHero({ artist, albumCount }: ArtistHeroProps) {
  const firstAlbumImage = artist.image;

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
      // User cancelled share
    }
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Blurred background */}
      <div className="absolute inset-0">
        {firstAlbumImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${firstAlbumImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-hero-gradient" />
        )}
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-bg-primary/80 to-bg-primary" />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Artist Avatar (initials) */}
          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shrink-0 shadow-[0_0_40px_rgba(139,92,246,0.3)]">
            <span className="text-5xl font-bold text-white font-heading">
              {getInitials(artist.name)}
            </span>
          </div>

          <div className="flex-1 space-y-4">
            {/* Name + Share */}
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl sm:text-5xl font-heading font-bold text-text-primary">
                {artist.name}
              </h1>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors shrink-0"
                aria-label="Share artist profile"
              >
                <Share2 className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Genre Tags */}
            {artist.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artist.tags.map((tag) => (
                  <GenreChip key={tag} genre={tag} />
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <StatCard
                icon={Users}
                value={formatNumber(artist.listeners)}
                label="Listeners"
              />
              <StatCard
                icon={Headphones}
                value={formatNumber(artist.playcount)}
                label="Total Plays"
              />
              <StatCard
                icon={Disc3}
                value={albumCount.toString()}
                label="Albums"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
