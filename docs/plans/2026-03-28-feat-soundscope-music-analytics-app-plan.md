---
title: "feat: SoundScope - Music Analytics Web App"
type: feat
status: active
date: 2026-03-28
---

# SoundScope - Music Analytics Web App

## Overview

SoundScope es una web app que permite explorar la evolucion musical de cualquier artista. El usuario busca un artista y la app arma un perfil completo: como cambio su sonido album por album, que tan popular es cada era de su carrera, cuales son sus tracks mas atipicos, y el contexto biografico detras de esos cambios. Es como un Spotify Wrapped, pero para la carrera entera de cualquier artista.

**Target audience:** Fans curiosos, periodistas musicales, y cualquier persona que quiera descubrir patrones no obvios en la musica.

**Core value proposition:** Transforma data cruda de Last.fm en una narrativa visual sobre la trayectoria de un artista.

---

## Problem Statement

No existe una herramienta accesible que permita a usuarios casuales visualizar la evolucion de un artista a lo largo de su carrera. Last.fm tiene la data pero la presenta en tablas planas. Spotify muestra el presente pero no la historia. SoundScope llena ese gap convirtiendo datos en una experiencia visual y narrativa.

---

## Proposed Solution

Una Next.js web app con 4 pantallas principales que consume la Last.fm API (complementada con MusicBrainz para datos faltantes) y presenta la informacion en una interfaz premium con tema oscuro, glassmorphism, y visualizaciones interactivas con Recharts.

---

## Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14+ (App Router) | SSR, routing, API routes |
| Styling | Tailwind CSS | Utility-first, dark theme |
| Components | shadcn/ui | Base component library |
| Charts | Recharts | Data visualization |
| Animation | Framer Motion (motion) | Micro-interactions, scroll reveals |
| Icons | Lucide React | Consistent icon set |
| Fonts | Sora + Inter + JetBrains Mono | Headings + body + stats |
| Deploy | Vercel | Hosting, CDN, analytics |
| Primary API | Last.fm API | Artist data, albums, tracks |
| Secondary API | MusicBrainz API | Release dates, album types |

---

## Technical Approach

### Architecture

```
sound-scope/
├── public/
│   ├── fonts/
│   └── images/
│       ├── placeholder-artist.svg
│       └── placeholder-album.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout (fonts, providers, theme)
│   │   ├── page.tsx                   # Landing / Home
│   │   ├── loading.tsx                # Global loading skeleton
│   │   ├── error.tsx                  # Global error boundary
│   │   ├── not-found.tsx              # 404 page
│   │   ├── globals.css                # Tailwind + CSS variables + gradients
│   │   │
│   │   ├── artist/
│   │   │   └── [name]/
│   │   │       ├── page.tsx           # Artist profile (Server Component)
│   │   │       ├── loading.tsx        # Artist skeleton
│   │   │       ├── error.tsx          # Artist error boundary
│   │   │       └── _components/
│   │   │           ├── ArtistHero.tsx           # 3A: Hero banner
│   │   │           ├── ArtistBio.tsx            # 3B: Biography (client - expand/collapse)
│   │   │           ├── AlbumTimeline.tsx         # 3C: Timeline (client - scroll/interaction)
│   │   │           ├── AlbumComparisonChart.tsx  # 3D: Recharts chart (client)
│   │   │           ├── TopTracks.tsx             # 3E: Track list
│   │   │           ├── FunFacts.tsx              # 3F: Auto-generated insights
│   │   │           └── SimilarArtists.tsx        # Similar artist chips
│   │   │
│   │   ├── artist/
│   │   │   └── [name]/
│   │   │       └── album/
│   │   │           └── [album]/
│   │   │               ├── page.tsx   # Album detail page
│   │   │               ├── loading.tsx
│   │   │               └── _components/
│   │   │                   ├── AlbumHeader.tsx
│   │   │                   ├── Tracklist.tsx
│   │   │                   └── TrackDurationChart.tsx
│   │   │
│   │   └── api/
│   │       └── lastfm/
│   │           ├── search/
│   │           │   └── route.ts       # GET /api/lastfm/search?q=
│   │           ├── artist/
│   │           │   └── [name]/
│   │           │       ├── route.ts   # GET /api/lastfm/artist/[name]
│   │           │       ├── albums/
│   │           │       │   └── route.ts  # GET /api/lastfm/artist/[name]/albums
│   │           │       └── tracks/
│   │           │           └── route.ts  # GET /api/lastfm/artist/[name]/tracks
│   │           └── album/
│   │               └── route.ts       # GET /api/lastfm/album?artist=&album=
│   │
│   ├── components/
│   │   ├── ui/                        # Reusable UI primitives
│   │   │   ├── GlassCard.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── GenreChip.tsx
│   │   │   ├── PopularityBar.tsx
│   │   │   ├── SafeImage.tsx          # Image with fallback (client)
│   │   │   ├── Skeleton.tsx           # Skeleton variants
│   │   │   ├── CountUp.tsx            # Animated number counter (client)
│   │   │   └── AmbientBackground.tsx  # Floating gradient orbs (client)
│   │   ├── charts/                    # Recharts wrappers (all client)
│   │   │   ├── AreaChartWrapper.tsx
│   │   │   ├── BarChartWrapper.tsx
│   │   │   ├── CustomTooltip.tsx
│   │   │   └── ChartContainer.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx             # Includes Last.fm attribution
│   │   │   └── SectionNav.tsx         # Sticky section navigation
│   │   └── search/
│   │       ├── HeroSearchBar.tsx      # Client - landing page search
│   │       └── SearchDropdown.tsx     # Client - autocomplete results
│   │
│   ├── lib/
│   │   ├── lastfm.ts                 # Last.fm API client (server-only)
│   │   ├── musicbrainz.ts            # MusicBrainz API client (server-only)
│   │   ├── data-aggregator.ts        # Merges Last.fm + MusicBrainz data (server-only)
│   │   ├── fun-facts.ts              # Fun fact generation algorithms
│   │   ├── normalize.ts              # Last.fm response normalization
│   │   ├── sanitize.ts               # HTML sanitization for bios/wikis
│   │   ├── constants.ts              # API URLs, cache times, limits
│   │   ├── utils.ts                  # Formatting, number helpers
│   │   ├── env.ts                    # Environment variable validation
│   │   └── types.ts                  # TypeScript interfaces
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   └── useMediaQuery.ts
│   │
│   └── config/
│       └── site.ts                   # Site metadata, nav config
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── .env.local                        # LASTFM_API_KEY (never committed)
└── .env.example                      # Template for env vars
```

### Data Flow Architecture

```
┌─────────────┐     ┌──────────────────────────────────────┐     ┌──────────────┐
│   Browser    │     │          Next.js Server               │     │  External     │
│             │     │                                        │     │  APIs         │
│  Landing    │────>│  /api/lastfm/search?q=                │────>│  Last.fm      │
│  Page       │<────│    (normalize + cache 5min)            │<────│  artist.search│
│             │     │                                        │     │              │
│  Artist     │────>│  Server Component: artist/[name]       │     │              │
│  Profile    │     │    ├─ getArtistInfo()         ─────────│────>│  Last.fm      │
│  Page       │     │    ├─ getArtistTopAlbums()    ─────────│────>│  Last.fm      │
│             │     │    ├─ getArtistTopTracks()    ─────────│────>│  Last.fm      │
│             │     │    └─ getAlbumReleaseDates()  ─────────│────>│  MusicBrainz  │
│             │<────│    (aggregate + normalize + cache 24h) │<────│              │
│             │     │                                        │     │              │
│  Album      │────>│  Server Component: album/[album]       │     │              │
│  Detail     │     │    └─ getAlbumInfo()          ─────────│────>│  Last.fm      │
│             │<────│    (normalize + cache 48h)              │<────│  album.getInfo│
└─────────────┘     └──────────────────────────────────────┘     └──────────────┘
```

### Critical Technical Decisions

#### Decision 1: Album Release Dates (MusicBrainz Integration)

**Problem:** Last.fm's `artist.getTopAlbums` does NOT include release dates. `album.getInfo` has a `releasedate` field but it is frequently empty. Without dates, the chronological timeline (the core feature) cannot be built.

**Solution:** Use MusicBrainz API as a supplementary data source.

**Implementation:**
```
src/lib/musicbrainz.ts
```

1. Fetch top 20 albums from Last.fm (`artist.getTopAlbums` with `limit=20`)
2. Filter out entries with `name === "(null)"` or empty images
3. For each album, query MusicBrainz:
   - If album has an `mbid`: query `https://musicbrainz.org/ws/2/release-group/{mbid}?fmt=json`
   - If no `mbid`: query `https://musicbrainz.org/ws/2/release-group/?query=releasegroup:{album} AND artist:{artist}&fmt=json&limit=1`
4. MusicBrainz returns `first-release-date` (YYYY-MM-DD format) and `primary-type` (Album, Single, EP, Compilation, etc.)
5. Merge data: Last.fm provides playcount/images, MusicBrainz provides dates/types
6. Sort chronologically by `first-release-date`
7. Albums without dates go to the end with label "Year unknown"
8. Cache the merged result for 24 hours

**MusicBrainz rate limit:** 1 request per second with a custom User-Agent header. Queue requests with 1-second delay between each.

**Fallback:** If MusicBrainz is unavailable, sort albums by playcount (descending) and show a notice: "Albums sorted by popularity - chronological data unavailable."

#### Decision 2: Artist Images

**Problem:** Last.fm artist images return placeholder stars since May 2019.

**Solution (MVP - no additional API integration):**
- Use the **first album's cover art** (extralarge, 300x300) as the hero background, blurred
- Show **stylized initials** in a gradient circle as the artist "avatar"
- The initials avatar uses the accent purple gradient

```tsx
// Example: Artist initials avatar
<div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
  <span className="text-5xl font-bold text-white font-heading">
    {getInitials(artistName)} // "TS" for Taylor Swift
  </span>
</div>
```

#### Decision 3: N+1 Query Mitigation

**Problem:** Each album needs `album.getInfo` for tracklist/duration, plus MusicBrainz for dates.

**Solution:**
- Limit to **top 20 albums** by playcount
- Filter out `(null)` entries before making detail calls
- Use a **concurrent request limiter**: max 3 concurrent requests to Last.fm, max 1 to MusicBrainz
- **Progressive loading**: show the timeline skeleton, then populate nodes as album details resolve
- **Aggressive caching**: merged album data cached for 24 hours per artist
- **Server-side aggregation endpoint** (`lib/data-aggregator.ts`) that orchestrates all calls and returns the merged result

```typescript
// lib/data-aggregator.ts
export async function getArtistFullProfile(artistName: string) {
  // Phase 1: Parallel fetch of core data (3 requests, ~1 second)
  const [artistInfo, topAlbums, topTracks] = await Promise.all([
    getArtistInfo(artistName),
    getArtistTopAlbums(artistName, 20),
    getArtistTopTracks(artistName, 10),
  ])

  // Phase 2: Filter junk albums
  const validAlbums = topAlbums.filter(a =>
    a.name !== "(null)" && a.name.trim() !== ""
  )

  // Phase 3: Enrich with MusicBrainz (sequential, 1 req/sec)
  const enrichedAlbums = await enrichAlbumsWithMusicBrainz(validAlbums, artistName)

  // Phase 4: Sort chronologically
  const sortedAlbums = sortAlbumsByDate(enrichedAlbums)

  // Phase 5: Generate fun facts
  const funFacts = generateFunFacts(artistInfo, sortedAlbums, topTracks)

  return { artistInfo, albums: sortedAlbums, topTracks, funFacts }
}
```

#### Decision 4: Album Filtering Strategy

**Problem:** `getTopAlbums` returns compilations, singles, live albums, and garbage entries.

**Solution (with MusicBrainz types available):**
1. Filter `name === "(null)"` or empty names
2. Filter albums with completely empty image arrays
3. Use MusicBrainz `primary-type` to categorize: show all types on timeline but visually differentiate
4. Timeline node colors by type:
   - Studio Album: `#8B5CF6` (purple) - full opacity
   - EP: `#34D399` (emerald) - full opacity
   - Single: `#22D3EE` (cyan) - 0.7 opacity
   - Live: `#FBBF24` (amber) - 0.6 opacity
   - Compilation: `#38BDF8` (sky) - 0.5 opacity
5. Provide a filter toggle: "Studio Albums Only" / "All Releases"

#### Decision 5: API Route Structure

**Committed structure:**
```
/api/lastfm/search?q={query}                        → artist.search
/api/lastfm/artist/{name}                           → aggregated profile (artist.getInfo + enriched albums + top tracks + fun facts)
/api/lastfm/artist/{name}/albums                    → artist.getTopAlbums (raw, paginated)
/api/lastfm/artist/{name}/tracks                    → artist.getTopTracks (raw, paginated)
/api/lastfm/album?artist={name}&album={albumName}   → album.getInfo
```

The main artist endpoint (`/api/lastfm/artist/{name}`) returns the fully aggregated profile. The other endpoints exist for lazy-loading additional data.

#### Decision 6: URL Encoding for Artist Names

**Problem:** Artists like "AC/DC" contain slashes that break path-based routing.

**Solution:** Use `encodeURIComponent()` consistently. Next.js App Router handles `%2F` in `[name]` segments correctly. Add explicit handling:

```typescript
// In page.tsx
const decodedName = decodeURIComponent(params.name)

// In links
<Link href={`/artist/${encodeURIComponent(artist.name)}`}>
```

Test cases to validate: `AC/DC`, `Guns N' Roses`, `Bjork`, `The xx`, `!!!`, `+44`

---

## Implementation Phases

### Phase 1: Foundation (Core Setup)

**Goal:** Project scaffold, API layer, data normalization, core types.

**Tasks:**

- [x] Initialize Next.js project with App Router, TypeScript, Tailwind CSS
  - `npx create-next-app@latest sound-scope --typescript --tailwind --app --src-dir`
- [x] Install dependencies:
  ```
  npm install recharts framer-motion lucide-react isomorphic-dompurify
  npx shadcn@latest init
  npx shadcn@latest add button card skeleton badge separator
  ```
- [x] Configure `next.config.ts`:
  - Remote image patterns for `lastfm.freetls.fastly.net`
- [x] Configure `globals.css` (Tailwind v4 @theme inline):
  - Custom colors (dark theme palette from design guide)
  - Custom fonts (Sora, Inter, JetBrains Mono)
  - CSS variables for all colors, gradients, glass effects
  - Base dark theme styles
  - Smooth scroll behavior
- [x] Configure fonts in `layout.tsx` using `next/font/google`
  - `Sora` (headings), `Inter` (body), `JetBrains_Mono` (stats)
- [x] Create `src/lib/env.ts` - environment variable validation
- [x] Create `src/lib/types.ts` - TypeScript interfaces:
  - Raw Last.fm response types (`LastFmArtistInfo`, `LastFmTopAlbum`, etc.)
  - Normalized app types (`Artist`, `Album`, `Track`, `FunFact`)
  - API response types for each endpoint
- [x] Create `src/lib/constants.ts`:
  - API base URLs, cache durations, rate limits, default limits
- [x] Create `src/lib/normalize.ts`:
  - `normalizeArtist()` - converts raw Last.fm artist to clean `Artist` type
  - `normalizeAlbum()` - converts raw album, handles `#text`/`@attr`, string→number
  - `normalizeTrack()` - converts raw track
  - `normalizeImage()` - extracts best available image URL from image array
  - `ensureArray()` - handles single-item-vs-array inconsistency
- [x] Create `src/lib/sanitize.ts`:
  - DOMPurify wrapper allowing: `<p>`, `<br>`, `<a>`, `<em>`, `<strong>`
  - Strip "Read more on Last.fm" links from summaries
- [x] Create `src/lib/lastfm.ts` (server-only):
  - `lastfmFetch<T>()` - base fetch with rate limiting (4 req/sec throttle), error checking, caching
  - `searchArtists(query)` - artist.search
  - `getArtistInfo(name)` - artist.getInfo with `autocorrect=1`
  - `getArtistTopAlbums(name, limit)` - artist.getTopAlbums
  - `getArtistTopTracks(name, limit)` - artist.getTopTracks
  - `getAlbumInfo(artist, album)` - album.getInfo
  - Custom User-Agent header on all requests
  - Error code 29 retry logic (wait + retry once)
- [x] Create `src/lib/musicbrainz.ts` (server-only):
  - `getAlbumByMbid(mbid)` - query by MBID
  - `searchAlbumReleaseInfo(artist, album)` - query by name
  - 1 req/sec rate limiting
  - Custom User-Agent header (required by MusicBrainz)
- [x] Create `src/lib/data-aggregator.ts` (server-only):
  - `getArtistFullProfile(name)` - orchestrates all calls, returns merged data
  - `enrichAlbumsWithMusicBrainz(albums, artist)` - adds dates/types
  - `sortAlbumsByDate(albums)` - chronological sort
- [x] Create all API routes:
  - `app/api/lastfm/search/route.ts`
  - `app/api/lastfm/artist/[name]/route.ts`
  - `app/api/lastfm/artist/[name]/albums/route.ts`
  - `app/api/lastfm/artist/[name]/tracks/route.ts`
  - `app/api/lastfm/album/route.ts`
- [x] Add `Cache-Control` headers to all API routes
- [x] Build passes with zero TypeScript errors

**Files to create:**
```
src/lib/env.ts
src/lib/types.ts
src/lib/constants.ts
src/lib/normalize.ts
src/lib/sanitize.ts
src/lib/lastfm.ts
src/lib/musicbrainz.ts
src/lib/data-aggregator.ts
src/lib/utils.ts
src/lib/fun-facts.ts
src/hooks/useDebounce.ts
src/hooks/useMediaQuery.ts
src/config/site.ts
src/app/api/lastfm/search/route.ts
src/app/api/lastfm/artist/[name]/route.ts
src/app/api/lastfm/artist/[name]/albums/route.ts
src/app/api/lastfm/artist/[name]/tracks/route.ts
src/app/api/lastfm/album/route.ts
.env.local
.env.example
```

### Phase 2: Core UI Components

**Goal:** Build all reusable UI components following the design system.

**Tasks:**

- [ ] Create `src/components/ui/GlassCard.tsx`:
  - Glassmorphic container: `bg-white/[0.05] backdrop-blur-xl border border-white/[0.1]`
  - Optional accent top border (gradient)
  - Optional glow effect
  - Hover state: `hover:bg-white/[0.08] hover:border-white/[0.15]`
- [ ] Create `src/components/ui/StatCard.tsx`:
  - Icon + large number (gradient text, mono font) + label
  - Uses GlassCard as base
- [ ] Create `src/components/ui/GenreChip.tsx`:
  - Genre-specific colors (Pop=purple, Rock=rose, R&B=cyan, etc.)
  - Glassmorphic pill: `bg-white/10 border rounded-full`
- [ ] Create `src/components/ui/PopularityBar.tsx`:
  - Gradient fill bar: `from-purple-500 via-violet-400 to-cyan-400`
  - ARIA progressbar attributes
  - Width proportional to value/max
- [ ] Create `src/components/ui/SafeImage.tsx` (client):
  - next/image with error fallback
  - Cascading size fallback for Last.fm images
  - Placeholder blur support
- [ ] Create `src/components/ui/CountUp.tsx` (client):
  - Animated number counter using framer-motion `useMotionValue`
  - Triggers on scroll into view (`useInView`)
- [ ] Create `src/components/ui/AmbientBackground.tsx` (client):
  - 2-3 floating gradient orbs with slow drift animation
  - Fixed position behind content
  - Respects `prefers-reduced-motion`
- [ ] Create `src/components/ui/Skeleton.tsx`:
  - `ArtistHeroSkeleton` - matches hero layout dimensions
  - `TrackListSkeleton` - matches track row layout
  - `TimelineSkeleton` - matches timeline shape
  - `ChartSkeleton` - rectangle matching chart dimensions
  - `AlbumCardSkeleton` - matches album card dimensions
  - All use dark theme: `bg-white/10 animate-pulse`
- [ ] Create `src/components/charts/CustomTooltip.tsx` (client):
  - Glassmorphic tooltip: `bg-[#12121A]/95 backdrop-blur-md border border-white/10 rounded-xl`
- [ ] Create `src/components/charts/BarChartWrapper.tsx` (client):
  - Lazy-loaded with `next/dynamic` + `ssr: false`
  - Dark theme configuration
  - Rounded bars, gradient fills
- [ ] Create `src/components/charts/AreaChartWrapper.tsx` (client):
  - Lazy-loaded, gradient area fill
- [ ] Create `src/components/charts/ChartContainer.tsx`:
  - Wrapper with title, metric toggle buttons, and loading skeleton
- [ ] Create `src/components/layout/Header.tsx`:
  - Logo + compact search bar (on non-landing pages)
  - Glassmorphic background with blur
- [ ] Create `src/components/layout/Footer.tsx`:
  - "Powered by Last.fm" attribution (TOS requirement)
  - "Built with SoundScope" branding
- [ ] Create `src/components/search/HeroSearchBar.tsx` (client):
  - Large (56px height), glassmorphic
  - 300ms debounce via `useDebounce`
  - `AbortController` for cancelling in-flight requests
  - Full keyboard navigation (Arrow/Enter/Escape)
  - ARIA combobox attributes
  - Focus glow animation: `ring-2 ring-purple-500/20`
  - Scale up on focus: `scale-[1.02]`
  - Placeholder: "What do you want to explore?"
- [ ] Create `src/components/search/SearchDropdown.tsx` (client):
  - Glassmorphic dropdown panel
  - Artist rows: image + name + listener count + chevron
  - Active item highlighting
  - Empty state: "No artists found"
  - Loading state: spinner
  - Error state: "Search unavailable, try again"

**Files to create:**
```
src/components/ui/GlassCard.tsx
src/components/ui/StatCard.tsx
src/components/ui/GenreChip.tsx
src/components/ui/PopularityBar.tsx
src/components/ui/SafeImage.tsx
src/components/ui/CountUp.tsx
src/components/ui/AmbientBackground.tsx
src/components/ui/Skeleton.tsx
src/components/charts/CustomTooltip.tsx
src/components/charts/BarChartWrapper.tsx
src/components/charts/AreaChartWrapper.tsx
src/components/charts/ChartContainer.tsx
src/components/layout/Header.tsx
src/components/layout/Footer.tsx
src/components/search/HeroSearchBar.tsx
src/components/search/SearchDropdown.tsx
```

### Phase 3: Screens & Pages

**Goal:** Build all 4 screens with full data integration.

#### Phase 3A: Landing Page

- [ ] Build `src/app/page.tsx` (Server Component):
  - Full-viewport hero section
  - `--gradient-hero` background
  - AmbientBackground component behind content
  - SoundScope logo (text-based with gradient)
  - Tagline: "Discover Music Like Never Before"
  - HeroSearchBar (centered, prominent)
  - Popular artists row below search (clickable chips):
    - Fetch from `chart.getTopArtists` via Last.fm, limit 4
    - Cache for 24h
    - Show as text links with subtle hover effect
- [ ] Build below-the-fold sections:
  - "What You'll Discover" - 3 GlassCards (Artist Deep Dives, Album Timelines, Track Analytics)
  - Each card has a Lucide icon, title, short description
  - Staggered entrance animation (framer-motion `whileInView`)
- [ ] Add root `layout.tsx`:
  - Fonts configuration
  - Dark theme (`<html className="dark">`)
  - Header (conditional: compact on artist pages, hidden on landing)
  - Footer with Last.fm attribution
  - Vercel Analytics + SpeedInsights

**Files to create/modify:**
```
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
```

#### Phase 3B: Artist Profile Page

- [ ] Build `src/app/artist/[name]/page.tsx` (Server Component):
  - Decode URL parameter: `decodeURIComponent(params.name)`
  - Fetch aggregated profile via `getArtistFullProfile(name)`
  - Handle autocorrect: if returned name differs from URL, redirect
  - Suspense boundaries per section
  - `generateMetadata()` for SEO (title, description, OG image)

- [ ] Build `ArtistHero.tsx` (Section 3A):
  - Banner background: first album cover art, blurred (blur-3xl), gradient overlay
  - Artist initials avatar (gradient circle, 200x200)
  - Artist name (H1, 40px, bold)
  - Genre chips (GenreChip components from `tags.tag`)
  - Stats row: StatCards for listeners, playcount, album count
  - Similar artists as clickable chips (link to `/artist/{name}`)
  - "Share" button: copies URL to clipboard + toast notification

- [ ] Build `ArtistBio.tsx` (Section 3B - client):
  - Truncated bio (first 300 chars of sanitized `bio.content`)
  - "Read more" / "Read less" toggle
  - Sanitized HTML rendering via `dangerouslySetInnerHTML` + DOMPurify
  - Empty state: section hidden when no bio available

- [ ] Build `AlbumTimeline.tsx` (Section 3C - client):
  - **Desktop (1024px+):** Horizontal timeline with scroll
    - Year labels along top axis
    - Connecting line with gradient
    - Album nodes positioned chronologically
  - **Mobile (< 1024px):** Vertical timeline
    - Alternating left/right cards
  - Node design:
    - Size: diameter 32px-56px mapped to playcount (relative to max)
    - Color: by album type (purple=album, cyan=single, emerald=EP, amber=live, sky=compilation)
    - Hover: scale 1.2 + tooltip card (album art, name, year, tracks, playcount)
    - Click: navigate to album detail page
  - Most popular album gets pulsing glow ring
  - Scroll/drag navigation on desktop
  - Filter toggle: "Studio Albums Only" / "All Releases"
  - Framer Motion animations: staggered node entrance, spring hover

- [ ] Build `AlbumComparisonChart.tsx` (Section 3D - client):
  - Default: bar chart showing playcount per album (chronological order)
  - Metric toggle pills: Playcount, Listener Count, Track Count
  - Glassmorphic toggle buttons with colored dots
  - Lazy-loaded Recharts with `next/dynamic` + `ssr: false`
  - Dark theme chart config (from design guide)
  - Custom tooltip component
  - Responsive via `ResponsiveContainer`

- [ ] Build `TopTracks.tsx` (Section 3E):
  - Ranked list of top 10 tracks
  - Each row: rank number (mono) + album art (48x48) + track name + playcount + PopularityBar
  - Popularity relative to #1 track
  - Hover state: `bg-white/5`
  - "Show more" button to load next 10 (up to 50)
  - Empty state: "No tracks found for this artist"

- [ ] Build `FunFacts.tsx` (Section 3F):
  - 3-4 insight cards using GlassCard with left border accent
  - Each card: Lucide icon + "Did you know?" label + fact text
  - Facts generated by `lib/fun-facts.ts`
  - Scroll reveal animation (fade-in + slide-up)

- [ ] Build `SimilarArtists.tsx`:
  - Horizontal scroll of artist chips
  - Each chip links to `/artist/{name}`
  - Empty state: section hidden

- [ ] Create `loading.tsx` - artist page skeleton:
  - Uses `ArtistHeroSkeleton`, `TimelineSkeleton`, `TrackListSkeleton`, `ChartSkeleton`

- [ ] Create `error.tsx` - artist error boundary:
  - "Artist not found" or "Something went wrong" with retry button
  - Search bar to try another artist

**Files to create:**
```
src/app/artist/[name]/page.tsx
src/app/artist/[name]/loading.tsx
src/app/artist/[name]/error.tsx
src/app/artist/[name]/_components/ArtistHero.tsx
src/app/artist/[name]/_components/ArtistBio.tsx
src/app/artist/[name]/_components/AlbumTimeline.tsx
src/app/artist/[name]/_components/AlbumComparisonChart.tsx
src/app/artist/[name]/_components/TopTracks.tsx
src/app/artist/[name]/_components/FunFacts.tsx
src/app/artist/[name]/_components/SimilarArtists.tsx
```

#### Phase 3C: Album Detail Page

- [ ] Build `src/app/artist/[name]/album/[album]/page.tsx`:
  - Fetch album info via `getAlbumInfo(artist, album)`
  - Album artwork as hero (300x300)
  - Album name, artist name, tags
  - Stats: listeners, playcount, track count, total duration
  - `generateMetadata()` for SEO

- [ ] Build `AlbumHeader.tsx`:
  - Album cover art with glassmorphic card
  - Album name (H1) + artist name (link back)
  - Genre chips from album tags
  - Stats row

- [ ] Build `Tracklist.tsx`:
  - Numbered list of tracks with duration
  - Duration in MM:SS format (convert from seconds)
  - Handle `duration === "0"` → show "--:--"
  - Handle single-track albums (object vs array)

- [ ] Build `TrackDurationChart.tsx` (client):
  - Bar chart showing duration per track
  - Lazy-loaded Recharts
  - Shows visual pattern of song lengths within the album

**Files to create:**
```
src/app/artist/[name]/album/[album]/page.tsx
src/app/artist/[name]/album/[album]/loading.tsx
src/app/artist/[name]/album/[album]/_components/AlbumHeader.tsx
src/app/artist/[name]/album/[album]/_components/Tracklist.tsx
src/app/artist/[name]/album/[album]/_components/TrackDurationChart.tsx
```

### Phase 4: Fun Facts Engine

**Goal:** Build the algorithm that generates interesting insights from artist data.

- [ ] Implement `src/lib/fun-facts.ts`:

```typescript
interface FunFact {
  id: string
  icon: string        // Lucide icon name
  category: string    // "career" | "popularity" | "discography" | "comparison"
  title: string       // "Did you know?"
  text: string        // The fact text
}

// Fact generators (compute 8-10, display top 3-4):

// 1. Career Span
// "X has been releasing music for Y years, from [first album] (YYYY) to [latest] (YYYY)"

// 2. Most vs Least Popular Album
// "Their most popular album [name] has Xk plays — Y times more than their least popular [name]"

// 3. Prolificacy
// "X released Y albums in Z years — that's one album every W months"

// 4. Track Count Extremes
// "Their longest album [name] has X tracks, Y times more than their shortest [name] (Z tracks)"

// 5. Top Track Dominance
// "Their #1 track [name] accounts for X% of their total top-10 plays"

// 6. Listener Comparison
// "X has more listeners (Y) than the population of [country]"
// Countries: Iceland (370k), Luxembourg (640k), Montenegro (620k), etc.

// 7. Genre Diversity
// "X spans Y different genres, from [genre1] to [genre2]"

// 8. Similar Artist Connection
// "Last.fm considers [similar artist] as X's closest musical relative"

// Scoring: each fact gets a "interestingness" score based on:
// - How extreme the ratio/comparison is
// - Whether the data is non-trivial (avoid "they have 1 album with 1 track")
// Return top 3-4 by score
```

**Files to create:**
```
src/lib/fun-facts.ts (implementation)
```

### Phase 5: Polish & Optimization

**Goal:** Performance, accessibility, responsive, SEO, attribution.

**Performance:**
- [ ] Audit all `'use client'` directives - minimize client-side JS
- [ ] Verify all Recharts imports are lazy-loaded (`next/dynamic` + `ssr: false`)
- [ ] Add `priority` prop to above-the-fold images only (hero, first visible album art)
- [ ] Verify all `fetch()` calls have explicit `revalidate` values
- [ ] Add `sizes` attribute to all `next/image` instances
- [ ] Test with Lighthouse - target LCP < 2.5s, CLS < 0.1, INP < 200ms

**Accessibility:**
- [ ] Add skip-to-content link in root layout
- [ ] Verify search bar has full ARIA combobox attributes
- [ ] Add `role="progressbar"` + aria attributes to all PopularityBar instances
- [ ] Verify color contrast meets WCAG AA (4.5:1 minimum)
- [ ] Add `prefers-reduced-motion` media query - disable floating orbs + stagger animations
- [ ] Keyboard navigation: tab through timeline nodes, charts have fallback data table
- [ ] ARIA live region for search results count announcement
- [ ] Focus management: on navigation, focus moves to main content heading

**Responsive:**
- [ ] Test at 375px, 768px, 1024px, 1440px
- [ ] Verify timeline switches horizontal→vertical at 1024px breakpoint
- [ ] Stats grid: 2 cols on mobile, 3-4 on desktop
- [ ] Charts: full-width stacked on mobile, side-by-side on desktop
- [ ] Touch targets: minimum 44x44px for all interactive elements
- [ ] Timeline nodes: minimum 44px touch target on mobile

**SEO:**
- [ ] `generateMetadata()` on artist and album pages
- [ ] Static `metadata` on landing page
- [ ] Open Graph images (use album art when available)
- [ ] `robots.txt` and `sitemap.xml` (dynamic for popular artists)

**Attribution & Compliance:**
- [ ] "Powered by Last.fm" in footer with link to last.fm
- [ ] All artist/album/track names link back to their Last.fm pages (TOS requirement)
- [ ] "Data from AudioScrobbler" attribution

**Error States (full inventory):**

| Section | Loading | Empty | Error |
|---------|---------|-------|-------|
| Search dropdown | Spinner icon | "No artists found" | "Search unavailable" |
| Artist Hero | HeroSkeleton | N/A (404 if no artist) | error.tsx boundary |
| Biography | Text skeleton | Section hidden | Section shows "Bio unavailable" |
| Timeline | TimelineSkeleton | "No albums found" dashed border card | "Timeline data unavailable" |
| Comparison Chart | ChartSkeleton | Hidden if < 2 albums | "Chart unavailable" |
| Top Tracks | TrackListSkeleton | "No tracks found" | "Tracks unavailable" |
| Fun Facts | Card skeletons | Hidden if not enough data | Hidden |
| Album Detail | Full page skeleton | N/A (404) | error.tsx boundary |

**Files to modify:** All component files for accessibility/responsive fixes.

---

## Alternative Approaches Considered

### 1. Spotify API instead of Last.fm
- **Rejected because:** Spotify requires OAuth for most endpoints, making the app much more complex. Last.fm provides artist stats, bios, similar artists, and tags without any authentication beyond an API key. Spotify would provide better images and audio features (danceability, energy, etc.) but at the cost of user login friction.
- **Future consideration:** Could add Spotify integration as an optional enhancement for logged-in users.

### 2. Client-side API calls instead of server proxy
- **Rejected because:** Last.fm API has no CORS headers, so browser-side calls would fail. Additionally, the API key would be exposed in client-side code.

### 3. Single-page app (React SPA) instead of Next.js
- **Rejected because:** Next.js provides SSR for SEO, API routes for secure proxying, ISR for caching, and Vercel integration. A SPA would lose all of these benefits.

### 4. D3.js instead of Recharts for visualizations
- **Rejected because:** D3 is more powerful but has a steep learning curve and requires imperative DOM manipulation that conflicts with React's declarative model. Recharts provides sufficient charting capabilities with a React-native API. The timeline component will be custom-built with CSS/SVG + Framer Motion rather than using either library.

### 5. Wikipedia API for biographies instead of Last.fm
- **Considered but deferred:** Wikipedia has more comprehensive biographies, but Last.fm bios are sufficient for the MVP and don't require a second API integration. Can be added later.

---

## System-Wide Impact

### Interaction Graph
- User searches → debounce timer → `/api/lastfm/search` → Last.fm `artist.search` → normalize → dropdown render
- User selects artist → Next.js router navigation → Server Component fetch → `data-aggregator.ts` → parallel Last.fm + sequential MusicBrainz calls → normalize + merge → render all sections via Suspense

### Error & Failure Propagation
- Last.fm API errors return HTTP 200 with `error` field → caught in `lastfmFetch()` → thrown as `Error` → caught by individual section try/catch OR propagated to `error.tsx`
- MusicBrainz timeout → caught in `enrichAlbumsWithMusicBrainz()` → album marked as "date unknown" → timeline still renders (graceful degradation)
- Rate limit (error 29) → single retry after delay → if still limited, return cached data or partial results

### State Lifecycle Risks
- No persistent user state (no auth, no database) → no orphaned state risk
- Cache consistency: all caches are time-based (ISR) with known durations → no stale-forever risk
- MusicBrainz enrichment is idempotent → safe to retry

### API Surface Parity
- All data is consumed read-only from Last.fm → no mutation risk
- All API routes proxy to the same `lib/lastfm.ts` client → consistent error handling

---

## Acceptance Criteria

### Functional Requirements

- [ ] User can search for artists with instant autocomplete (< 500ms after typing stops)
- [ ] Search dropdown shows artist name, listener count, and navigates on selection
- [ ] Artist profile page loads and displays all 6 sections (Hero, Bio, Timeline, Chart, Tracks, Fun Facts)
- [ ] Timeline displays albums in chronological order with release year labels
- [ ] Timeline nodes are sized by popularity and colored by album type
- [ ] User can click a timeline node to see album details
- [ ] Album comparison chart supports toggling between playcount, listeners, and track count
- [ ] Top tracks show ranked list with popularity bars relative to #1 track
- [ ] Fun facts display 3-4 auto-generated insights from the artist's data
- [ ] Album detail page shows full tracklist with durations
- [ ] Similar artist chips navigate to that artist's profile
- [ ] All pages work without JavaScript (SSR content visible)
- [ ] "Powered by Last.fm" attribution visible in footer

### Non-Functional Requirements

- [ ] LCP < 2.5 seconds on artist profile page (3G connection)
- [ ] CLS < 0.1 across all pages
- [ ] INP < 200ms for all interactions
- [ ] Lighthouse score > 90 for Performance, Accessibility, Best Practices, SEO
- [ ] WCAG AA compliance (4.5:1 contrast, keyboard navigable, screen reader compatible)
- [ ] Works on Chrome, Firefox, Safari, Edge (latest 2 versions)
- [ ] Responsive: functional at 375px, 768px, 1024px, 1440px
- [ ] API key never exposed to client-side code
- [ ] Rate limiting: stays under 4 req/sec to Last.fm

### Quality Gates

- [ ] All TypeScript - no `any` types except in API response normalization layer
- [ ] All components have proper loading, empty, and error states
- [ ] Bio/wiki HTML properly sanitized before rendering
- [ ] URL encoding tested with edge case artist names (AC/DC, Guns N' Roses, Bjork, !!!)
- [ ] Deployed on Vercel with preview deployments working

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|---------------|
| Artist profile page load time | < 3 seconds cold, < 1 second cached | Vercel Speed Insights |
| Search autocomplete latency | < 500ms from keystroke | Performance marks in code |
| Bounce rate on landing page | < 40% | Vercel Analytics |
| Pages per session | > 3 (explore multiple artists) | Vercel Analytics |
| Lighthouse Performance score | > 90 | Lighthouse CI |

---

## Dependencies & Prerequisites

| Dependency | Status | Risk |
|-----------|--------|------|
| Last.fm API key | Need to create account at last.fm/api/account/create | Low - free, instant |
| Last.fm API uptime | External dependency | Medium - add retry + cache |
| MusicBrainz API availability | External dependency (1 req/sec limit) | Medium - graceful fallback |
| Vercel account | Need free tier account | Low |
| Node.js 18+ | Required for Next.js | Low |

---

## Risk Analysis & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Last.fm API rate limiting | Page loads fail | Medium | Aggressive caching (24h), throttle to 4 req/sec, retry logic |
| MusicBrainz unavailable | Timeline not chronological | Low | Fallback to popularity sort with notice |
| Artist images broken | Hero looks empty | Already confirmed | Use album art + initials avatar (Decision 2) |
| N+1 query performance | Slow page loads for prolific artists | High | Limit to 20 albums, concurrent limiter, progressive loading |
| Special chars in URLs | 404 errors for artists like AC/DC | Medium | Consistent encodeURIComponent, test edge cases |
| Last.fm data quality varies | Empty bios, missing tags | Medium | Graceful degradation per section |
| Recharts SSR hydration mismatch | Console errors, visual glitches | Medium | All Recharts components use `ssr: false` via `next/dynamic` |

---

## Documentation Plan

- [ ] `README.md` - project setup, env vars, how to run locally, how to deploy
- [ ] `.env.example` - template with required variables
- [ ] Code comments only where logic is non-obvious (normalization layer, rate limiting)
- [ ] Component JSDoc for public API of reusable components (GlassCard, StatCard, etc.)

---

## Sources & References

### Internal References
- API Research: `tasks/lastfm-api-research.md` - complete endpoint documentation
- Best Practices: `BEST_PRACTICES.md` - Next.js architecture patterns
- Design Guide: `tasks/design-guide.md` - visual design system

### External References
- [Last.fm API Documentation](https://www.last.fm/api)
- [MusicBrainz API Documentation](https://musicbrainz.org/doc/MusicBrainz_API)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Recharts Documentation](https://recharts.org)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [UI/UX Pro Max Skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [21st.dev Community Components](https://21st.dev/community/components)

### Design Inspiration
- [Spotify Dashboard UI Redesign by Rafael Marrama](https://dribbble.com/shots/9838093)
- [Dark Glassmorphism Aesthetic 2026](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026)
- [shadcn/ui Dashboard Example](https://ui.shadcn.com/examples/dashboard)
