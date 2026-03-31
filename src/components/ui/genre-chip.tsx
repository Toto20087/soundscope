import { cn } from "@/lib/utils";

interface GenreChipProps {
  genre: string;
  className?: string;
}

const LIGHT_GENRE_COLORS: Record<string, { bg: string; text: string }> = {
  pop: { bg: "bg-purple-50", text: "text-purple-700" },
  rock: { bg: "bg-rose-50", text: "text-rose-700" },
  "r&b": { bg: "bg-cyan-50", text: "text-cyan-700" },
  "hip-hop": { bg: "bg-amber-50", text: "text-amber-700" },
  rap: { bg: "bg-amber-50", text: "text-amber-700" },
  electronic: { bg: "bg-emerald-50", text: "text-emerald-700" },
  jazz: { bg: "bg-sky-50", text: "text-sky-700" },
  metal: { bg: "bg-red-50", text: "text-red-700" },
  indie: { bg: "bg-indigo-50", text: "text-indigo-700" },
  alternative: { bg: "bg-violet-50", text: "text-violet-700" },
  classical: { bg: "bg-yellow-50", text: "text-yellow-700" },
  country: { bg: "bg-orange-50", text: "text-orange-700" },
  folk: { bg: "bg-lime-50", text: "text-lime-700" },
  soul: { bg: "bg-pink-50", text: "text-pink-700" },
  blues: { bg: "bg-blue-50", text: "text-blue-700" },
  reggae: { bg: "bg-green-50", text: "text-green-700" },
  punk: { bg: "bg-fuchsia-50", text: "text-fuchsia-700" },
};

export function GenreChip({ genre, className }: GenreChipProps) {
  const key = genre.toLowerCase();
  const colors = LIGHT_GENRE_COLORS[key] || {
    bg: "bg-gray-100",
    text: "text-gray-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        colors.bg,
        colors.text,
        className
      )}
    >
      {genre}
    </span>
  );
}
