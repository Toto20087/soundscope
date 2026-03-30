import { NextRequest, NextResponse } from "next/server";
import { getArtistFullProfile } from "@/lib/data-aggregator";
import { LastFmApiError } from "@/lib/lastfm";
import { CACHE_DURATIONS } from "@/lib/constants";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  if (!decodedName) {
    return NextResponse.json(
      { error: "Artist name is required" },
      { status: 400 }
    );
  }

  try {
    const profile = await getArtistFullProfile(decodedName);

    return NextResponse.json(profile, {
      headers: {
        "Cache-Control": `public, s-maxage=${CACHE_DURATIONS.aggregatedProfile}, stale-while-revalidate=${CACHE_DURATIONS.aggregatedProfile * 2}`,
      },
    });
  } catch (error) {
    if (error instanceof LastFmApiError && error.isNotFound) {
      return NextResponse.json(
        { error: `Artist "${decodedName}" not found` },
        { status: 404 }
      );
    }

    console.error("Artist profile error:", error);
    return NextResponse.json(
      { error: "Failed to load artist profile" },
      { status: 502 }
    );
  }
}
