import { cn } from "@/lib/utils";
import { GENRE_COLORS } from "@/lib/constants";

interface GenreChipProps {
  genre: string;
  className?: string;
}

export function GenreChip({ genre, className }: GenreChipProps) {
  const key = genre.toLowerCase();
  const colors = GENRE_COLORS[key] || {
    border: "border-white/20",
    text: "text-white/70",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        "bg-white/10 border",
        colors.border,
        colors.text,
        className
      )}
    >
      {genre}
    </span>
  );
}
