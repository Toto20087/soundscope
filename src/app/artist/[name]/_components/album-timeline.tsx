"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/ui/safe-image";
import { formatNumber } from "@/lib/utils";
import { ALBUM_TYPE_COLORS } from "@/lib/constants";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import type { Album } from "@/lib/types";

interface AlbumTimelineProps {
  albums: Album[];
  artistName: string;
}

export function AlbumTimeline({ albums, artistName }: AlbumTimelineProps) {
  const [filter, setFilter] = useState<"all" | "album">("all");
  const isDesktop = useIsDesktop();

  const filteredAlbums =
    filter === "album"
      ? albums.filter(
          (a) =>
            a.albumType === "Album" ||
            a.albumType === null ||
            a.albumType === "EP"
        )
      : albums;

  const maxPlaycount = Math.max(...filteredAlbums.map((a) => a.playcount), 1);

  return (
    <div className="space-y-4">
      {/* Filter Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-accent-purple text-white"
              : "bg-white/5 text-text-secondary hover:bg-white/10"
          }`}
        >
          All Releases
        </button>
        <button
          onClick={() => setFilter("album")}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            filter === "album"
              ? "bg-accent-purple text-white"
              : "bg-white/5 text-text-secondary hover:bg-white/10"
          }`}
        >
          Studio Albums
        </button>
      </div>

      {isDesktop ? (
        <HorizontalTimeline
          albums={filteredAlbums}
          artistName={artistName}
          maxPlaycount={maxPlaycount}
        />
      ) : (
        <VerticalTimeline
          albums={filteredAlbums}
          artistName={artistName}
          maxPlaycount={maxPlaycount}
        />
      )}
    </div>
  );
}

// ============================================================
// Horizontal Timeline (Desktop)
// ============================================================

function HorizontalTimeline({
  albums,
  artistName,
  maxPlaycount,
}: {
  albums: Album[];
  artistName: string;
  maxPlaycount: number;
}) {
  return (
    <div className="relative overflow-x-auto pb-4 scrollbar-thin">
      <div className="flex items-end gap-0 min-w-max pt-4 pb-2 px-4">
        {/* Timeline line */}
        <div className="absolute bottom-[72px] left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-accent-purple/30 to-transparent" />

        {albums.map((album, i) => {
          const nodeSize = getNodeSize(album.playcount, maxPlaycount);
          const color =
            ALBUM_TYPE_COLORS[album.albumType || "Album"] || ALBUM_TYPE_COLORS.Album;
          const isTopAlbum =
            album.playcount === maxPlaycount && albums.length > 1;

          return (
            <motion.div
              key={album.name}
              className="flex flex-col items-center mx-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", damping: 20 }}
            >
              {/* Year label */}
              <span className="text-xs font-mono text-text-tertiary mb-2">
                {album.releaseYear || "???"}
              </span>

              {/* Album art tooltip on hover */}
              <Link
                href={`/artist/${encodeURIComponent(artistName)}/album/${encodeURIComponent(album.name)}`}
                className="group relative"
              >
                {/* Node */}
                <motion.div
                  className="rounded-full border-2 relative z-10 cursor-pointer"
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    backgroundColor: color,
                    borderColor: `${color}80`,
                    opacity: album.albumType === "Compilation" ? 0.5 : 1,
                  }}
                  whileHover={{ scale: 1.3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isTopAlbum && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        backgroundColor: color,
                        opacity: 0.3,
                      }}
                    />
                  )}
                </motion.div>

                {/* Hover card */}
                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20">
                  <div className="bg-bg-secondary/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl min-w-[180px]">
                    <div className="flex gap-3">
                      {album.image && (
                        <SafeImage
                          src={album.image}
                          alt={album.name}
                          width={56}
                          height={56}
                          className="rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-text-primary truncate max-w-[120px]">
                          {album.name}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {album.releaseYear || "Year unknown"}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {formatNumber(album.playcount)} plays
                        </p>
                        {album.albumType && (
                          <p className="text-xs text-text-tertiary">
                            {album.albumType}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Album name below */}
              <span className="text-xs text-text-secondary text-center mt-2 max-w-[80px] truncate">
                {album.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Vertical Timeline (Mobile)
// ============================================================

function VerticalTimeline({
  albums,
  artistName,
  maxPlaycount,
}: {
  albums: Album[];
  artistName: string;
  maxPlaycount: number;
}) {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-gradient-to-b from-accent-purple/30 via-accent-purple/20 to-transparent" />

      <div className="space-y-6">
        {albums.map((album, i) => {
          const nodeSize = getNodeSize(album.playcount, maxPlaycount);
          const color =
            ALBUM_TYPE_COLORS[album.albumType || "Album"] || ALBUM_TYPE_COLORS.Album;

          return (
            <motion.div
              key={album.name}
              className="relative flex items-start gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Node on the line */}
              <div
                className="absolute -left-8 top-3 rounded-full shrink-0 z-10"
                style={{
                  width: Math.max(nodeSize * 0.6, 12),
                  height: Math.max(nodeSize * 0.6, 12),
                  backgroundColor: color,
                  marginLeft: -(Math.max(nodeSize * 0.6, 12) - 6) / 2,
                }}
              />

              {/* Card */}
              <Link
                href={`/artist/${encodeURIComponent(artistName)}/album/${encodeURIComponent(album.name)}`}
                className="glass rounded-xl p-4 flex gap-4 flex-1 hover:bg-white/[0.08] transition-colors"
              >
                {album.image && (
                  <SafeImage
                    src={album.image}
                    alt={album.name}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {album.name}
                  </p>
                  <p className="text-sm text-text-tertiary">
                    {album.releaseYear || "Year unknown"}
                    {album.albumType && ` · ${album.albumType}`}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {formatNumber(album.playcount)} plays
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================

function getNodeSize(playcount: number, maxPlaycount: number): number {
  const MIN_SIZE = 28;
  const MAX_SIZE = 52;
  const ratio = maxPlaycount > 0 ? playcount / maxPlaycount : 0;
  return MIN_SIZE + ratio * (MAX_SIZE - MIN_SIZE);
}
