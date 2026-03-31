# SoundScope

**Music Data Explorer** — Uncover the story behind any artist's musical evolution.

**[Live Demo](https://soundscope-ten.vercel.app/)** · **[GitHub Repository](https://github.com/Toto20087/soundscope/)**

Search any artist and get a complete data-driven profile: chronological discography timeline, statistical insights, interactive charts, AI-powered evolution analysis, and auto-generated fun facts.

## Features

- **Artist Search** — Real-time autocomplete powered by Last.fm
- **AI Evolution Analysis** — Claude-powered deep dive into an artist's musical journey: origins, turning points, genre shifts, and legacy (streaming response)
- **Discography Timeline** — Chronological visualization of albums with nodes sized by popularity and colored by release type (Album/Single/EP/Live)
- **Data Insights** — 4 interactive charts:
  - Popularity Distribution (Pie) — How plays are spread across albums
  - Artist Profile (Radar) — Normalized metrics across discography
  - Track Duration Distribution (Scatter) — With IQR-based outlier detection
  - Genre Diversity Over Time (Bar) — How the artist's sound evolved
- **Album Comparison** — Multi-metric bar chart with toggleable metrics (Playcount/Listeners/Tracks)
- **Top Tracks** — Ranked list with relative popularity bars
- **Fun Fact Generator** — 12 auto-generated insights scored by "interestingness"
- **Album Detail** — Tracklist with durations, tags, wiki, and duration chart
- **Artist Photos** — Real artist images via Deezer API

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, Framer Motion |
| Charts | Recharts (Bar, Area, Pie, Radar, Scatter) |
| Components | shadcn/ui |
| AI | Anthropic Claude API (streaming) |
| Music Data | Last.fm API |
| Metadata | MusicBrainz API (release dates, album types) |
| Artist Images | Deezer API |
| Deploy | Vercel |

## Architecture

```
Browser → Next.js App Router
            ├── Server Components (SSR)
            │     └── data-aggregator.ts
            │           ├── Last.fm API (artist info, albums, tracks)
            │           ├── MusicBrainz API (release dates, types)
            │           └── Deezer API (artist images)
            ├── API Routes
            │     ├── /api/lastfm/* (proxied, cached)
            │     └── /api/analyze (Claude streaming)
            └── Client Components
                  ├── Charts (lazy-loaded, ssr: false)
                  ├── Search (debounced, AbortController)
                  └── AI Analysis (streaming text)
```

## Getting Started

### Prerequisites

- Node.js 18+
- [Last.fm API key](https://www.last.fm/api/account/create) (free)
- [Anthropic API key](https://console.anthropic.com/) (for AI feature, optional)

### Setup

```bash
git clone https://github.com/Toto20087/soundscope.git
cd sound-scope
npm install
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```
LASTFM_API_KEY=your_lastfm_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key  # optional
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
npm start
```

## Data Processing & Insights

SoundScope doesn't just display raw API data — it processes and transforms it:

- **Response Normalization** — Last.fm returns inconsistent JSON (`#text`, `@attr`, strings as numbers). A normalization layer converts everything to clean TypeScript types.
- **MusicBrainz Enrichment** — Albums are enriched with release dates and types (Album/Single/EP/Compilation) via sequential MusicBrainz queries.
- **Outlier Detection** — Track durations are analyzed using the IQR (Interquartile Range) method to identify unusually long or short tracks.
- **Fun Fact Scoring** — 12 different fact generators compute insights and score them by "interestingness" (ratio extremity, data quality). Only the top 4 are shown.
- **AI Analysis** — All structured data is fed to Claude as context for generating narrative analysis of the artist's evolution.

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/lastfm/search?q=` | GET | Search artists |
| `/api/lastfm/artist/[name]` | GET | Full aggregated artist profile |
| `/api/lastfm/artist/[name]/albums` | GET | Top albums (paginated) |
| `/api/lastfm/artist/[name]/tracks` | GET | Top tracks (paginated) |
| `/api/lastfm/album?artist=&album=` | GET | Album detail with tracklist |
| `/api/analyze` | POST | AI evolution analysis (streaming) |

## License

MIT
