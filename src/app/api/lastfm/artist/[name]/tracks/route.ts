import { NextRequest, NextResponse } from "next/server";
import { getArtistTopTracks } from "@/lib/lastfm";
import { ensureArray, normalizeTopTrack } from "@/lib/normalize";
import { LastFmApiError } from "@/lib/lastfm";
import { CACHE_DURATIONS } from "@/lib/constants";
import { toNumber } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const limit = toNumber(request.nextUrl.searchParams.get("limit") || "10");

  try {
    const data = await getArtistTopTracks(decodedName, limit);
    const tracksRaw = ensureArray(data.toptracks?.track);
    const tracks = tracksRaw.map(normalizeTopTrack);

    return NextResponse.json(
      {
        tracks,
        pagination: {
          total: toNumber(data.toptracks?.["@attr"]?.total),
          totalPages: toNumber(data.toptracks?.["@attr"]?.totalPages),
        },
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATIONS.topTracks}, stale-while-revalidate=${CACHE_DURATIONS.topTracks * 2}`,
        },
      }
    );
  } catch (error) {
    if (error instanceof LastFmApiError && error.isNotFound) {
      return NextResponse.json(
        { error: `Artist "${decodedName}" not found` },
        { status: 404 }
      );
    }

    console.error("Tracks error:", error);
    return NextResponse.json(
      { error: "Failed to load tracks" },
      { status: 502 }
    );
  }
}
