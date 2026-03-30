"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { SearchDropdown } from "./search-dropdown";

interface SearchResult {
  name: string;
  listeners: number;
  image: string | null;
  url: string;
}

export function HeroSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  // Fetch results when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    // Cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetch(`/api/lastfm/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.artists ?? []);
          setError(null);
        }
        setIsOpen(true);
        setActiveIndex(-1);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError("Search unavailable, try again");
          setResults([]);
          setIsOpen(true);
        }
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [debouncedQuery]);

  const navigateToArtist = useCallback(
    (name: string) => {
      setIsOpen(false);
      setQuery("");
      router.push(`/artist/${encodeURIComponent(name)}`);
    },
    [router]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "Enter" && query.trim().length >= 2) {
          // Submit search to first result or search page
          if (results.length > 0) {
            navigateToArtist(results[0].name);
          }
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, -1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && results[activeIndex]) {
            navigateToArtist(results[activeIndex].name);
          } else if (results.length > 0) {
            navigateToArtist(results[0].name);
          }
          break;
        case "Escape":
          setIsOpen(false);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, activeIndex, results, query, navigateToArtist]
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full max-w-2xl mx-auto transition-all duration-300",
        focused && "scale-[1.02]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 px-6 h-14",
          "bg-white/[0.05] backdrop-blur-xl",
          "border rounded-2xl transition-all duration-300",
          focused
            ? "border-purple-500/30 ring-2 ring-purple-500/20 bg-white/[0.08]"
            : "border-white/[0.1]"
        )}
      >
        <Search className="w-5 h-5 text-white/40 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          aria-controls="search-results"
          aria-label="Search for an artist"
          placeholder="What do you want to explore?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setFocused(true);
            if (results.length > 0) setIsOpen(true);
          }}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-text-primary placeholder:text-white/30 outline-none text-lg"
        />
        {isLoading && (
          <Loader2 className="w-5 h-5 text-accent-purple animate-spin shrink-0" />
        )}
        {!isLoading && query && (
          <button
            onClick={() => {
              if (results.length > 0) {
                navigateToArtist(results[0].name);
              }
            }}
            aria-label="Search"
            className="shrink-0"
          >
            <ArrowRight className="w-5 h-5 text-accent-purple hover:text-accent-purple-light transition-colors cursor-pointer" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <SearchDropdown
          results={results}
          activeIndex={activeIndex}
          isLoading={isLoading}
          error={error}
          onSelect={navigateToArtist}
          onHover={setActiveIndex}
        />
      )}
    </div>
  );
}
