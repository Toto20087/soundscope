# SoundScope - Next.js App Router Best Practices Guide

> Comprehensive best practices for building a professional music analytics web app with Next.js 14+/15+/16+ App Router, Last.fm API, Recharts, Tailwind CSS, deployed on Vercel.
>
> Research date: March 2026 | Next.js docs version: 16.2.1

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Data Fetching Strategy](#2-data-fetching-strategy)
3. [Performance Optimization](#3-performance-optimization)
4. [UX Best Practices](#4-ux-best-practices)
5. [State Management](#5-state-management)
6. [Error Handling & Edge Cases](#6-error-handling--edge-cases)
7. [Deployment & Environment](#7-deployment--environment)

---

## 1. Project Architecture

### 1.1 Recommended Folder Structure

Use the `src/` directory to separate application code from config files. Organize by **feature/route colocation** -- the most scalable pattern for medium-to-large apps:

```
sound-scope/
├── public/
│   ├── fonts/
│   └── images/
│       └── placeholder-artist.png    # Fallback for missing images
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout (html, body, providers, fonts)
│   │   ├── page.tsx                  # Homepage / landing
│   │   ├── loading.tsx               # Global loading skeleton
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── not-found.tsx             # 404 page
│   │   ├── globals.css               # Tailwind directives + global styles
│   │   │
│   │   ├── artist/
│   │   │   └── [name]/
│   │   │       ├── page.tsx          # Artist detail page (Server Component)
│   │   │       ├── loading.tsx       # Artist-specific skeleton
│   │   │       ├── error.tsx         # Artist-specific error boundary
│   │   │       └── _components/      # Private: artist-specific UI
│   │   │           ├── ArtistHeader.tsx
│   │   │           ├── TopTracks.tsx
│   │   │           ├── TopAlbums.tsx
│   │   │           └── ListenerChart.tsx  # 'use client' - Recharts
│   │   │
│   │   ├── search/
│   │   │   ├── page.tsx              # Search results page
│   │   │   └── _components/
│   │   │       └── SearchResults.tsx
│   │   │
│   │   └── api/
│   │       └── lastfm/
│   │           ├── search/
│   │           │   └── route.ts      # GET /api/lastfm/search?q=...
│   │           ├── artist/
│   │           │   └── [name]/
│   │           │       └── route.ts  # GET /api/lastfm/artist/[name]
│   │           └── top-artists/
│   │               └── route.ts      # GET /api/lastfm/top-artists
│   │
│   ├── components/
│   │   ├── ui/                       # Generic, reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── ErrorFallback.tsx
│   │   ├── charts/                   # 'use client' -- Recharts wrappers
│   │   │   ├── BarChartWrapper.tsx
│   │   │   ├── LineChartWrapper.tsx
│   │   │   └── ChartContainer.tsx
│   │   ├── layout/                   # Shared layout pieces
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   └── search/                   # Search-related components
│   │       ├── SearchBar.tsx         # 'use client' - needs event handlers
│   │       └── SearchDropdown.tsx    # 'use client' - needs state
│   │
│   ├── lib/
│   │   ├── lastfm.ts                # Last.fm API client (server-only)
│   │   ├── constants.ts             # API URLs, revalidation times, limits
│   │   ├── utils.ts                 # Formatting, number helpers
│   │   └── types.ts                 # TypeScript interfaces for API responses
│   │
│   ├── hooks/
│   │   ├── useDebounce.ts           # Debounced value hook
│   │   └── useMediaQuery.ts         # Responsive breakpoint hook
│   │
│   └── config/
│       └── site.ts                  # Site metadata, navigation config
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.local                       # LASTFM_API_KEY (never committed)
```

### 1.2 Server Components vs Client Components

**The golden rule: default to Server Components. Add `'use client'` only when you genuinely need the browser.**

| Use Server Components for | Use Client Components for |
|---|---|
| Data fetching from Last.fm | Interactive search bar with dropdown |
| Rendering artist/album info | Charts (Recharts requires DOM access) |
| Page layouts and static content | Toggle/filter buttons with state |
| SEO-critical content | Animations (Framer Motion/Motion) |
| Accessing env vars (API keys) | `onClick`, `onChange` handlers |
| Rendering lists, grids, cards | `useState`, `useEffect`, `useRef` |

**The composition pattern** -- push `'use client'` as far down the tree as possible:

```tsx
// app/artist/[name]/page.tsx -- SERVER COMPONENT (no directive needed)
import { getArtistInfo } from '@/lib/lastfm'
import ArtistHeader from './_components/ArtistHeader'  // Server
import TopTracks from './_components/TopTracks'          // Server
import ListenerChart from './_components/ListenerChart'  // Client

export default async function ArtistPage({ params }) {
  const { name } = await params
  const artist = await getArtistInfo(name)

  return (
    <main>
      <ArtistHeader artist={artist} />          {/* Server: just renders HTML */}
      <TopTracks tracks={artist.topTracks} />   {/* Server: just renders HTML */}
      <ListenerChart data={artist.stats} />     {/* Client: needs Recharts */}
    </main>
  )
}
```

```tsx
// _components/ListenerChart.tsx -- CLIENT COMPONENT
'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function ListenerChart({ data }: { data: ChartData[] }) {
  // Only this component ships JS to the browser
  return <LineChart data={data}>...</LineChart>
}
```

**Key principle:** Server Components can import Client Components, but Client Components cannot import Server Components. Instead, pass Server Components as `children` props:

```tsx
// ClientWrapper.tsx
'use client'
export function ClientWrapper({ children }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)}>Toggle</button>
      {expanded && children}  {/* children can be Server Components */}
    </div>
  )
}
```

### 1.3 API Route Organization

Organize API routes to mirror the external API structure:

```
app/api/lastfm/
├── search/route.ts          # Proxies artist.search
├── artist/[name]/route.ts   # Proxies artist.getInfo + artist.getTopTracks
├── top-artists/route.ts     # Proxies chart.getTopArtists
└── album/[...slug]/route.ts # Proxies album.getInfo
```

Each route handler should:
- Validate query params
- Add the API key server-side (never expose it)
- Transform responses to only the shape your frontend needs
- Include proper error handling and status codes
- Set appropriate cache headers

```ts
// app/api/lastfm/search/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: 'Query must be at least 2 characters' },
      { status: 400 }
    )
  }

  try {
    const data = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=artist.search&artist=${encodeURIComponent(query)}&api_key=${process.env.LASTFM_API_KEY}&format=json`
    )

    if (!data.ok) {
      throw new Error(`Last.fm API error: ${data.status}`)
    }

    const json = await data.json()

    // Transform to only the shape your frontend needs
    const artists = json.results?.artistmatches?.artist?.map((a: any) => ({
      name: a.name,
      listeners: parseInt(a.listeners),
      image: a.image?.find((i: any) => i.size === 'large')?.['#text'] || null,
    })) ?? []

    return NextResponse.json({ artists }, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search artists' },
      { status: 502 }
    )
  }
}
```

---

## 2. Data Fetching Strategy

### 2.1 Server Components vs API Routes: The Decision for Last.fm

**Recommendation: Use a hybrid approach.**

| Scenario | Pattern | Why |
|---|---|---|
| Initial page load (artist page, homepage) | Fetch directly in Server Components via `lib/lastfm.ts` | No extra network hop, automatic deduplication, full caching control |
| Client-initiated search (autocomplete) | Call internal API routes (`/api/lastfm/search`) | Client Components cannot access env vars; need an HTTP endpoint |
| Data that multiple pages share | Cached function with `'use cache'` or `fetch` + revalidation | Deduplicated across renders |

**Server-side data layer** (`lib/lastfm.ts` -- server-only):

```ts
// src/lib/lastfm.ts
import 'server-only'  // Prevents accidental client import

const LASTFM_BASE = 'https://ws.audioscrobbler.com/2.0'
const API_KEY = process.env.LASTFM_API_KEY!

async function lastfmFetch<T>(params: Record<string, string>): Promise<T> {
  const searchParams = new URLSearchParams({
    ...params,
    api_key: API_KEY,
    format: 'json',
  })

  const res = await fetch(`${LASTFM_BASE}?${searchParams}`, {
    next: { revalidate: 3600 },  // Cache for 1 hour
  })

  if (!res.ok) {
    throw new Error(`Last.fm API error: ${res.status}`)
  }

  const data = await res.json()

  // Last.fm sometimes returns 200 with error in body
  if (data.error) {
    throw new Error(`Last.fm error ${data.error}: ${data.message}`)
  }

  return data as T
}

export async function getArtistInfo(name: string) {
  return lastfmFetch<ArtistInfoResponse>({
    method: 'artist.getinfo',
    artist: name,
    autocorrect: '1',
  })
}

export async function getTopArtists() {
  return lastfmFetch<TopArtistsResponse>({
    method: 'chart.gettopartists',
    limit: '20',
  })
}

export async function searchArtists(query: string) {
  return lastfmFetch<SearchResponse>({
    method: 'artist.search',
    artist: query,
    limit: '10',
  })
}
```

**Critical Last.fm API caveat:** Some API calls return HTTP 200 even when the response body contains an error. Always check for an `error` field in the JSON response, not just the HTTP status code.

### 2.2 Caching Strategies

**Tiered caching based on data volatility:**

| Data Type | Cache Strategy | Revalidation | Example |
|---|---|---|---|
| Artist bio/info | Long cache | `revalidate: 86400` (24h) | Artist description, formation year |
| Top tracks/albums | Medium cache | `revalidate: 3600` (1h) | Chart positions change periodically |
| Search results | Short cache | `revalidate: 300` (5min) | Search autocomplete |
| Listener counts | Short cache | `revalidate: 1800` (30min) | Play counts update frequently |
| Static charts data | Build-time | `revalidate: 86400` (24h) | Global top artists |

**Modern caching with `use cache` (Next.js 16+ with cacheComponents):**

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}

// lib/lastfm.ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getArtistInfo(name: string) {
  'use cache'
  cacheLife('hours')          // Built-in profile: cache for hours
  cacheTag(`artist-${name}`)  // Tag for on-demand revalidation

  const res = await fetch(`${LASTFM_BASE}?method=artist.getinfo&artist=${encodeURIComponent(name)}&api_key=${API_KEY}&format=json`)
  return res.json()
}
```

**Legacy caching (Next.js 14/15 without cacheComponents):**

```ts
// Use fetch-level caching
const res = await fetch(url, {
  next: { revalidate: 3600 }  // ISR: revalidate every hour
})

// Or force dynamic for always-fresh data
const res = await fetch(url, {
  cache: 'no-store'  // Always fetch fresh
})
```

**Best practice:** Set explicit revalidation on every `fetch` call. Do not rely on framework defaults, which can change between Next.js versions.

### 2.3 Loading States and Suspense Boundaries

**Place Suspense boundaries at data boundaries, not page boundaries.** Each independent data source should have its own boundary so one slow fetch does not block the entire page:

```tsx
// app/artist/[name]/page.tsx
import { Suspense } from 'react'
import ArtistHeader from './_components/ArtistHeader'
import TopTracks from './_components/TopTracks'
import SimilarArtists from './_components/SimilarArtists'
import { ArtistHeaderSkeleton, TrackListSkeleton, ArtistGridSkeleton } from '@/components/ui/Skeleton'

export default async function ArtistPage({ params }) {
  const { name } = await params

  return (
    <main>
      {/* Each section loads independently */}
      <Suspense fallback={<ArtistHeaderSkeleton />}>
        <ArtistHeader name={name} />
      </Suspense>

      <Suspense fallback={<TrackListSkeleton count={10} />}>
        <TopTracks name={name} />
      </Suspense>

      <Suspense fallback={<ArtistGridSkeleton count={6} />}>
        <SimilarArtists name={name} />
      </Suspense>
    </main>
  )
}
```

**Each component fetches its own data:**

```tsx
// _components/TopTracks.tsx -- Server Component
import { getArtistTopTracks } from '@/lib/lastfm'

export default async function TopTracks({ name }: { name: string }) {
  const tracks = await getArtistTopTracks(name)
  // ... render tracks
}
```

### 2.4 Error Handling for Data Fetching

Use file-based error boundaries (`error.tsx`) at the route level, and try/catch within Server Components for graceful inline degradation:

```tsx
// _components/SimilarArtists.tsx
import { getSimilarArtists } from '@/lib/lastfm'

export default async function SimilarArtists({ name }: { name: string }) {
  try {
    const similar = await getSimilarArtists(name)

    if (!similar || similar.length === 0) {
      return (
        <section>
          <h2>Similar Artists</h2>
          <p className="text-gray-500">No similar artists found.</p>
        </section>
      )
    }

    return (
      <section>
        <h2>Similar Artists</h2>
        {/* render similar artists */}
      </section>
    )
  } catch (error) {
    // Don't crash the whole page -- degrade gracefully
    return (
      <section>
        <h2>Similar Artists</h2>
        <p className="text-gray-500">Unable to load similar artists right now.</p>
      </section>
    )
  }
}
```

---

## 3. Performance Optimization

### 3.1 Image Optimization with next/image

**Configure remote image domains** for Last.fm album/artist art:

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
        pathname: '/i/u/**',
      },
      {
        protocol: 'https',
        hostname: '*.lastfm.freetls.fastly.net',
      },
    ],
  },
}
```

**Use next/image with proper sizing and fallbacks:**

```tsx
import Image from 'next/image'

function ArtistImage({ src, name }: { src: string | null; name: string }) {
  const imageSrc = src || '/images/placeholder-artist.png'

  return (
    <Image
      src={imageSrc}
      alt={`${name} artist photo`}
      width={300}
      height={300}
      className="rounded-lg object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg..."  // Tiny blur placeholder
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 300px"
      onError={(e) => {
        // Fallback if remote image fails
        (e.target as HTMLImageElement).src = '/images/placeholder-artist.png'
      }}
    />
  )
}
```

**Key optimizations:**
- `sizes` attribute tells the browser which image size to download at each viewport width -- reduces payload by 40-70%
- `placeholder="blur"` with `blurDataURL` eliminates layout shift during load
- Next.js automatically serves WebP/AVIF formats, compressing images 60-80% vs originals
- Use `priority` prop only for above-the-fold images (hero, first visible artist)
- Use `loading="lazy"` (default) for below-the-fold images

### 3.2 Code Splitting and Lazy Loading for Recharts

Recharts is a heavy library (~200KB). Never import it statically in a page component. Use `next/dynamic` with `ssr: false`:

```tsx
// components/charts/LazyLineChart.tsx
'use client'

import dynamic from 'next/dynamic'

const LineChart = dynamic(
  () => import('./LineChartInner'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200" />
    ),
  }
)

export default LineChart
```

```tsx
// components/charts/LineChartInner.tsx
'use client'

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface ChartProps {
  data: { name: string; listeners: number; playcount: number }[]
  metric: 'listeners' | 'playcount'
}

export default function LineChartInner({ data, metric }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={metric} stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}
```

**Why `ssr: false`?** Recharts depends on browser DOM APIs (SVG rendering, ResizeObserver). Server-rendering it will fail or produce hydration mismatches. Disable SSR and show a skeleton placeholder instead.

**Conditionally load charts** -- only import when the user scrolls to the chart section or toggles it visible:

```tsx
'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('./LineChartInner'), {
  ssr: false,
  loading: () => <div className="h-[300px] animate-pulse bg-gray-200 rounded" />,
})

export function ExpandableChart({ data }) {
  const [showChart, setShowChart] = useState(false)

  return (
    <div>
      <button onClick={() => setShowChart(!showChart)}>
        {showChart ? 'Hide' : 'Show'} Chart
      </button>
      {showChart && <Chart data={data} metric="listeners" />}
    </div>
  )
}
```

### 3.3 Streaming and Progressive Rendering

Next.js supports Partial Prerendering (PPR), which combines static and dynamic rendering on a single page. The static shell (layout, headers, navigation) is served instantly from the CDN, while dynamic content streams in as it resolves.

**For SoundScope, the ideal split:**

| Pre-rendered (Static Shell) | Streamed (Dynamic) |
|---|---|
| Page layout, header, nav | Artist info from Last.fm |
| Section headings | Top tracks list |
| Loading skeletons | Chart visualizations |
| Footer | Similar artists |
| Static text/labels | Search results |

**Enable PPR (Next.js 16+):**

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,  // Enables PPR as default behavior
}
```

### 3.4 Metadata and SEO

Use `generateMetadata` for dynamic pages, static `metadata` export for fixed pages:

```tsx
// app/artist/[name]/page.tsx
import type { Metadata } from 'next'
import { getArtistInfo } from '@/lib/lastfm'

export async function generateMetadata({ params }): Promise<Metadata> {
  const { name } = await params
  const artist = await getArtistInfo(name)  // Deduplicated with page fetch

  return {
    title: `${artist.name} - Music Stats | SoundScope`,
    description: `Explore ${artist.name}'s listening stats, top tracks, and albums on SoundScope.`,
    openGraph: {
      title: `${artist.name} | SoundScope`,
      description: `${artist.stats.listeners} listeners worldwide`,
      images: artist.image ? [{ url: artist.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} | SoundScope`,
    },
  }
}
```

```tsx
// app/layout.tsx -- static metadata for root
export const metadata: Metadata = {
  title: {
    default: 'SoundScope - Music Analytics',
    template: '%s | SoundScope',
  },
  description: 'Discover music analytics, artist stats, and listening trends.',
  metadataBase: new URL('https://soundscope.vercel.app'),
}
```

**Do not use `generateMetadata` for static pages** -- it adds unnecessary overhead. Use the static `metadata` export instead.

### 3.5 Font Loading

Use `next/font` for zero-layout-shift font loading:

```tsx
// app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',         // Show fallback font immediately, swap when loaded
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
}
```

**Why `next/font`?** It self-hosts fonts (no external requests to Google Fonts), eliminates CLS from font loading, and enables automatic subsetting.

---

## 4. UX Best Practices

### 4.1 Search UX: Debouncing, Dropdown, Keyboard Navigation

**Debouncing** -- use 300ms delay to avoid hammering the API on every keystroke:

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

**Complete search bar with keyboard navigation:**

```tsx
// components/search/SearchBar.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Artist[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const router = useRouter()

  const debouncedQuery = useDebounce(query, 300)

  // Fetch results when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    fetch(`/api/lastfm/search?q=${encodeURIComponent(debouncedQuery)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.artists ?? [])
        setIsOpen(true)
        setActiveIndex(-1)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
      .finally(() => setIsLoading(false))

    return () => controller.abort()  // Cancel in-flight requests
  }, [debouncedQuery])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex((prev) => Math.max(prev - 1, -1))
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && results[activeIndex]) {
          router.push(`/artist/${encodeURIComponent(results[activeIndex].name)}`)
          setIsOpen(false)
        }
        break
      case 'Escape':
        setIsOpen(false)
        inputRef.current?.blur()
        break
    }
  }, [isOpen, activeIndex, results, router])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.closest('.search-container')?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="search-container relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-activedescendant={activeIndex >= 0 ? `result-${activeIndex}` : undefined}
        aria-autocomplete="list"
        aria-controls="search-results"
        placeholder="Search artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2"
      />

      {isLoading && (
        <div className="absolute right-3 top-2.5">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
        </div>
      )}

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          id="search-results"
          role="listbox"
          className="absolute z-50 mt-1 w-full rounded-lg border bg-white shadow-lg"
        >
          {results.map((artist, index) => (
            <li
              key={artist.name}
              id={`result-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={`cursor-pointer px-4 py-2 ${
                index === activeIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                router.push(`/artist/${encodeURIComponent(artist.name)}`)
                setIsOpen(false)
              }}
            >
              {artist.name}
              <span className="ml-2 text-sm text-gray-500">
                {artist.listeners.toLocaleString()} listeners
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

**Key UX details:**
- `AbortController` cancels in-flight requests when the user types again
- Arrow keys navigate the dropdown, Enter selects, Escape closes
- ARIA attributes (`role="combobox"`, `aria-expanded`, `aria-activedescendant`) for screen reader accessibility
- Click-outside detection closes the dropdown
- Loading spinner only shows during network requests, not during the debounce wait

### 4.2 Loading Skeletons vs Spinners

**Use skeletons for content loading, spinners only for brief actions.**

| Scenario | Pattern | Why |
|---|---|---|
| Page/section loading | Skeleton | Shows structure of incoming content, reduces perceived wait |
| Artist page loading | Skeleton matching layout | Prevents CLS, sets expectations |
| Search autocomplete | Inline spinner | Brief, non-layout action |
| Form submission | Button spinner | Blocking action, no layout to preview |
| Chart rendering | Skeleton rectangle | Heavy component, needs placeholder |

**Design skeletons that match the actual content dimensions exactly** to prevent Cumulative Layout Shift:

```tsx
// components/ui/Skeleton.tsx
export function ArtistHeaderSkeleton() {
  return (
    <div className="flex animate-pulse gap-6">
      {/* Artist image placeholder -- matches actual 300x300 image */}
      <div className="h-[300px] w-[300px] rounded-lg bg-gray-200" />
      <div className="flex-1 space-y-4">
        {/* Name */}
        <div className="h-8 w-48 rounded bg-gray-200" />
        {/* Stats */}
        <div className="flex gap-4">
          <div className="h-6 w-24 rounded bg-gray-200" />
          <div className="h-6 w-24 rounded bg-gray-200" />
        </div>
        {/* Bio */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export function TrackListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4">
          <div className="h-5 w-8 rounded bg-gray-200" />    {/* Rank */}
          <div className="h-10 w-10 rounded bg-gray-200" />  {/* Album art */}
          <div className="flex-1">
            <div className="h-4 w-48 rounded bg-gray-200" /> {/* Track name */}
            <div className="mt-1 h-3 w-24 rounded bg-gray-200" /> {/* Play count */}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-200" />
  )
}
```

### 4.3 Smooth Scrolling Between Sections

**CSS approach (simplest, recommended):**

```css
/* globals.css */
html {
  scroll-behavior: smooth;
}
```

**For scroll links within a page (e.g., section nav on artist page):**

```tsx
// Add data-scroll-behavior to prevent conflict with Next.js Link
// In your root layout:
<html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
```

```tsx
// Section navigation component
function SectionNav() {
  return (
    <nav className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
      <a href="#top-tracks" className="px-4 py-2 hover:text-blue-600">Top Tracks</a>
      <a href="#albums" className="px-4 py-2 hover:text-blue-600">Albums</a>
      <a href="#stats" className="px-4 py-2 hover:text-blue-600">Stats</a>
      <a href="#similar" className="px-4 py-2 hover:text-blue-600">Similar Artists</a>
    </nav>
  )
}
```

**For programmatic smooth scrolling (e.g., "scroll to chart" button):**

```tsx
'use client'
function ScrollToButton({ targetId, label }: { targetId: string; label: string }) {
  return (
    <button
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      {label}
    </button>
  )
}
```

### 4.4 Responsive Design for Data-Heavy Pages

**Use Tailwind's responsive utilities to restructure layouts at different breakpoints:**

```tsx
// Artist page layout
<div className="flex flex-col gap-6 lg:flex-row">
  {/* Artist image: full width on mobile, fixed width on desktop */}
  <div className="w-full lg:w-[300px] lg:shrink-0">
    <ArtistImage ... />
  </div>

  {/* Info: stacks below image on mobile, sits beside it on desktop */}
  <div className="flex-1 space-y-4">
    <h1 className="text-2xl font-bold md:text-4xl">{artist.name}</h1>
    {/* Stats grid: 2 cols on mobile, 4 on desktop */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard label="Listeners" value={artist.listeners} />
      <StatCard label="Play Count" value={artist.playcount} />
      <StatCard label="Albums" value={albums.length} />
      <StatCard label="Similar" value={similar.length} />
    </div>
  </div>
</div>

{/* Charts: single column on mobile, side-by-side on desktop */}
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <ChartCard title="Listeners Over Time">
    <LazyLineChart data={listenerData} metric="listeners" />
  </ChartCard>
  <ChartCard title="Play Count Trend">
    <LazyLineChart data={playcountData} metric="playcount" />
  </ChartCard>
</div>
```

**For charts specifically:** Use `ResponsiveContainer` from Recharts to fill the parent container, and set chart `height` using Tailwind classes on the wrapper.

### 4.5 Animations with Motion (Framer Motion)

**Motion (formerly Framer Motion) works with App Router but requires `'use client'`.** Create thin wrapper components:

```tsx
// components/ui/AnimatedCard.tsx
'use client'

import { motion } from 'motion/react'

export function AnimatedCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedList({ children }: { children: React.ReactNode }) {
  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {children}
    </motion.ul>
  )
}

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      {children}
    </motion.li>
  )
}
```

**Use sparingly.** Animations should enhance understanding (staggered list reveals, chart transitions), not distract. Avoid page transition animations in App Router -- they conflict with streaming and partial prerendering.

**Import from `motion/react`** (not `framer-motion`) for the latest API. The package is `motion` on npm.

---

## 5. State Management

### 5.1 URL-Based State Management (searchParams)

**Principle: If state affects what the user sees and should be shareable/bookmarkable, put it in the URL.**

Perfect for SoundScope scenarios:
- Search query: `?q=radiohead`
- Active tab/section: `?tab=albums`
- Chart metric: `?metric=listeners`
- Time period filter: `?period=7day`
- Sort order: `?sort=playcount`

**Server Component pattern** -- read searchParams in the page:

```tsx
// app/artist/[name]/page.tsx
interface PageProps {
  params: Promise<{ name: string }>
  searchParams: Promise<{ metric?: string; period?: string }>
}

export default async function ArtistPage({ params, searchParams }: PageProps) {
  const { name } = await params
  const { metric = 'listeners', period = '7day' } = await searchParams

  const artist = await getArtistInfo(name)
  const chartData = await getArtistChartData(name, period)

  return (
    <main>
      <ArtistHeader artist={artist} />
      <MetricToggle currentMetric={metric} />  {/* Client Component */}
      <LazyLineChart data={chartData} metric={metric} />
    </main>
  )
}
```

**Client Component pattern** -- update URL without full page reload:

```tsx
// components/MetricToggle.tsx
'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

const METRICS = ['listeners', 'playcount', 'albums'] as const

export function MetricToggle({ currentMetric }: { currentMetric: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function setMetric(metric: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('metric', metric)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-2" role="tablist">
      {METRICS.map((metric) => (
        <button
          key={metric}
          role="tab"
          aria-selected={metric === currentMetric}
          onClick={() => setMetric(metric)}
          className={`rounded-full px-4 py-1 text-sm ${
            metric === currentMetric
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {metric.charAt(0).toUpperCase() + metric.slice(1)}
        </button>
      ))}
    </div>
  )
}
```

**Advanced: Type-safe URL state with `nuqs`:**

```tsx
// Using nuqs for type-safe searchParams
import { useQueryState, parseAsStringLiteral } from 'nuqs'

const metrics = ['listeners', 'playcount', 'albums'] as const

export function MetricToggle() {
  const [metric, setMetric] = useQueryState(
    'metric',
    parseAsStringLiteral(metrics).withDefault('listeners')
  )

  return (
    <div className="flex gap-2">
      {metrics.map((m) => (
        <button key={m} onClick={() => setMetric(m)} aria-pressed={m === metric}>
          {m}
        </button>
      ))}
    </div>
  )
}
```

`nuqs` provides: type safety, default values, automatic URL sync, shallow routing (no server re-fetch), and the familiar `useState` API.

### 5.2 When You Need Client State vs Server State

| State Type | Where to Manage | Example |
|---|---|---|
| Data from API | Server (fetch in Server Components) | Artist info, tracks, albums |
| Filter/sort selection | URL searchParams | `?sort=playcount&period=7day` |
| UI toggle (expand/collapse) | Client `useState` | Expanded bio, open modal |
| Form input value | Client `useState` | Search input text |
| Dropdown open/closed | Client `useState` | Search dropdown visibility |
| Chart hover tooltip | Client (Recharts internal) | Tooltip data on hover |
| Theme preference | Client + cookie | Dark/light mode |

**You almost never need a global state library** (Redux, Zustand) for this type of application. URL state + Server Components + local `useState` covers all SoundScope needs.

### 5.3 Chart Metric Toggling Pattern

The cleanest pattern combines URL state with server-side data fetching:

1. User clicks a metric button
2. URL updates: `?metric=playcount`
3. Server Component re-renders with new `searchParams`
4. New data is fetched server-side
5. Chart re-renders with new data

This means the chart shows different data based on the URL, making it bookmarkable and shareable. If you want instant client-side toggling without a server roundtrip (e.g., switching which data key the chart displays from already-fetched data), pass all data down and toggle client-side:

```tsx
// Client-side toggle when all data is already available
'use client'
import { useState } from 'react'

export function ChartWithToggle({ data }: { data: FullChartData }) {
  const [metric, setMetric] = useState<'listeners' | 'playcount'>('listeners')

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMetric('listeners')}>Listeners</button>
        <button onClick={() => setMetric('playcount')}>Plays</button>
      </div>
      <LazyLineChart data={data} metric={metric} />
    </div>
  )
}
```

---

## 6. Error Handling & Edge Cases

### 6.1 File-Based Error Boundaries

Place `error.tsx` at each route level for granular error handling:

```tsx
// app/artist/[name]/error.tsx
'use client'  // error.tsx MUST be a Client Component

import { useEffect } from 'react'

export default function ArtistError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error tracking service (Sentry, etc.)
    console.error('Artist page error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="mt-2 text-gray-600">
        We could not load this artist's information.
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  )
}
```

### 6.2 Edge Case: Artist Has No Albums

```tsx
// _components/TopAlbums.tsx
export default async function TopAlbums({ name }: { name: string }) {
  const albums = await getArtistTopAlbums(name)

  if (!albums || albums.length === 0) {
    return (
      <section id="albums">
        <h2 className="text-xl font-semibold">Albums</h2>
        <div className="mt-4 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No albums found for this artist.</p>
          <p className="mt-1 text-sm text-gray-400">
            This artist may not have any albums catalogued on Last.fm.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="albums">
      <h2 className="text-xl font-semibold">Albums</h2>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {albums.map((album) => (
          <AlbumCard key={album.name} album={album} />
        ))}
      </div>
    </section>
  )
}
```

### 6.3 Edge Case: Missing Images

Last.fm sometimes returns empty strings for image URLs, or the images are broken. Handle this defensively:

```tsx
// lib/utils.ts
export function getLastfmImage(
  images: Array<{ '#text': string; size: string }> | undefined,
  preferredSize: string = 'extralarge'
): string | null {
  if (!images || images.length === 0) return null

  // Try preferred size first, then fall back through sizes
  const sizes = [preferredSize, 'large', 'medium', 'small']
  for (const size of sizes) {
    const img = images.find((i) => i.size === size)
    if (img && img['#text'] && img['#text'].trim() !== '') {
      return img['#text']
    }
  }

  return null
}
```

```tsx
// components/ui/SafeImage.tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'

interface SafeImageProps {
  src: string | null
  alt: string
  width: number
  height: number
  fallback?: string
  className?: string
  priority?: boolean
}

export function SafeImage({
  src,
  alt,
  width,
  height,
  fallback = '/images/placeholder.png',
  className = '',
  priority = false,
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [hasError, setHasError] = useState(false)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={() => {
        if (!hasError) {
          setImgSrc(fallback)
          setHasError(true)
        }
      }}
    />
  )
}
```

### 6.4 API Rate Limiting Handling

Last.fm allows **5 requests per second per IP, averaged over 5 minutes.** Build rate-limiting protection into your data layer:

```ts
// lib/lastfm.ts
import 'server-only'

// Simple in-memory rate limiter for server-side calls
let requestTimestamps: number[] = []
const MAX_REQUESTS_PER_SECOND = 4  // Stay under the 5/s limit

async function throttle(): Promise<void> {
  const now = Date.now()
  // Remove timestamps older than 1 second
  requestTimestamps = requestTimestamps.filter((t) => now - t < 1000)

  if (requestTimestamps.length >= MAX_REQUESTS_PER_SECOND) {
    const oldestInWindow = requestTimestamps[0]
    const waitTime = 1000 - (now - oldestInWindow)
    if (waitTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  requestTimestamps.push(Date.now())
}

async function lastfmFetch<T>(params: Record<string, string>): Promise<T> {
  await throttle()

  const res = await fetch(url, {
    next: { revalidate: 3600 },
  })

  // Handle rate limit response
  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After')
    const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 5000
    await new Promise((resolve) => setTimeout(resolve, waitMs))
    return lastfmFetch<T>(params)  // Retry once
  }

  // ...rest of error handling
}
```

**Caching is your primary defense against rate limiting.** With proper revalidation times (1h for artist info, 5min for search), most requests will be served from cache and never hit Last.fm.

### 6.5 Graceful Degradation Strategy

```tsx
// Pattern: Try to show data, degrade gracefully at each level

// Level 1: Full data available
<ArtistPage artist={artist} tracks={tracks} albums={albums} charts={charts} />

// Level 2: Some data unavailable (e.g., charts API down)
<ArtistPage artist={artist} tracks={tracks} albums={albums} />
<section>
  <p className="text-gray-500">Chart data is temporarily unavailable.</p>
</section>

// Level 3: Artist found but minimal data
<ArtistHeader name={artist.name} />
<p>Limited information available for this artist.</p>

// Level 4: Complete failure -> error.tsx boundary
<ErrorFallback onRetry={reset} />
```

**Never let one failed section crash the entire page.** Use individual try/catch blocks in each async Server Component, and wrap each in its own Suspense boundary.

---

## 7. Deployment & Environment

### 7.1 Environment Variables

```bash
# .env.local (never committed -- add to .gitignore)
LASTFM_API_KEY=your_api_key_here

# .env.example (committed -- template for other developers)
LASTFM_API_KEY=your_lastfm_api_key_here
```

**Rules:**
- `LASTFM_API_KEY` (no `NEXT_PUBLIC_` prefix) -- server-only, never exposed to the browser
- Never use `NEXT_PUBLIC_LASTFM_API_KEY` -- this would embed the key in client bundles
- Access via `process.env.LASTFM_API_KEY` only in Server Components, API routes, and `lib/` files marked with `import 'server-only'`
- In Vercel dashboard: add `LASTFM_API_KEY` under Settings > Environment Variables for Production, Preview, and Development

**Validation at startup:**

```ts
// lib/env.ts
import 'server-only'

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

export const env = {
  LASTFM_API_KEY: getRequiredEnv('LASTFM_API_KEY'),
}
```

### 7.2 Vercel-Specific Optimizations

**Vercel Analytics and Speed Insights:**

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />        {/* Track page views and Web Vitals */}
        <SpeedInsights />    {/* Core Web Vitals monitoring */}
      </body>
    </html>
  )
}
```

**Image optimization on Vercel:**

Vercel automatically provides image optimization for `next/image`. No additional configuration needed beyond the `remotePatterns` in `next.config.ts`.

**Caching headers for API routes:**

```ts
// API routes can leverage Vercel's CDN
return NextResponse.json(data, {
  headers: {
    // Cache on Vercel's CDN for 5 min, serve stale for 10 min while revalidating
    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
  },
})
```

**Preview deployments:**

Every branch push creates a preview URL. Use different `LASTFM_API_KEY` values for Preview vs Production if you want to track usage separately.

### 7.3 Edge Runtime Considerations

**Default Node.js runtime is recommended for SoundScope.** Edge runtime has restrictions:

| Feature | Node.js Runtime | Edge Runtime |
|---|---|---|
| Cold start | ~250ms | ~50ms |
| Full Node.js APIs | Yes | No (Web APIs only) |
| Environment variables | Full access | Limited (5KB per var) |
| Package compatibility | Full | Limited |
| Use case | API routes, SSR | Middleware, auth checks |

**Use Edge only for middleware** (auth redirects, geo-based routing):

```ts
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Example: redirect old URLs
  if (request.nextUrl.pathname.startsWith('/artists/')) {
    const name = request.nextUrl.pathname.replace('/artists/', '')
    return NextResponse.redirect(new URL(`/artist/${name}`, request.url))
  }
}

export const config = {
  matcher: '/artists/:path*',
}
```

### 7.4 Production Checklist

Before deploying SoundScope to production:

- [ ] **Audit `'use client'` directives** -- each one should justify its existence
- [ ] **Every `fetch` has explicit revalidation** -- never rely on defaults
- [ ] **Suspense boundaries** around every async component with dimensionally-accurate skeleton fallbacks
- [ ] **`error.tsx`** at root and each major route segment
- [ ] **`loading.tsx`** at root and data-heavy route segments
- [ ] **`not-found.tsx`** for meaningful 404 pages
- [ ] **`next/image`** for all remote images with `sizes`, `alt`, and fallback handling
- [ ] **`next/font`** with `display: 'swap'` for zero CLS
- [ ] **Dynamic `generateMetadata`** for artist pages with Open Graph images
- [ ] **Static `metadata`** export for fixed pages (home, about)
- [ ] **`robots.txt`** and **`sitemap.xml`** (via file conventions or generation)
- [ ] **Environment variables** are server-only (no `NEXT_PUBLIC_` for API keys)
- [ ] **Rate limiting** protection in Last.fm client
- [ ] **Empty state handling** for missing albums, tracks, images
- [ ] **Error tracking** (Sentry or similar) integrated
- [ ] **Core Web Vitals** monitored via Vercel Speed Insights
- [ ] **Recharts lazy-loaded** with `next/dynamic` and `ssr: false`
- [ ] **Test with JS disabled** -- forms and navigation should still work

---

## Sources

### Official Next.js Documentation
- [Project Structure and Organization](https://nextjs.org/docs/app/getting-started/project-structure)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [Error Handling](https://nextjs.org/docs/app/getting-started/error-handling)
- [Lazy Loading Guide](https://nextjs.org/docs/app/guides/lazy-loading)
- [Image Optimization](https://nextjs.org/docs/app/getting-started/images)
- [Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Partial Prerendering](https://nextjs.org/docs/app/getting-started/partial-prerendering)
- [Loading UI (loading.js)](https://nextjs.org/docs/app/api-reference/file-conventions/loading)
- [Adding Search and Pagination (Tutorial)](https://nextjs.org/learn/dashboard-app/adding-search-and-pagination)

### Architecture & Patterns
- [Next.js App Router: The Patterns That Actually Matter in 2026](https://dev.to/teguh_coding/nextjs-app-router-the-patterns-that-actually-matter-in-2026-146)
- [Next.js App Router Best Practices for Production (2026)](https://ztabs.co/blog/nextjs-app-router-best-practices)
- [Next.js App Router in 2026: Complete Guide](https://dev.to/ottoaria/nextjs-app-router-in-2026-the-complete-guide-for-full-stack-developers-5bjl)
- [How to Structure a Full-Stack Next.js 15 Project in 2026](https://www.groovyweb.co/blog/nextjs-project-structure-full-stack)
- [The Battle-Tested NextJS Project Structure](https://medium.com/@burpdeepak96/the-battle-tested-nextjs-project-structure-i-use-in-2025-f84c4eb5f426)

### Data Fetching & State Management
- [Server Actions vs Route Handlers: When to Use Each](https://makerkit.dev/blog/tutorials/server-actions-vs-route-handlers)
- [Building APIs with Next.js](https://nextjs.org/blog/building-apis-with-nextjs)
- [Mastering State in Next.js with URL Query Parameters](https://medium.com/@roman_j/mastering-state-in-next-js-app-router-with-url-query-parameters-a-practical-guide-03939921d09c)
- [Stop Fighting Next.js Search Params: Use nuqs](https://dev.to/tphilus/stop-fighting-nextjs-search-params-use-nuqs-for-type-safe-url-state-2a0h)

### Performance & UX
- [Framer Motion: Complete React & Next.js Guide 2026](https://inhaq.com/blog/framer-motion-complete-guide-react-nextjs-developers.html)
- [Skeleton Screens vs Loading Spinners: When to Use Each](https://www.onething.design/post/skeleton-screens-vs-loading-spinners)
- [Next.js 15 Streaming Handbook](https://www.freecodecamp.org/news/the-nextjs-15-streaming-handbook/)
- [Complete Next.js SEO Guide](https://www.adeelhere.com/blog/2025-12-09-complete-nextjs-seo-guide-from-zero-to-hero)
- [Next.js 15 Scroll Behavior Guide](https://dev.to/hijazi313/nextjs-15-scroll-behavior-a-comprehensive-guide-387j)

### Last.fm API
- [Last.fm API Error Codes](https://lastfm-docs.github.io/api-docs/codes/)
- [Last.fm API Terms of Service (Rate Limiting)](https://www.last.fm/api/tos)

### Deployment
- [Deploying Next.js on Vercel Guide](https://eastondev.com/blog/en/posts/dev/20251220-nextjs-vercel-deploy-guide/)
- [Vercel Edge Runtime](https://vercel.com/docs/functions/runtimes/edge)
- [Managing Next.js Environment Variables](https://www.wisp.blog/blog/managing-nextjs-environment-variables-from-development-to-production-vercel)
