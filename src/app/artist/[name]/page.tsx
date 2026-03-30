import type { Metadata } from "next";
import { Suspense } from "react";
import { getArtistFullProfile } from "@/lib/data-aggregator";
import { formatNumber } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import {
  ArtistHeroSkeleton,
  TrackListSkeleton,
  TimelineSkeleton,
  ChartSkeleton,
  FunFactsSkeleton,
} from "@/components/ui/skeletons";
import { ArtistHero } from "./_components/artist-hero";
import { ArtistBio } from "./_components/artist-bio";
import { AlbumTimeline } from "./_components/album-timeline";
import { AlbumComparisonChart } from "./_components/album-comparison-chart";
import { TopTracks } from "./_components/top-tracks";
import { FunFacts } from "./_components/fun-facts";
import { SimilarArtists } from "./_components/similar-artists";

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
    return {
      title: decodedName,
    };
  }
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const profile = await getArtistFullProfile(decodedName);
  const { artist, albums, topTracks, funFacts } = profile;

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Section 3A: Hero */}
        <ArtistHero artist={artist} albumCount={albums.length} />

        <div className="max-w-6xl mx-auto px-4 space-y-16 py-12">
          {/* Section 3B: Biography */}
          {artist.bio && <ArtistBio bio={artist.bio} />}

          {/* Section 3C: Timeline */}
          {albums.length > 0 && (
            <Suspense fallback={<TimelineSkeleton />}>
              <section>
                <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">
                  Discography Timeline
                </h2>
                <AlbumTimeline
                  albums={albums}
                  artistName={artist.name}
                />
              </section>
            </Suspense>
          )}

          {/* Section 3D: Album Comparison Chart */}
          {albums.length >= 2 && (
            <Suspense fallback={<ChartSkeleton />}>
              <section>
                <AlbumComparisonChart albums={albums} />
              </section>
            </Suspense>
          )}

          {/* Section 3E: Top Tracks */}
          {topTracks.length > 0 && (
            <Suspense fallback={<TrackListSkeleton count={10} />}>
              <section>
                <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">
                  Top Tracks
                </h2>
                <TopTracks tracks={topTracks} artistName={artist.name} />
              </section>
            </Suspense>
          )}

          {/* Section 3F: Fun Facts */}
          {funFacts.length > 0 && (
            <Suspense fallback={<FunFactsSkeleton />}>
              <section>
                <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">
                  Fun Facts
                </h2>
                <FunFacts facts={funFacts} />
              </section>
            </Suspense>
          )}

          {/* Similar Artists */}
          {artist.similarArtists.length > 0 && (
            <section>
              <h2 className="text-2xl font-heading font-semibold text-text-primary mb-6">
                Similar Artists
              </h2>
              <SimilarArtists artists={artist.similarArtists} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
