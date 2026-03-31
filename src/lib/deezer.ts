import "server-only";

/**
 * Fetch artist image from Deezer API (free, no auth required).
 * Returns the XL image URL or null.
 */
export async function getArtistImage(
  artistName: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`,
      { next: { revalidate: 86400 * 7 } } // Cache 7 days
    );

    if (!res.ok) return null;

    const data = await res.json();
    const artist = data?.data?.[0];

    if (!artist) return null;

    // Verify the name roughly matches to avoid wrong artist
    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalize(artist.name) !== normalize(artistName)) {
      // Loose match - at least starts with same chars
      if (!normalize(artist.name).startsWith(normalize(artistName).slice(0, 5))) {
        return null;
      }
    }

    return artist.picture_xl || artist.picture_big || artist.picture_medium || null;
  } catch {
    return null;
  }
}
