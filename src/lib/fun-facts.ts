import type { Artist, Album, Track, FunFact } from "./types";
import { COUNTRY_POPULATIONS } from "./constants";
import { formatNumber } from "./utils";

/**
 * Generate fun facts from artist data.
 * Computes all possible facts, scores them by "interestingness",
 * and returns the top 4.
 */
export function generateFunFacts(
  artist: Artist,
  albums: Album[],
  topTracks: Track[]
): FunFact[] {
  const facts: FunFact[] = [];

  // Only generate facts if we have enough data
  if (albums.length === 0 && topTracks.length === 0) return [];

  // 1. Career Span
  const datedAlbums = albums.filter((a) => a.releaseYear !== null);
  if (datedAlbums.length >= 2) {
    const years = datedAlbums.map((a) => a.releaseYear!);
    const firstYear = Math.min(...years);
    const lastYear = Math.max(...years);
    const span = lastYear - firstYear;
    if (span > 0) {
      facts.push({
        id: "career-span",
        icon: "Calendar",
        category: "career",
        title: "Career Span",
        text: `${artist.name} has been releasing music for ${span} years, from ${firstYear} to ${lastYear}.`,
        score: Math.min(span / 5, 10), // Longer careers are more interesting
      });
    }
  }

  // 2. Most vs Least Popular Album
  if (albums.length >= 3) {
    const sorted = [...albums].sort((a, b) => b.playcount - a.playcount);
    const most = sorted[0];
    const least = sorted[sorted.length - 1];
    if (least.playcount > 0) {
      const ratio = Math.round(most.playcount / least.playcount);
      if (ratio >= 3) {
        facts.push({
          id: "album-popularity-gap",
          icon: "TrendingUp",
          category: "popularity",
          title: "Popularity Gap",
          text: `"${most.name}" has ${formatNumber(most.playcount)} plays — ${ratio}x more than "${least.name}".`,
          score: Math.min(ratio / 2, 10),
        });
      }
    }
  }

  // 3. Prolificacy (albums per year)
  if (datedAlbums.length >= 3) {
    const years = datedAlbums.map((a) => a.releaseYear!);
    const span = Math.max(...years) - Math.min(...years);
    if (span > 0) {
      const albumsPerYear = datedAlbums.length / span;
      const monthsPerAlbum = Math.round(12 / albumsPerYear);
      if (monthsPerAlbum <= 18) {
        facts.push({
          id: "prolificacy",
          icon: "Zap",
          category: "career",
          title: "Prolific Artist",
          text: `${artist.name} released ${datedAlbums.length} albums in ${span} years — that's one album every ${monthsPerAlbum} months!`,
          score: 18 / monthsPerAlbum, // More prolific = more interesting
        });
      }
    }
  }

  // 4. Track Count Extremes
  const albumsWithTracks = albums.filter(
    (a) => a.trackCount && a.trackCount > 0
  );
  if (albumsWithTracks.length >= 2) {
    const sorted = [...albumsWithTracks].sort(
      (a, b) => b.trackCount! - a.trackCount!
    );
    const longest = sorted[0];
    const shortest = sorted[sorted.length - 1];
    const ratio = Math.round(longest.trackCount! / shortest.trackCount!);
    if (ratio >= 2 && longest.trackCount! >= 10) {
      facts.push({
        id: "track-count-extremes",
        icon: "Music",
        category: "discography",
        title: "Album Length",
        text: `Their longest album "${longest.name}" has ${longest.trackCount} tracks — ${ratio}x more than "${shortest.name}" (${shortest.trackCount} tracks).`,
        score: Math.min(ratio, 8),
      });
    }
  }

  // 5. Top Track Dominance
  if (topTracks.length >= 5) {
    const topTrack = topTracks[0];
    const totalPlays = topTracks.reduce((sum, t) => sum + t.playcount, 0);
    if (totalPlays > 0) {
      const percentage = Math.round((topTrack.playcount / totalPlays) * 100);
      if (percentage >= 20) {
        facts.push({
          id: "top-track-dominance",
          icon: "Crown",
          category: "popularity",
          title: "Hit Dominance",
          text: `"${topTrack.name}" accounts for ${percentage}% of their top ${topTracks.length} tracks' total plays.`,
          score: percentage / 10,
        });
      }
    }
  }

  // 6. Listener Comparison (vs country population)
  if (artist.listeners > 100000) {
    const country = findClosestCountry(artist.listeners);
    if (country) {
      const comparison =
        artist.listeners > country.population ? "more" : "fewer";
      facts.push({
        id: "listener-comparison",
        icon: "Globe",
        category: "comparison",
        title: "Global Reach",
        text: `${artist.name} has ${comparison} listeners (${formatNumber(artist.listeners)}) than the entire population of ${country.name} (${formatNumber(country.population)}).`,
        score: 7, // Always interesting
      });
    }
  }

  // 7. Genre Diversity
  if (artist.tags.length >= 3) {
    facts.push({
      id: "genre-diversity",
      icon: "Palette",
      category: "career",
      title: "Genre Diversity",
      text: `${artist.name} spans ${artist.tags.length} different genres, from ${artist.tags[0]} to ${artist.tags[artist.tags.length - 1]}.`,
      score: Math.min(artist.tags.length, 6),
    });
  }

  // 8. Total Discography Playcount
  if (albums.length >= 3) {
    const totalPlays = albums.reduce((sum, a) => sum + a.playcount, 0);
    if (totalPlays > 1000000) {
      facts.push({
        id: "total-plays",
        icon: "BarChart3",
        category: "popularity",
        title: "Total Plays",
        text: `Across ${albums.length} albums, ${artist.name}'s discography has ${formatNumber(totalPlays)} total plays on Last.fm.`,
        score: 5,
      });
    }
  }

  // 9. Similar Artist Connection
  if (artist.similarArtists.length > 0) {
    const closest = artist.similarArtists[0];
    facts.push({
      id: "similar-artist",
      icon: "Users",
      category: "comparison",
      title: "Musical Relative",
      text: `Last.fm considers ${closest.name} as ${artist.name}'s closest musical relative.`,
      score: 4,
    });
  }

  // Sort by score and return top 4
  return facts
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

/**
 * Find the country with the closest population to the given listener count.
 */
function findClosestCountry(
  listeners: number
): { name: string; population: number } | null {
  let closest = COUNTRY_POPULATIONS[0];
  let minDiff = Math.abs(listeners - closest.population);

  for (const country of COUNTRY_POPULATIONS) {
    const diff = Math.abs(listeners - country.population);
    if (diff < minDiff) {
      minDiff = diff;
      closest = country;
    }
  }

  // Only use if within 5x range
  const ratio = listeners / closest.population;
  if (ratio > 0.2 && ratio < 5) {
    return closest;
  }

  return null;
}
