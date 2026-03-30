import "server-only";

import {
  MUSICBRAINZ_BASE_URL,
  USER_AGENT,
  MUSICBRAINZ_REQUEST_DELAY_MS,
} from "./constants";

// MusicBrainz rate limiting: 1 request per second
let lastMbRequest = 0;

async function mbThrottle(): Promise<void> {
  const now = Date.now();
  const elapsed = now - lastMbRequest;
  if (elapsed < MUSICBRAINZ_REQUEST_DELAY_MS) {
    await new Promise((resolve) =>
      setTimeout(resolve, MUSICBRAINZ_REQUEST_DELAY_MS - elapsed)
    );
  }
  lastMbRequest = Date.now();
}

interface MusicBrainzReleaseGroup {
  id: string;
  title: string;
  "primary-type"?: string;
  "first-release-date"?: string;
  "secondary-types"?: string[];
}

interface MusicBrainzSearchResponse {
  "release-groups": MusicBrainzReleaseGroup[];
}

/**
 * Fetch from MusicBrainz API with rate limiting.
 */
async function mbFetch<T>(path: string): Promise<T> {
  await mbThrottle();

  const res = await fetch(`${MUSICBRAINZ_BASE_URL}${path}`, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json",
    },
    next: { revalidate: 86400 * 7 }, // Cache for 7 days (data rarely changes)
  });

  if (!res.ok) {
    throw new Error(`MusicBrainz API error: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export interface AlbumEnrichmentData {
  releaseDate: string | null;
  releaseYear: number | null;
  albumType: string | null;
}

/**
 * Get album release date and type by MusicBrainz ID.
 */
export async function getAlbumByMbid(
  mbid: string
): Promise<AlbumEnrichmentData> {
  try {
    const data = await mbFetch<MusicBrainzReleaseGroup>(
      `/release-group/${mbid}?fmt=json`
    );
    return parseReleaseGroup(data);
  } catch {
    return { releaseDate: null, releaseYear: null, albumType: null };
  }
}

/**
 * Search for album release date and type by artist + album name.
 */
export async function searchAlbumReleaseInfo(
  artist: string,
  album: string
): Promise<AlbumEnrichmentData> {
  try {
    const query = encodeURIComponent(
      `releasegroup:"${album}" AND artist:"${artist}"`
    );
    const data = await mbFetch<MusicBrainzSearchResponse>(
      `/release-group/?query=${query}&fmt=json&limit=1`
    );

    if (data["release-groups"] && data["release-groups"].length > 0) {
      return parseReleaseGroup(data["release-groups"][0]);
    }

    return { releaseDate: null, releaseYear: null, albumType: null };
  } catch {
    return { releaseDate: null, releaseYear: null, albumType: null };
  }
}

/**
 * Parse a MusicBrainz release group into enrichment data.
 */
function parseReleaseGroup(rg: MusicBrainzReleaseGroup): AlbumEnrichmentData {
  const releaseDate = rg["first-release-date"] || null;
  let releaseYear: number | null = null;

  if (releaseDate) {
    const yearMatch = releaseDate.match(/^(\d{4})/);
    if (yearMatch) {
      releaseYear = parseInt(yearMatch[1], 10);
    }
  }

  // primary-type: Album, Single, EP, Broadcast, Other
  // secondary-types: Compilation, Live, Remix, Soundtrack, etc.
  let albumType = rg["primary-type"] || null;

  // If it has secondary types like "Compilation" or "Live", use those
  if (rg["secondary-types"] && rg["secondary-types"].length > 0) {
    const secondaries = rg["secondary-types"];
    if (secondaries.includes("Compilation")) albumType = "Compilation";
    else if (secondaries.includes("Live")) albumType = "Live";
    else if (secondaries.includes("Soundtrack")) albumType = "Soundtrack";
    else if (secondaries.includes("Remix")) albumType = "Remix";
  }

  return { releaseDate, releaseYear, albumType };
}

/**
 * Enrich an album with MusicBrainz data.
 * Tries MBID first, falls back to name search.
 */
export async function enrichAlbum(
  mbid: string | null,
  artistName: string,
  albumName: string
): Promise<AlbumEnrichmentData> {
  // Try MBID first (more reliable)
  if (mbid) {
    const result = await getAlbumByMbid(mbid);
    if (result.releaseDate) return result;
  }

  // Fallback to name search
  return searchAlbumReleaseInfo(artistName, albumName);
}
