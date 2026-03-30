"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { HeroSearchBar } from "@/components/search/hero-search-bar";

export default function ArtistError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Artist page error:", error);
  }, [error]);

  const isNotFound = error.message?.includes("not found");

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <AlertTriangle className="w-12 h-12 text-chart-amber mb-4" />
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
          {isNotFound ? "Artist Not Found" : "Something Went Wrong"}
        </h2>
        <p className="text-text-secondary mb-8 text-center max-w-md">
          {isNotFound
            ? "We couldn't find that artist. Check the spelling and try again."
            : "We couldn't load this artist's information. Please try again."}
        </p>

        <button
          onClick={reset}
          className="px-6 py-2 rounded-full bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors mb-8"
        >
          Try Again
        </button>

        <div className="w-full max-w-lg">
          <p className="text-sm text-text-tertiary text-center mb-3">
            Or search for another artist:
          </p>
          <HeroSearchBar />
        </div>
      </main>
    </>
  );
}
