import { NextRequest, NextResponse } from "next/server";
import { getAlbumInfo } from "@/lib/lastfm";
import { normalizeAlbumInfo } from "@/lib/normalize";
import { LastFmApiError } from "@/lib/lastfm";
import { CACHE_DURATIONS } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const artist = request.nextUrl.searchParams.get("artist");
  const album = request.nextUrl.searchParams.get("album");

  if (!artist || !album) {
    return NextResponse.json(
      { error: "Both 'artist' and 'album' query parameters are required" },
      { status: 400 }
    );
  }

  try {
    const data = await getAlbumInfo(artist, album);
    const normalized = normalizeAlbumInfo(data);

    return NextResponse.json(normalized, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATIONS.albumInfo}, stale-while-revalidate=${CACHE_DURATIONS.albumInfo * 2}`,
      },
    });
  } catch (error) {
    if (error instanceof LastFmApiError && error.isNotFound) {
      return NextResponse.json(
        { error: `Album "${album}" by "${artist}" not found` },
        { status: 404 }
      );
    }

    console.error("Album info error:", error);
    return NextResponse.json(
      { error: "Failed to load album info" },
      { status: 502 }
    );
  }
}
