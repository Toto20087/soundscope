"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function AlbumError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Album page error:", error);
  }, [error]);

  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <AlertTriangle className="w-12 h-12 text-chart-amber mb-4" />
        <h2 className="text-2xl font-heading font-bold text-text-primary mb-2">
          Album Not Found
        </h2>
        <p className="text-text-secondary mb-8 text-center max-w-md">
          We couldn&apos;t load this album&apos;s information. It may not exist on Last.fm.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-6 py-2 rounded-full bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-text-secondary font-medium hover:bg-white/10 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </main>
    </>
  );
}
