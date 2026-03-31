"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";

interface SearchResult {
  name: string;
  listeners: number;
  image: string | null;
  url: string;
}

interface SearchDropdownProps {
  results: SearchResult[];
  activeIndex: number;
  isLoading: boolean;
  error: string | null;
  onSelect: (name: string) => void;
  onHover: (index: number) => void;
}

export function SearchDropdown({
  results,
  activeIndex,
  isLoading,
  error,
  onSelect,
  onHover,
}: SearchDropdownProps) {
  if (error) {
    return (
      <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl z-50 p-4">
        <p className="text-text-tertiary text-sm text-center">{error}</p>
      </div>
    );
  }

  if (!isLoading && results.length === 0) {
    return (
      <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl z-50 p-4">
        <p className="text-text-tertiary text-sm text-center">
          No artists found. Try a different spelling.
        </p>
      </div>
    );
  }

  if (results.length === 0) return null;

  return (
    <ul
      id="search-results"
      role="listbox"
      className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xl z-50"
    >
      {results.map((artist, index) => (
        <li
          key={artist.name}
          id={`search-result-${index}`}
          role="option"
          aria-selected={index === activeIndex}
          className={cn(
            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150",
            index === activeIndex
              ? "bg-gray-100"
              : "hover:bg-gray-50"
          )}
          onClick={() => onSelect(artist.name)}
          onMouseEnter={() => onHover(index)}
        >
          <SafeImage
            src={artist.image}
            alt={artist.name}
            width={36}
            height={36}
            className="rounded-md object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {artist.name}
            </p>
            <p className="text-xs text-text-tertiary">
              {formatNumber(artist.listeners)} listeners
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0" />
        </li>
      ))}
    </ul>
  );
}
