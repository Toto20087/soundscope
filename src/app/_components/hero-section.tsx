"use client";

import Link from "next/link";
import { HeroSearchBar } from "@/components/search/hero-search-bar";
import { SoundScopeLogo } from "@/components/ui/logo";

interface HeroSectionProps {
  popularArtists: string[];
  covers: string[];
}

/**
 * Position items evenly around a circle.
 * Returns top/left in pixels relative to the container center.
 */
function getCirclePositions(
  count: number,
  radius: number,
  containerSize: number,
  startAngle: number = 0
) {
  const center = containerSize / 2;
  return Array.from({ length: count }, (_, i) => {
    const angle = startAngle + (i * 2 * Math.PI) / count;
    return {
      left: Math.round(center + radius * Math.cos(angle)),
      top: Math.round(center + radius * Math.sin(angle)),
    };
  });
}

// Layer config
const OUTER_CONTAINER = 2400;
const OUTER_RADIUS = 900;
const OUTER_COUNT = 8;
const OUTER_SIZE = 150;

const MID_CONTAINER = 1600;
const MID_RADIUS = 580;
const MID_COUNT = 6;
const MID_SIZE = 130;

const INNER_CONTAINER = 1000;
const INNER_RADIUS = 350;
const INNER_COUNT = 5;
const INNER_SIZE = 110;

export function HeroSection({ popularArtists, covers }: HeroSectionProps) {
  const hasCovers = covers.length > 0;

  // Split covers across 3 rings
  const outerCovers = covers.slice(0, OUTER_COUNT);
  const midCovers = covers.slice(OUTER_COUNT, OUTER_COUNT + MID_COUNT);
  const innerCovers = covers.slice(
    OUTER_COUNT + MID_COUNT,
    OUTER_COUNT + MID_COUNT + INNER_COUNT
  );

  const outerPositions = getCirclePositions(outerCovers.length, OUTER_RADIUS, OUTER_CONTAINER, -0.3);
  const midPositions = getCirclePositions(midCovers.length, MID_RADIUS, MID_CONTAINER, 0.5);
  const innerPositions = getCirclePositions(innerCovers.length, INNER_RADIUS, INNER_CONTAINER, 1.2);

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      <style>{`
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orbit-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .orbit-cw {
          animation: orbit 90s linear infinite;
        }
        .orbit-ccw {
          animation: orbit-reverse 75s linear infinite;
        }
        .orbit-cw-slow {
          animation: orbit 120s linear infinite;
        }
        /* Counter-rotate each cover so they stay upright */
        .counter-cw {
          animation: orbit-reverse 90s linear infinite;
        }
        .counter-ccw {
          animation: orbit 75s linear infinite;
        }
        .counter-cw-slow {
          animation: orbit-reverse 120s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-cw, .orbit-ccw, .orbit-cw-slow,
          .counter-cw, .counter-ccw, .counter-cw-slow {
            animation: none;
          }
        }
      `}</style>

      <div
        className="relative w-full h-screen overflow-hidden"
        style={{ backgroundColor: "#09090b" }}
      >
        {/* Background — 3 concentric orbiting rings */}
        {hasCovers && (
          <div
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              perspective: "1200px",
              transform: "perspective(1200px) rotateX(12deg)",
              transformOrigin: "center 70%",
            }}
          >
            {/* Outer ring — slowest, clockwise */}
            <div
              className="absolute top-1/2 left-1/2 orbit-cw-slow"
              style={{
                width: OUTER_CONTAINER,
                height: OUTER_CONTAINER,
                marginLeft: -OUTER_CONTAINER / 2,
                marginTop: -OUTER_CONTAINER / 2,
              }}
            >
              {outerCovers.map((url, i) => {
                const pos = outerPositions[i];
                return (
                  <div
                    key={`o-${i}`}
                    className="absolute counter-cw-slow"
                    style={{
                      left: pos.left - OUTER_SIZE / 2,
                      top: pos.top - OUTER_SIZE / 2,
                      width: OUTER_SIZE,
                      height: OUTER_SIZE,
                    }}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 opacity-40">
                      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" draggable={false} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Middle ring — counter-clockwise */}
            <div
              className="absolute top-1/2 left-1/2 orbit-ccw"
              style={{
                width: MID_CONTAINER,
                height: MID_CONTAINER,
                marginLeft: -MID_CONTAINER / 2,
                marginTop: -MID_CONTAINER / 2,
                zIndex: 1,
              }}
            >
              {midCovers.map((url, i) => {
                const pos = midPositions[i];
                return (
                  <div
                    key={`m-${i}`}
                    className="absolute counter-ccw"
                    style={{
                      left: pos.left - MID_SIZE / 2,
                      top: pos.top - MID_SIZE / 2,
                      width: MID_SIZE,
                      height: MID_SIZE,
                    }}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 opacity-50">
                      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" draggable={false} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inner ring — clockwise */}
            <div
              className="absolute top-1/2 left-1/2 orbit-cw"
              style={{
                width: INNER_CONTAINER,
                height: INNER_CONTAINER,
                marginLeft: -INNER_CONTAINER / 2,
                marginTop: -INNER_CONTAINER / 2,
                zIndex: 2,
              }}
            >
              {innerCovers.map((url, i) => {
                const pos = innerPositions[i];
                return (
                  <div
                    key={`in-${i}`}
                    className="absolute counter-cw"
                    style={{
                      left: pos.left - INNER_SIZE / 2,
                      top: pos.top - INNER_SIZE / 2,
                      width: INNER_SIZE,
                      height: INNER_SIZE,
                    }}
                  >
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 opacity-60">
                      <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" draggable={false} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, #09090b 8%, rgba(9,9,11,0.7) 35%, transparent 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-end pb-20 sm:pb-24 gap-6 px-4">
          <div className="mb-2">
            <SoundScopeLogo size={64} />
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-center tracking-tight text-white">
            Understand the music.
          </h1>

          <p className="text-lg font-medium" style={{ color: "#94a3b8" }}>
            Explore any artist&apos;s evolution, album by album.
          </p>

          <div className="w-full max-w-md mt-4">
            <HeroSearchBar />
          </div>

          <div
            className="flex items-center justify-center gap-1 text-sm pt-2 flex-wrap"
            style={{ color: "#94a3b8" }}
          >
            <span>Popular:</span>
            {popularArtists.map((artist, i) => (
              <span key={artist}>
                <Link
                  href={`/artist/${encodeURIComponent(artist)}`}
                  className="hover:text-white transition-colors"
                >
                  {artist}
                </Link>
                {i < popularArtists.length - 1 && (
                  <span className="mx-1">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
