import type { ArtistFullProfile } from "./types";
import { formatNumber } from "./utils";

/**
 * Build a structured prompt for Claude to analyze an artist's musical evolution.
 */
export function buildAnalysisPrompt(profile: ArtistFullProfile): string {
  const { artist, albums, topTracks } = profile;

  const albumList = albums
    .filter((a) => a.releaseYear)
    .map(
      (a) =>
        `- "${a.name}" (${a.releaseYear}) — ${a.albumType || "Album"}, ${formatNumber(a.playcount)} plays${a.tags && a.tags.length > 0 ? `, genres: ${a.tags.join(", ")}` : ""}`
    )
    .join("\n");

  const trackList = topTracks
    .slice(0, 15)
    .map((t) => `- "${t.name}" — ${formatNumber(t.playcount)} plays`)
    .join("\n");

  const similarList = artist.similarArtists
    .map((s) => s.name)
    .join(", ");

  const bioText = artist.bio?.full
    ? artist.bio.full.replace(/<[^>]*>/g, "").substring(0, 2000)
    : "No biography available.";

  return `You are a music historian and cultural critic. Analyze the musical evolution of ${artist.name}.

Use the following real data to ground your analysis. Be specific — reference actual album names, years, and genre shifts.

## ARTIST DATA

**Name:** ${artist.name}
**Total Listeners:** ${formatNumber(artist.listeners)}
**Total Plays:** ${formatNumber(artist.playcount)}
**Genres:** ${artist.tags.join(", ") || "Unknown"}
**Similar Artists:** ${similarList || "None listed"}

## BIOGRAPHY
${bioText}

## DISCOGRAPHY (Chronological)
${albumList || "No albums with dates available."}

## TOP TRACKS (by popularity)
${trackList || "No tracks available."}

---

Write a compelling, analytical essay about ${artist.name}'s musical evolution. Cover these sections:

## Early Career & Origins
How did they start? What were their musical roots and early influences?

## Key Turning Points
Which specific albums marked a dramatic shift in their sound? What triggered these changes — personal events, industry trends, creative growth?

## Genre Evolution
Map the journey of their sound. Did they move between genres? Was it gradual or sudden? Reference specific albums and their tags/genres from the data above.

## Commercial vs Artistic Arc
Did their popularity peaks align with their most artistically ambitious work? Or did commercial success come from a different direction than their creative evolution?

## Legacy & Impact
Where does this artist stand in the broader context of music? What influence have they had?

---

RULES:
- Be analytical and insightful, not promotional or fanboy
- Reference specific album names and years from the data
- Connect biographical events to musical changes when possible
- If data is limited, acknowledge it rather than speculating wildly
- Write in English
- 800-1200 words
- Use markdown formatting (## for sections, **bold** for emphasis)`;
}
