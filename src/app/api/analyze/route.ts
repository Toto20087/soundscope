import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getArtistFullProfile } from "@/lib/data-aggregator";
import { buildAnalysisPrompt } from "@/lib/ai-prompt";
import { LastFmApiError } from "@/lib/lastfm";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      JSON.stringify({ error: "ANTHROPIC_API_KEY not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let artistName: string;
  try {
    const body = await request.json();
    artistName = body.artistName;
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!artistName || typeof artistName !== "string") {
    return new Response(
      JSON.stringify({ error: "artistName is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Fetch all artist data
    const profile = await getArtistFullProfile(artistName);
    const prompt = buildAnalysisPrompt(profile);

    // Stream response from Claude
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    // Convert Anthropic stream to Web ReadableStream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    if (error instanceof LastFmApiError && error.isNotFound) {
      return new Response(
        JSON.stringify({ error: `Artist "${artistName}" not found` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate analysis" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
