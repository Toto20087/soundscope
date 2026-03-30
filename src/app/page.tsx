import Link from "next/link";
import { siteConfig } from "@/config/site";
import { AmbientBackground } from "@/components/ui/ambient-background";
import { HeroSearchBar } from "@/components/search/hero-search-bar";
import { FeatureShowcase } from "./_components/feature-showcase";

const POPULAR_ARTISTS = [
  "Radiohead",
  "Taylor Swift",
  "Kendrick Lamar",
  "Daft Punk",
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <AmbientBackground />

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 bg-hero-gradient">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-6xl sm:text-7xl font-heading font-bold text-gradient tracking-tight">
            {siteConfig.name}
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto">
            {siteConfig.tagline}
          </p>

          <div className="pt-4">
            <HeroSearchBar />
          </div>

          {/* Popular Artists */}
          <div className="flex items-center justify-center gap-1 text-sm text-text-tertiary pt-2">
            <span>Popular:</span>
            {POPULAR_ARTISTS.map((artist, i) => (
              <span key={artist}>
                <Link
                  href={`/artist/${encodeURIComponent(artist)}`}
                  className="hover:text-text-accent transition-colors"
                >
                  {artist}
                </Link>
                {i < POPULAR_ARTISTS.length - 1 && (
                  <span className="mx-1">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="relative py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-heading font-semibold text-center text-text-primary mb-12">
            What You&apos;ll Discover
          </h2>
          <FeatureShowcase />
        </div>
      </section>
    </main>
  );
}
