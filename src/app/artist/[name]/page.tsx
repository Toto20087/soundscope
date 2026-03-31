import type { Metadata } from "next";
import { Suspense } from "react";
import { getArtistFullProfile } from "@/lib/data-aggregator";
import { formatNumber } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import {
  TrackListSkeleton,
  TimelineSkeleton,
  ChartSkeleton,
  FunFactsSkeleton,
} from "@/components/ui/skeletons";
import { AccentColorProvider } from "@/contexts/accent-color-context";
import { ArtistHero } from "./_components/artist-hero";
import { ArtistBio } from "./_components/artist-bio";
import { AlbumTimeline } from "./_components/album-timeline";
import { AlbumComparisonChart } from "./_components/album-comparison-chart";
import { TopTracks } from "./_components/top-tracks";
import { FunFacts } from "./_components/fun-facts";
import { SimilarArtists } from "./_components/similar-artists";
import { AiAnalysis } from "./_components/ai-analysis";
import { ArtistInsights } from "./_components/artist-insights";

interface ArtistPageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({
  params,
}: ArtistPageProps): Promise<Metadata> {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  try {
    const { artist } = await getArtistFullProfile(decodedName);
    return {
      title: `${artist.name} - Music Stats`,
      description: `Explore ${artist.name}'s musical evolution. ${formatNumber(artist.listeners)} listeners worldwide. Discover albums, top tracks, and insights.`,
      openGraph: {
        title: `${artist.name} | SoundScope`,
        description: `${formatNumber(artist.listeners)} listeners worldwide`,
      },
    };
  } catch {
    return { title: decodedName };
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const profile = await getArtistFullProfile(decodedName);
  const { artist, albums, topTracks, funFacts } = profile;

  // Find the most popular album's cover for accent color extraction
  const mostPopularAlbum = albums.length > 0
    ? albums.reduce((max, a) => (a.playcount > max.playcount ? a : max), albums[0])
    : null;
  const accentImageUrl = mostPopularAlbum?.image || artist.image;

  return (
    <AccentColorProvider imageUrl={accentImageUrl}>
      <Header />
      <main id="main-content" className="flex-1 max-w-screen-2xl mx-auto px-8">
        {/* Hero — full viewport */}
        <ArtistHero artist={artist} albumCount={albums.length} />

        <div>
          {/* AI Evolution Analysis — mt-24 like the design */}
          <AiAnalysis artistName={artist.name} />

          {/* Biography */}
          {artist.bio && (
            <div className="mt-32">
              <ArtistBio bio={artist.bio} />
            </div>
          )}

          {/* Discography Timeline */}
          {albums.length > 0 && (
            <section className="mt-32">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h2 className="font-heading text-5xl font-black tracking-tighter">Discography</h2>
                  <p className="text-text-tertiary mt-2 opacity-70">A chronological journey through the catalog.</p>
                </div>
              </div>
              <AlbumTimeline albums={albums} artistName={artist.name} />
            </section>
          )}

          {/* Data Insights (4 charts) */}
          <section className="mt-32">
            <h2 className="font-heading text-4xl font-black tracking-tight mb-12">Data Visualizations</h2>
            <ArtistInsights albums={albums} topTracks={topTracks} />
          </section>

          {/* Album Comparison */}
          {albums.length >= 2 && (
            <section className="mt-32">
              <AlbumComparisonChart albums={albums} />
            </section>
          )}

          {/* Top Tracks */}
          {topTracks.length > 0 && (
            <section className="mt-32">
              <h2 className="font-heading text-4xl font-black tracking-tight mb-12">The Heavyweights</h2>
              <TopTracks tracks={topTracks} artistName={artist.name} />
            </section>
          )}

          {/* Fun Facts */}
          {funFacts.length > 0 && (
            <section className="mt-32">
              <h2 className="font-heading text-4xl font-black tracking-tight mb-12">Key Insights</h2>
              <FunFacts facts={funFacts} />
            </section>
          )}

          {/* Similar Artists */}
          {artist.similarArtists.length > 0 && (
            <section className="mt-32 mb-20">
              <h2 className="font-heading text-4xl font-black tracking-tight mb-12">Related Artists</h2>
              <SimilarArtists artists={artist.similarArtists} />
            </section>
          )}
        </div>
      </main>
    </AccentColorProvider>
  );
}
