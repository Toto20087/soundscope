import "server-only";

import { env } from "./env";
import { LASTFM_BASE_URL, USER_AGENT, CACHE_DURATIONS } from "./constants";

export interface HeroCover {
  url: string;
  artistName: string;
  albumName: string;
}

const ARTISTS = [
  "Radiohead",
  "Daft Punk",
  "Kendrick Lamar",
  "Taylor Swift",
  "Pink Floyd",
  "Nirvana",
  "Arctic Monkeys",
  "The Beatles",
  "Tyler, The Creator",
  "Frank Ocean",
  "Kanye West",
  "Tame Impala",
  "Amy Winehouse",
  "David Bowie",
];

/**
 * Fetch real album covers with artist info from Last.fm.
 */
export async function getHeroCovers(): Promise<HeroCover[]> {
  try {
    const allCovers: HeroCover[] = [];
    const seenUrls = new Set<string>();

    const responses = await Promise.all(
      ARTISTS.map((artist) =>
        fetch(
          `${LASTFM_BASE_URL}?method=artist.gettopalbums&artist=${encodeURIComponent(artist)}&api_key=${env.LASTFM_API_KEY}&format=json&limit=4`,
          {
            next: { revalidate: CACHE_DURATIONS.aggregatedProfile },
            headers: { "User-Agent": USER_AGENT },
          }
        )
          .then((r) => r.json())
          .catch(() => null)
      )
    );

    for (const data of responses) {
      if (!data || data.error) continue;
      const albums = data.topalbums?.album;
      if (!Array.isArray(albums)) continue;

      for (const album of albums) {
        if (!album.image) continue;
        const img = album.image.find(
          (i: { size: string; "#text": string }) => i.size === "extralarge"
        );
        const url = img?.["#text"];
        if (
          url &&
          url.trim() !== "" &&
          !url.includes("2a96cbd8b46e442fc41c2b86b821562f") &&
          !seenUrls.has(url)
        ) {
          seenUrls.add(url);
          allCovers.push({
            url,
            artistName: album.artist?.name || "",
            albumName: album.name || "",
          });
        }
      }
    }

    return allCovers.slice(0, 20);
  } catch {
    return [];
  }
}
