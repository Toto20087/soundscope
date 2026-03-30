import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAlbumInfo } from "@/lib/lastfm";
import { normalizeAlbumInfo } from "@/lib/normalize";
import { formatNumber, formatDuration, formatTotalDuration } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { SafeImage } from "@/components/ui/safe-image";
import { GenreChip } from "@/components/ui/genre-chip";
import { StatCard } from "@/components/ui/stat-card";
import { Headphones, Users, ListMusic, Clock } from "lucide-react";
import { Tracklist } from "./_components/tracklist";
import { TrackDurationChart } from "./_components/track-duration-chart";

interface AlbumPageProps {
  params: Promise<{ name: string; album: string }>;
}

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { name, album: albumSlug } = await params;
  const artistName = decodeURIComponent(name);
  const albumName = decodeURIComponent(albumSlug);

  return {
    title: `${albumName} by ${artistName}`,
    description: `Explore "${albumName}" by ${artistName}. Track listing, duration, and stats.`,
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { name, album: albumSlug } = await params;
  const artistName = decodeURIComponent(name);
  const albumName = decodeURIComponent(albumSlug);

  const rawAlbum = await getAlbumInfo(artistName, albumName);
  const album = normalizeAlbumInfo(rawAlbum);

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          {/* Back link */}
          <Link
            href={`/artist/${encodeURIComponent(artistName)}`}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {artistName}
          </Link>

          {/* Album Header */}
          <div className="flex flex-col sm:flex-row gap-6">
            <SafeImage
              src={album.image}
              alt={album.name}
              width={240}
              height={240}
              className="rounded-2xl object-cover shadow-2xl shrink-0"
            />
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-text-primary">
                  {album.name}
                </h1>
                <p className="text-lg text-text-secondary mt-1">
                  {album.artistName}
                </p>
              </div>

              {/* Tags */}
              {album.tags && album.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {album.tags.map((tag) => (
                    <GenreChip key={tag} genre={tag} />
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  icon={Users}
                  value={formatNumber(album.listeners || 0)}
                  label="Listeners"
                />
                <StatCard
                  icon={Headphones}
                  value={formatNumber(album.playcount)}
                  label="Plays"
                />
                <StatCard
                  icon={ListMusic}
                  value={(album.trackCount || 0).toString()}
                  label="Tracks"
                />
                <StatCard
                  icon={Clock}
                  value={formatTotalDuration(album.totalDuration || 0)}
                  label="Duration"
                />
              </div>
            </div>
          </div>

          {/* Wiki */}
          {album.wiki && (
            <section className="glass rounded-2xl p-6">
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-3">
                About
              </h2>
              <div
                className="text-sm text-text-secondary leading-relaxed prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: album.wiki.summary }}
              />
            </section>
          )}

          {/* Tracklist */}
          {album.tracks && album.tracks.length > 0 && (
            <section>
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
                Tracklist
              </h2>
              <Tracklist tracks={album.tracks} />
            </section>
          )}

          {/* Track Duration Chart */}
          {album.tracks && album.tracks.length > 1 && (
            <section>
              <h2 className="text-xl font-heading font-semibold text-text-primary mb-4">
                Track Duration
              </h2>
              <TrackDurationChart tracks={album.tracks} />
            </section>
          )}
        </div>
      </main>
    </>
  );
}
