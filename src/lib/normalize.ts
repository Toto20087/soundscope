import type {
  LastFmImage,
  LastFmArtistInfoResponse,
  LastFmTopAlbumItem,
  LastFmTopTrackItem,
  LastFmAlbumTrack,
  LastFmAlbumInfoResponse,
  LastFmTag,
  Artist,
  SimilarArtist,
  Album,
  Track,
} from "./types";
import { toNumber } from "./utils";
import { sanitizeHtml, stripReadMoreLink } from "./sanitize";

/**
 * Ensure a value is always an array.
 * Last.fm returns single items as objects instead of 1-element arrays.
 */
export function ensureArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined || value === null) return [];
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 * Extract the best available image URL from a Last.fm image array.
 * Tries preferred size first, then falls back through sizes.
 */
export function normalizeImage(
  images: LastFmImage[] | undefined,
  preferredSize: string = "extralarge"
): string | null {
  if (!images || images.length === 0) return null;

  const sizePriority = [preferredSize, "mega", "extralarge", "large", "medium", "small"];

  for (const size of sizePriority) {
    const img = images.find((i) => i.size === size);
    if (img && img["#text"] && img["#text"].trim() !== "") {
      return img["#text"];
    }
  }

  // Try the empty-string size (largest available in some endpoints)
  const largest = images.find((i) => i.size === "");
  if (largest && largest["#text"] && largest["#text"].trim() !== "") {
    return largest["#text"];
  }

  return null;
}

/**
 * Normalize raw Last.fm artist.getInfo response into clean Artist type.
 */
export function normalizeArtist(raw: LastFmArtistInfoResponse): Artist {
  const a = raw.artist;
  const tags = ensureArray(a.tags?.tag);
  const similarRaw = ensureArray(a.similar?.artist);

  const hasBio =
    a.bio &&
    (a.bio.content?.trim() || a.bio.summary?.trim());

  return {
    name: a.name,
    mbid: a.mbid || null,
    url: a.url,
    image: normalizeImage(a.image),
    listeners: toNumber(a.stats?.listeners),
    playcount: toNumber(a.stats?.playcount),
    onTour: a.ontour === "1",
    tags: tags.map((t: LastFmTag) => t.name),
    bio: hasBio
      ? {
          summary: stripReadMoreLink(sanitizeHtml(a.bio.summary || "")),
          full: sanitizeHtml(a.bio.content || ""),
        }
      : null,
    similarArtists: similarRaw.map(
      (s): SimilarArtist => ({
        name: s.name,
        url: s.url,
        image: normalizeImage(s.image),
      })
    ),
  };
}

/**
 * Normalize a raw Last.fm top album item into clean Album type.
 */
export function normalizeTopAlbum(raw: LastFmTopAlbumItem): Album {
  return {
    name: raw.name,
    mbid: raw.mbid || null,
    url: raw.url,
    image: normalizeImage(raw.image),
    playcount: toNumber(raw.playcount),
    artistName: raw.artist?.name || "",
    releaseDate: null,
    releaseYear: null,
    albumType: null,
  };
}

/**
 * Normalize a raw Last.fm top track item into clean Track type.
 */
export function normalizeTopTrack(raw: LastFmTopTrackItem): Track {
  return {
    name: raw.name,
    url: raw.url,
    playcount: toNumber(raw.playcount),
    listeners: toNumber(raw.listeners),
    rank: toNumber(raw["@attr"]?.rank),
    duration: null, // Not available in getTopTracks
    artistName: raw.artist?.name || "",
  };
}

/**
 * Normalize a raw Last.fm album track into clean Track type.
 */
export function normalizeAlbumTrack(
  raw: LastFmAlbumTrack,
  albumName: string,
  albumImage: string | null
): Track {
  const duration = toNumber(raw.duration);
  return {
    name: raw.name,
    url: raw.url,
    playcount: 0,
    listeners: 0,
    rank: toNumber(raw["@attr"]?.rank),
    duration: duration > 0 ? duration : null,
    albumName,
    albumImage,
    artistName: raw.artist?.name || "",
  };
}

/**
 * Normalize a full album.getInfo response into clean Album type.
 */
export function normalizeAlbumInfo(raw: LastFmAlbumInfoResponse): Album {
  const a = raw.album;
  const tracks = ensureArray(a.tracks?.track);
  const tags = ensureArray(a.tags?.tag);
  const image = normalizeImage(a.image);

  const normalizedTracks = tracks.map((t) =>
    normalizeAlbumTrack(t, a.name, image)
  );

  const totalDuration = normalizedTracks.reduce(
    (sum, t) => sum + (t.duration || 0),
    0
  );

  const hasWiki = a.wiki && (a.wiki.content?.trim() || a.wiki.summary?.trim());

  return {
    name: a.name,
    mbid: a.mbid || null,
    url: a.url,
    image,
    playcount: toNumber(a.playcount),
    listeners: toNumber(a.listeners),
    artistName: typeof a.artist === "string" ? a.artist : "",
    releaseDate: null,
    releaseYear: null,
    albumType: null,
    trackCount: normalizedTracks.length,
    totalDuration: totalDuration > 0 ? totalDuration : undefined,
    tags: tags.map((t: LastFmTag) => t.name),
    wiki: hasWiki
      ? {
          summary: stripReadMoreLink(sanitizeHtml(a.wiki!.summary || "")),
          full: sanitizeHtml(a.wiki!.content || ""),
        }
      : null,
    tracks: normalizedTracks,
  };
}

/**
 * Filter out junk albums from Last.fm results.
 * Removes entries with "(null)" names, empty names, or no images.
 */
export function filterValidAlbums(albums: Album[]): Album[] {
  return albums.filter(
    (a) =>
      a.name &&
      a.name !== "(null)" &&
      a.name.trim() !== "" &&
      a.playcount > 0
  );
}
