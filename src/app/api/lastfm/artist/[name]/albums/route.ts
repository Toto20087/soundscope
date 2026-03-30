import { NextRequest, NextResponse } from "next/server";
import { getArtistTopAlbums } from "@/lib/lastfm";
import { ensureArray, normalizeTopAlbum, filterValidAlbums } from "@/lib/normalize";
import { LastFmApiError } from "@/lib/lastfm";
import { CACHE_DURATIONS } from "@/lib/constants";
import { toNumber } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  const limit = toNumber(request.nextUrl.searchParams.get("limit") || "20");
  const page = toNumber(request.nextUrl.searchParams.get("page") || "1");

  try {
    const data = await getArtistTopAlbums(decodedName, limit);
    const albumsRaw = ensureArray(data.topalbums?.album);
    const albums = filterValidAlbums(albumsRaw.map(normalizeTopAlbum));

    return NextResponse.json(
      {
        albums,
        pagination: {
          page,
          perPage: limit,
          total: toNumber(data.topalbums?.["@attr"]?.total),
          totalPages: toNumber(data.topalbums?.["@attr"]?.totalPages),
        },
      },
      {
        headers: {
          "Cache-Control": `public, s-maxage=${CACHE_DURATIONS.topAlbums}, stale-while-revalidate=${CACHE_DURATIONS.topAlbums * 2}`,
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

    console.error("Albums error:", error);
    return NextResponse.json(
      { error: "Failed to load albums" },
      { status: 502 }
    );
  }
}
