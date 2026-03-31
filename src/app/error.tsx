"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center min-h-screen px-4 bg-hero-gradient">
      <AlertTriangle className="w-16 h-16 text-chart-amber mb-6" />
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
        Something Went Wrong
      </h1>
      <p className="text-text-secondary mb-8 text-center max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-full bg-accent-purple text-white font-medium hover:bg-accent-purple-dark transition-colors"
      >
        Try Again
      </button>
    </main>
  );
}
