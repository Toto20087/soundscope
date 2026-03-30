import { NextRequest, NextResponse } from "next/server";
import { searchArtists } from "@/lib/lastfm";
import { ensureArray, normalizeImage } from "@/lib/normalize";
import { toNumber } from "@/lib/utils";
import { CACHE_DURATIONS } from "@/lib/constants";
import type { SearchApiResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const data = await searchArtists(query);
    const artists = ensureArray(data.results?.artistmatches?.artist);

    const response: SearchApiResponse = {
      artists: artists.map((a) => ({
        name: a.name,
        listeners: toNumber(a.listeners),
        image: normalizeImage(a.image, "large"),
        url: a.url,
      })),
      total: toNumber(data.results?.["opensearch:totalResults"]),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATIONS.search}, stale-while-revalidate=${CACHE_DURATIONS.search * 2}`,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search artists" },
      { status: 502 }
    );
  }
}
