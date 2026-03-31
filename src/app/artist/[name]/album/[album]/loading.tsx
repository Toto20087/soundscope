import { Header } from "@/components/layout/header";

export default function AlbumLoading() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          {/* Back link skeleton */}
          <div className="h-5 w-40 rounded bg-gray-200 animate-pulse" />

          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-60 h-60 rounded-2xl bg-gray-200 animate-pulse shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-10 w-64 rounded-lg bg-gray-200 animate-pulse" />
              <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-gray-200 animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Tracklist skeleton */}
          <div className="space-y-3">
            <div className="h-7 w-32 rounded-lg bg-gray-200 animate-pulse" />
            <div className="h-64 rounded-2xl bg-gray-200 animate-pulse" />
          </div>
        </div>
      </main>
    </>
  );
}
