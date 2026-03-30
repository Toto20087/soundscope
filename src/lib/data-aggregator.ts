import "server-only";

import {
  getArtistInfo,
  getArtistTopAlbums,
  getArtistTopTracks,
} from "./lastfm";
import { enrichAlbum } from "./musicbrainz";
import {
  normalizeArtist,
  normalizeTopAlbum,
  normalizeTopTrack,
  filterValidAlbums,
  ensureArray,
} from "./normalize";
import { generateFunFacts } from "./fun-facts";
import type { Album, ArtistFullProfile } from "./types";

/**
 * Get a complete artist profile with all data merged and enriched.
 * This is the main orchestration function that combines Last.fm + MusicBrainz.
 */
export async function getArtistFullProfile(
  artistName: string
): Promise<ArtistFullProfile> {
  // Phase 1: Parallel fetch of core data from Last.fm
  const [rawArtistInfo, rawTopAlbums, rawTopTracks] = await Promise.all([
    getArtistInfo(artistName),
    getArtistTopAlbums(artistName, 30), // Fetch 30, filter to ~20
    getArtistTopTracks(artistName, 10),
  ]);

  // Phase 2: Normalize raw responses
  const artist = normalizeArtist(rawArtistInfo);

  const albumsRaw = ensureArray(rawTopAlbums.topalbums?.album);
  const albums = filterValidAlbums(albumsRaw.map(normalizeTopAlbum));

  const tracksRaw = ensureArray(rawTopTracks.toptracks?.track);
  const topTracks = tracksRaw.map(normalizeTopTrack);

  // Phase 3: Enrich albums with MusicBrainz data (release dates + types)
  // Limit to top 20 to stay within rate limits
  const albumsToEnrich = albums.slice(0, 20);
  const enrichedAlbums = await enrichAlbumsWithMusicBrainz(
    albumsToEnrich,
    artist.name
  );

  // Phase 4: Sort albums chronologically
  const sortedAlbums = sortAlbumsByDate(enrichedAlbums);

  // Phase 5: Generate fun facts
  const funFacts = generateFunFacts(artist, sortedAlbums, topTracks);

  return {
    artist,
    albums: sortedAlbums,
    topTracks,
    funFacts,
  };
}

/**
 * Enrich albums with MusicBrainz data (release dates and album types).
 * Processes sequentially to respect MusicBrainz 1 req/sec rate limit.
 */
async function enrichAlbumsWithMusicBrainz(
  albums: Album[],
  artistName: string
): Promise<Album[]> {
  const enriched: Album[] = [];

  for (const album of albums) {
    try {
      const mbData = await enrichAlbum(album.mbid, artistName, album.name);
      enriched.push({
        ...album,
        releaseDate: mbData.releaseDate,
        releaseYear: mbData.releaseYear,
        albumType: mbData.albumType,
      });
    } catch {
      // If MusicBrainz fails for this album, keep it without enrichment
      enriched.push(album);
    }
  }

  return enriched;
}

/**
 * Sort albums chronologically by release date.
 * Albums without dates go to the end.
 */
function sortAlbumsByDate(albums: Album[]): Album[] {
  return [...albums].sort((a, b) => {
    // Both have dates: sort chronologically
    if (a.releaseDate && b.releaseDate) {
      return a.releaseDate.localeCompare(b.releaseDate);
    }
    // Only one has a date: dated album comes first
    if (a.releaseDate && !b.releaseDate) return -1;
    if (!a.releaseDate && b.releaseDate) return 1;
    // Neither has a date: sort by playcount (most popular first)
    return b.playcount - a.playcount;
  });
}
