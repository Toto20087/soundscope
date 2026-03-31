"use client";

import { formatNumber } from "@/lib/utils";
import type { Album } from "@/lib/types";

interface AlbumComparisonChartProps {
  albums: Album[];
}

export function AlbumComparisonChart({ albums }: AlbumComparisonChartProps) {
  const sorted = [...albums]
    .map((a) => ({
      name: a.name,
      image: a.image,
      value: a.playcount,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const maxValue = sorted.length > 0 ? sorted[0].value : 1;

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-4xl font-black tracking-tight">Album Comparison</h2>
      {sorted.map((album) => {
        const percentage = maxValue > 0 ? Math.round((album.value / maxValue) * 100) : 0;
        return (
          <div key={album.name} className="flex items-center gap-6">
            {album.image ? (
              <img
                src={album.image}
                alt={album.name}
                className="w-12 h-12 rounded-lg shadow-md object-cover shrink-0"
                loading="lazy"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-zinc-200 shrink-0" />
            )}

            <div className="flex-grow">
              <div
                className="h-10 rounded-full flex items-center px-4 relative overflow-hidden"
                style={{ backgroundColor: "rgba(var(--accent-rgb), 0.1)" }}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: "var(--accent-hex)",
                  }}
                />
                <span className="relative z-10 text-white font-bold text-sm">
                  {album.name.length > 30 ? album.name.substring(0, 28) + "..." : album.name}
                  {" — "}
                  {formatNumber(album.value)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
