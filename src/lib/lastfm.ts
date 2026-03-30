import "server-only";

import { env } from "./env";
import {
  LASTFM_BASE_URL,
  USER_AGENT,
  LASTFM_MAX_REQUESTS_PER_SECOND,
  CACHE_DURATIONS,
  DEFAULT_LIMITS,
  LASTFM_ERRORS,
} from "./constants";
import type {
  LastFmSearchResponse,
  LastFmArtistInfoResponse,
  LastFmTopAlbumsResponse,
  LastFmTopTracksResponse,
  LastFmAlbumInfoResponse,
  LastFmErrorResponse,
} from "./types";

// Simple in-memory rate limiter
let requestTimestamps: number[] = [];

async function throttle(): Promise<void> {
  const now = Date.now();
  requestTimestamps = requestTimestamps.filter((t) => now - t < 1000);

  if (requestTimestamps.length >= LASTFM_MAX_REQUESTS_PER_SECOND) {
    const oldestInWindow = requestTimestamps[0];
    const waitTime = 1000 - (now - oldestInWindow);
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  requestTimestamps.push(Date.now());
}

/**
 * Base fetch function for Last.fm API.
 * Handles rate limiting, error checking, and caching.
 */
async function lastfmFetch<T>(
  params: Record<string, string>,
  revalidate: number = CACHE_DURATIONS.artistInfo
): Promise<T> {
  await throttle();

  const searchParams = new URLSearchParams({
    ...params,
    api_key: env.LASTFM_API_KEY,
    format: "json",
  });

  const url = `${LASTFM_BASE_URL}?${searchParams.toString()}`;

  const res = await fetch(url, {
    next: { revalidate },
    headers: {
      "User-Agent": USER_AGENT,
    },
  });

  if (!res.ok) {
    throw new Error(`Last.fm API HTTP error: ${res.status}`);
  }

  const data = await res.json();

  // Last.fm returns HTTP 200 even for errors - check the body
  if (data.error) {
    const errorData = data as LastFmErrorResponse;

    // Rate limit - wait and retry once
    if (errorData.error === LASTFM_ERRORS.RATE_LIMIT) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return lastfmFetch<T>(params, revalidate);
    }

    throw new LastFmApiError(errorData.error, errorData.message);
  }

  return data as T;
}

/**
 * Custom error class for Last.fm API errors.
 */
export class LastFmApiError extends Error {
  constructor(
    public code: number,
    message: string
  ) {
    super(`Last.fm error ${code}: ${message}`);
    this.name = "LastFmApiError";
  }

  get isNotFound(): boolean {
    return this.code === LASTFM_ERRORS.INVALID_PARAMS;
  }
}

// ============================================================
// Public API functions
// ============================================================

/**
 * Search for artists by name.
 */
export async function searchArtists(
  query: string,
  limit: number = DEFAULT_LIMITS.searchResults
): Promise<LastFmSearchResponse> {
  return lastfmFetch<LastFmSearchResponse>(
    {
      method: "artist.search",
      artist: query,
      limit: limit.toString(),
    },
    CACHE_DURATIONS.search
  );
}

/**
 * Get detailed artist info including bio, tags, stats, and similar artists.
 */
export async function getArtistInfo(
  name: string
): Promise<LastFmArtistInfoResponse> {
  return lastfmFetch<LastFmArtistInfoResponse>(
    {
      method: "artist.getinfo",
      artist: name,
      autocorrect: "1",
    },
    CACHE_DURATIONS.artistInfo
  );
}

/**
 * Get an artist's top albums ranked by popularity.
 */
export async function getArtistTopAlbums(
  name: string,
  limit: number = DEFAULT_LIMITS.topAlbums
): Promise<LastFmTopAlbumsResponse> {
  return lastfmFetch<LastFmTopAlbumsResponse>(
    {
      method: "artist.gettopalbums",
      artist: name,
      autocorrect: "1",
      limit: limit.toString(),
    },
    CACHE_DURATIONS.topAlbums
  );
}

/**
 * Get an artist's top tracks ranked by popularity.
 */
export async function getArtistTopTracks(
  name: string,
  limit: number = DEFAULT_LIMITS.topTracks
): Promise<LastFmTopTracksResponse> {
  return lastfmFetch<LastFmTopTracksResponse>(
    {
      method: "artist.gettoptracks",
      artist: name,
      autocorrect: "1",
      limit: limit.toString(),
    },
    CACHE_DURATIONS.topTracks
  );
}

/**
 * Get album details including tracklist, tags, and wiki.
 */
export async function getAlbumInfo(
  artist: string,
  album: string
): Promise<LastFmAlbumInfoResponse> {
  return lastfmFetch<LastFmAlbumInfoResponse>(
    {
      method: "album.getinfo",
      artist,
      album,
      autocorrect: "1",
    },
    CACHE_DURATIONS.albumInfo
  );
}
