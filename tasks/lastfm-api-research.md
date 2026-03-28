# Last.fm API Research for SoundScope

## General API Information

### Base URL
```
https://ws.audioscrobbler.com/2.0/
```
Note: The official docs reference `http://` but HTTPS works and should be preferred.

### Response Formats
- **XML** (default) -- wrapped in `<lfm status="ok|failed">` root element
- **JSON** -- add `format=json` query parameter
- **JSONP** -- add `format=json&callback=myFunction` for browser-side use (wraps JSON in callback function)

### JSON Conversion Quirks (IMPORTANT)
The API converts XML responses to JSON automatically, resulting in non-standard JSON structures:
- XML attributes become `@attr` objects (e.g., `"@attr": { "rank": "1" }`)
- Text content becomes `#text` properties (e.g., image URLs are `image[0]["#text"]`)
- All numeric values are returned as **strings**, not numbers (listeners, playcounts, durations, page counts)
- Repeated child nodes become arrays, but single items may not be wrapped in arrays

### Request Format
```
GET https://ws.audioscrobbler.com/2.0/?method=<package.method>&<params>&api_key=<KEY>&format=json
```
- Read operations: GET with query string parameters
- Write operations: POST with parameters in request body

### Technical Requirements
- UTF-8 encoding for all arguments
- RFC 3986-compliant HTTP client
- **Identifiable User-Agent header required on all requests**

---

## Authentication

### API Key (Read-Only Access)
- Obtained by creating an API account at https://www.last.fm/api/account/create
- You receive an **API Key** (public) and a **Shared Secret** (private)
- Read-only endpoints (all five SoundScope needs) require ONLY the API key as a query parameter
- No session tokens, no OAuth, no request signing needed for read operations

### Session-Based Auth (Write Operations)
- Required only for write operations (scrobbling, loving tracks, etc.)
- Three flows: Web, Desktop, Mobile
- Involves token generation, user authorization, session key exchange
- **Not needed for SoundScope** since we only read data

### For SoundScope
Only `api_key` parameter is needed. Store it as an environment variable (`LASTFM_API_KEY`) and use it server-side in Next.js API routes.

---

## Rate Limiting

### Official Policy (TOS Section 4.4)
- **5 requests per second per originating IP address**, averaged over a 5-minute period
- No fixed daily limit documented, but "be reasonable"
- Accounts can be **suspended** for excessive usage without warning
- Exceeding limits returns **error code 29**: "Rate Limit Exceeded"
- Higher limits require written approval via partners@last.fm

### Practical Guidance
- Implement caching per HTTP cache headers (TOS Section 4.3.4)
- Maximum cache storage: 100 MB per the TOS "Reasonable Usage Cap"
- For SoundScope: cache responses in Next.js (use `revalidate` in fetch or a Redis/memory cache)
- Suggested approach: 1-2 requests/second max with aggressive caching

---

## CORS Policy

### The Problem
**The Last.fm API does NOT send CORS headers.** Direct browser-side `fetch()` calls to `ws.audioscrobbler.com` will be blocked by browsers.

### The Solution for SoundScope
Use **Next.js API routes as a server-side proxy**. This is the correct architecture:
```
Browser -> Next.js API Route (/api/artist/search) -> Last.fm API -> Response back through Next.js
```
This also keeps the API key server-side (not exposed to the client).

### Alternative: JSONP
The API supports JSONP via `callback` parameter, but this is a legacy approach. Server-side proxy is strongly preferred.

---

## Image URLs

### Available Sizes
Images are returned as arrays with size variants:

| Size | Dimensions | Notes |
|------|-----------|-------|
| `small` | 34x34 | Tiny thumbnail |
| `medium` | 64x64 | Small thumbnail |
| `large` | 174x174 | Medium display |
| `extralarge` | 300x300 | Primary display size |
| `mega` | 300x300 | Same as extralarge in practice |
| `""` (empty string) | Largest available | Only in some endpoints |

### Image URL Structure
```
https://lastfm.freetls.fastly.net/i/u/34s/<hash>.png    (small)
https://lastfm.freetls.fastly.net/i/u/64s/<hash>.png    (medium)
https://lastfm.freetls.fastly.net/i/u/174s/<hash>.png   (large)
https://lastfm.freetls.fastly.net/i/u/300x300/<hash>.png (extralarge/mega)
```

### CRITICAL: Artist Images Are Broken
**Since May 2019, artist images return placeholder star graphics, not actual artist photos.**
- This is intentional -- Last.fm changed their TOS to prohibit external use of artist images
- **Album artwork still works** and returns real cover art
- For artist images, SoundScope will need an alternative source (e.g., Spotify API, MusicBrainz, or Discogs)

### Image Reliability
- Album images: Generally reliable, but `#text` values can be empty strings for obscure albums
- Artist images in search results: Also affected by the placeholder issue
- Always check if `image[x]["#text"]` is non-empty before using

---

## Data Quality Notes

### Playcounts & Listeners
- Based on actual Last.fm scrobble data -- represents Last.fm users only, not total streams
- Generally correlates with popularity but biased toward Last.fm's user demographics
- Values are cumulative and never decrease

### Biographies
- Not all artists have bios -- some return empty strings
- Bio `summary` is truncated (~300 characters) with a "Read more on Last.fm" link
- Bio `content` has the full text but includes HTML markup
- `lang` parameter allows requesting bios in different languages (ISO 639 alpha-2)
- Bio quality varies wildly -- major artists have detailed bios, smaller artists may have nothing

### MusicBrainz IDs (mbid)
- Not all entities have MBIDs -- field can be empty string
- Useful for cross-referencing with MusicBrainz/other databases
- Can be used as alternative identifier to name in most endpoints

### General Quirks
- API occasionally returns data for wrong users (rare, retry fixes it)
- HTTP 200 returned even for errors -- always check for `error` field in JSON response
- Some responses wrap single items differently than arrays (inconsistent)

---

## Endpoint Details

---

### 1. artist.search

**Purpose:** Search for artists by name, results sorted by relevance.

**URL:**
```
GET https://ws.audioscrobbler.com/2.0/?method=artist.search&artist={query}&api_key={KEY}&format=json
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `artist` | Yes | -- | Artist name to search for |
| `api_key` | Yes | -- | Your API key |
| `limit` | No | 30 | Results per page (max appears to be 1000) |
| `page` | No | 1 | Page number |
| `format` | No | xml | Set to `json` for JSON |

**Authentication:** None required.

**Complete JSON Response Structure:**
```json
{
  "results": {
    "opensearch:Query": {
      "#text": "",
      "role": "request",
      "searchTerms": "rammstein",
      "startPage": "1"
    },
    "opensearch:totalResults": "13809",
    "opensearch:startIndex": "0",
    "opensearch:itemsPerPage": "30",
    "artistmatches": {
      "artist": [
        {
          "name": "Rammstein",
          "listeners": "1913191",
          "mbid": "b2d122f9-eadb-4930-a196-8f221eeb0c66",
          "url": "https://www.last.fm/music/Rammstein",
          "streamable": "0",
          "image": [
            { "#text": "https://lastfm.freetls.fastly.net/i/u/34s/...", "size": "small" },
            { "#text": "https://lastfm.freetls.fastly.net/i/u/64s/...", "size": "medium" },
            { "#text": "https://lastfm.freetls.fastly.net/i/u/174s/...", "size": "large" },
            { "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/...", "size": "extralarge" },
            { "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/...", "size": "mega" }
          ]
        }
      ]
    },
    "@attr": {
      "for": "rammstein"
    }
  }
}
```

**Pagination:** Via `opensearch:totalResults`, `opensearch:startIndex`, `opensearch:itemsPerPage` fields plus `page`/`limit` parameters.

**Gotchas:**
- Artist images are placeholder stars (not real photos) since May 2019
- `listeners` is a string, not a number
- `mbid` may be empty string for some artists
- Empty search returns empty `artist` array, not an error
- `streamable` is always `"0"` now (streaming was discontinued)

---

### 2. artist.getInfo

**Purpose:** Get detailed metadata for an artist including bio, tags, stats, and similar artists.

**URL:**
```
GET https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist={name}&api_key={KEY}&format=json
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `artist` | Yes* | -- | Artist name (*not required if `mbid` provided) |
| `mbid` | No | -- | MusicBrainz ID (alternative to `artist`) |
| `api_key` | Yes | -- | Your API key |
| `autocorrect` | No | 0 | `1` to correct misspelled names |
| `username` | No | -- | Include user's playcount if provided |
| `lang` | No | en | ISO 639 alpha-2 language code for bio |
| `format` | No | xml | Set to `json` for JSON |

**Authentication:** None required.

**Complete JSON Response Structure:**
```json
{
  "artist": {
    "name": "Cher",
    "mbid": "bfcc6d75-a6a5-4bc6-8571-76f4b73f5b73",
    "url": "https://www.last.fm/music/Cher",
    "image": [
      { "#text": "url-or-empty", "size": "small" },
      { "#text": "url-or-empty", "size": "medium" },
      { "#text": "url-or-empty", "size": "large" },
      { "#text": "url-or-empty", "size": "extralarge" },
      { "#text": "url-or-empty", "size": "mega" },
      { "#text": "url-or-empty", "size": "" }
    ],
    "streamable": "0",
    "ontour": "0",
    "stats": {
      "listeners": "1234567",
      "playcount": "23456789",
      "userplaycount": "150"
    },
    "similar": {
      "artist": [
        {
          "name": "Similar Artist Name",
          "url": "https://www.last.fm/music/Similar+Artist",
          "image": [
            { "#text": "url", "size": "small" },
            { "#text": "url", "size": "medium" },
            { "#text": "url", "size": "large" },
            { "#text": "url", "size": "extralarge" },
            { "#text": "url", "size": "mega" },
            { "#text": "url", "size": "" }
          ]
        }
      ]
    },
    "tags": {
      "tag": [
        {
          "name": "pop",
          "url": "https://www.last.fm/tag/pop"
        }
      ]
    },
    "bio": {
      "links": {
        "link": {
          "#text": "",
          "rel": "original",
          "href": "https://last.fm/music/Cher/+wiki"
        }
      },
      "published": "01 Jan 2006, 00:00",
      "summary": "Short bio text with HTML... <a href=\"https://www.last.fm/music/Cher\">Read more on Last.fm</a>",
      "content": "Full biography text with HTML markup..."
    }
  }
}
```

**Key Fields for SoundScope:**
- `stats.listeners` / `stats.playcount` -- artist popularity metrics
- `stats.userplaycount` -- only present when `username` param is provided
- `similar.artist` -- array of up to 5 similar artists
- `tags.tag` -- array of genre/style tags (typically 5)
- `bio.summary` -- truncated bio (~300 chars) with HTML link
- `bio.content` -- full bio with HTML markup
- `ontour` -- whether artist is currently touring

**Gotchas:**
- All images are **placeholder stars** (not real artist photos) since May 2019
- `bio.summary` and `bio.content` contain HTML, need sanitization
- `bio` may be empty/minimal for lesser-known artists
- `similar.artist` images are also placeholders
- `userplaycount` only appears when `username` is passed
- Numbers are all strings
- Error for non-existent artist: HTTP 200 with `{"error": 6, "message": "The artist you supplied could not be found"}`

---

### 3. artist.getTopAlbums

**Purpose:** Get an artist's top albums ranked by popularity (playcount).

**URL:**
```
GET https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist={name}&api_key={KEY}&format=json
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `artist` | Yes* | -- | Artist name (*not required if `mbid` provided) |
| `mbid` | No | -- | MusicBrainz ID (alternative to `artist`) |
| `api_key` | Yes | -- | Your API key |
| `autocorrect` | No | 0 | `1` to correct misspelled names |
| `page` | No | 1 | Page number |
| `limit` | No | 50 | Results per page |
| `format` | No | xml | Set to `json` for JSON |

**Authentication:** None required.

**Complete JSON Response Structure:**
```json
{
  "topalbums": {
    "album": [
      {
        "name": "Album Title",
        "playcount": 12345678,
        "mbid": "optional-mbid-string",
        "url": "https://www.last.fm/music/Artist/Album+Title",
        "artist": {
          "name": "Artist Name",
          "mbid": "artist-mbid",
          "url": "https://www.last.fm/music/Artist+Name"
        },
        "image": [
          { "#text": "https://lastfm.freetls.fastly.net/i/u/34s/...", "size": "small" },
          { "#text": "https://lastfm.freetls.fastly.net/i/u/64s/...", "size": "medium" },
          { "#text": "https://lastfm.freetls.fastly.net/i/u/174s/...", "size": "large" },
          { "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/...", "size": "extralarge" }
        ]
      }
    ],
    "@attr": {
      "artist": "Artist Name",
      "page": "1",
      "perPage": "50",
      "totalPages": "549",
      "total": "27408"
    }
  }
}
```

**Pagination:** Full pagination via `@attr` object. Fields: `page`, `perPage`, `totalPages`, `total` (all strings).

**CRITICAL for SoundScope -- Missing Data:**
- **NO release date** in this response -- albums are ranked by playcount, not chronologically
- **NO listener count** per album (only `playcount`)
- To get release dates, you must call `album.getInfo` for EACH album individually
- `playcount` can be a number (not string) in some responses -- inconsistent typing

**Gotchas:**
- Some entries have `"(null)"` as album name with empty image URLs -- these are null/garbage entries
- `mbid` is often empty string for many albums
- Album images (cover art) DO work -- unlike artist images
- Image array has 4 sizes (not 6 like artist.getInfo)
- Extremely popular artists can have hundreds of pages of albums (includes compilations, singles, etc.)
- No way to filter by album type (studio album vs. compilation vs. single)
- Error for non-existent artist returns HTTP 200 with `{"error": 6, "message": "The artist you supplied could not be found"}`

---

### 4. artist.getTopTracks

**Purpose:** Get an artist's top tracks ranked by popularity.

**URL:**
```
GET https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist={name}&api_key={KEY}&format=json
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `artist` | Yes* | -- | Artist name (*not required if `mbid` provided) |
| `mbid` | No | -- | MusicBrainz ID (alternative to `artist`) |
| `api_key` | Yes | -- | Your API key |
| `autocorrect` | No | 0 | `1` to correct misspelled names |
| `page` | No | 1 | Page number |
| `limit` | No | 50 | Results per page |
| `format` | No | xml | Set to `json` for JSON |

**Authentication:** None required.

**Complete JSON Response Structure:**
```json
{
  "toptracks": {
    "track": [
      {
        "name": "Track Name",
        "playcount": "2053916",
        "listeners": "524789",
        "mbid": "optional-mbid",
        "url": "https://www.last.fm/music/Artist/_/Track+Name",
        "streamable": {
          "#text": "0",
          "fulltrack": "0"
        },
        "artist": {
          "name": "Artist Name",
          "mbid": "artist-mbid",
          "url": "https://www.last.fm/music/Artist+Name"
        },
        "image": [
          { "#text": "url", "size": "small" },
          { "#text": "url", "size": "medium" },
          { "#text": "url", "size": "large" },
          { "#text": "url", "size": "extralarge" }
        ],
        "@attr": {
          "rank": "1"
        }
      }
    ],
    "@attr": {
      "artist": "Artist Name",
      "page": "1",
      "perPage": "50",
      "totalPages": "100",
      "total": "5000"
    }
  }
}
```

**Pagination:** Same pattern as getTopAlbums via `@attr`.

**Key Fields:**
- `playcount` and `listeners` -- both available (unlike getTopAlbums which only has playcount)
- `@attr.rank` -- explicit ranking position
- `streamable` -- always 0 now

**Missing Data:**
- **NO duration** in this endpoint's response -- you need `track.getInfo` for that
- **NO album association** -- doesn't tell you which album a track is on
- Track images are usually the same placeholder/generic images

**Gotchas:**
- Errors return HTTP 200 with error JSON (same pattern as other endpoints)
- `rank` is inside `@attr` nested object (not a top-level field)
- All numeric values are strings

---

### 5. album.getInfo

**Purpose:** Get album details including tracklist, tags, wiki, and images.

**URL:**
```
GET https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist={name}&album={album}&api_key={KEY}&format=json
```

**Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `artist` | Yes* | -- | Artist name (*not required if `mbid` provided) |
| `album` | Yes* | -- | Album name (*not required if `mbid` provided) |
| `mbid` | No | -- | MusicBrainz album ID (alternative to artist+album) |
| `api_key` | Yes | -- | Your API key |
| `autocorrect` | No | 0 | `1` to correct misspelled names |
| `username` | No | -- | Include user's playcount for album |
| `lang` | No | en | ISO 639 alpha-2 language code for wiki |
| `format` | No | xml | Set to `json` for JSON |

**Authentication:** None required.

**Complete JSON Response Structure:**
```json
{
  "album": {
    "name": "Metallica",
    "artist": "Metallica",
    "mbid": "album-mbid-string",
    "url": "https://www.last.fm/music/Metallica/Metallica",
    "image": [
      { "#text": "https://lastfm.freetls.fastly.net/i/u/34s/...", "size": "small" },
      { "#text": "https://lastfm.freetls.fastly.net/i/u/64s/...", "size": "medium" },
      { "#text": "https://lastfm.freetls.fastly.net/i/u/174s/...", "size": "large" },
      { "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/...", "size": "extralarge" },
      { "#text": "https://lastfm.freetls.fastly.net/i/u/300x300/...", "size": "mega" }
    ],
    "listeners": "1234567",
    "playcount": "23456789",
    "userplaycount": 150,
    "tracks": {
      "track": [
        {
          "name": "Enter Sandman",
          "url": "https://www.last.fm/music/Metallica/_/Enter+Sandman",
          "duration": "382",
          "@attr": {
            "rank": 1
          },
          "streamable": {
            "#text": "0",
            "fulltrack": "0"
          },
          "artist": {
            "name": "Metallica",
            "mbid": "artist-mbid",
            "url": "https://www.last.fm/music/Metallica"
          }
        }
      ]
    },
    "tags": {
      "tag": [
        {
          "name": "thrash metal",
          "url": "https://www.last.fm/tag/thrash+metal"
        }
      ]
    },
    "wiki": {
      "published": "01 January 2006, 00:00",
      "summary": "Short album description with HTML...",
      "content": "Full album description with HTML..."
    }
  }
}
```

**Key Fields for SoundScope:**
- `tracks.track` -- full tracklist with track names, durations, and rank order
- `tracks.track[].duration` -- duration in **seconds** as a string (e.g., `"382"`)
- `tags.tag` -- genre tags for the album
- `wiki.summary` / `wiki.content` -- album description (HTML)
- `listeners` / `playcount` -- album-level stats
- `image` -- **Album artwork DOES work** (5 sizes available including mega)

**Missing/Unreliable Data:**
- **Release date**: The field `releasedate` is mentioned in some docs but is **often missing or empty** in actual JSON responses. It was more reliably present in older API versions. Do NOT rely on it.
- `wiki` may be entirely absent for lesser-known albums
- `duration` can be `"0"` for some tracks where Last.fm doesn't have duration data
- `userplaycount` only present when `username` parameter is provided

**Gotchas:**
- Track `@attr.rank` can be a number (not string) -- inconsistent with other endpoints
- Single-track albums may return `track` as an object instead of an array -- handle both cases
- Album not found returns HTTP 200 with `{"error": 6, "message": "Album not found"}`
- `wiki.summary` and `wiki.content` contain HTML that needs sanitization

---

## Architecture Recommendations for SoundScope

### API Route Structure (Next.js App Router)
```
/api/artist/search?q={query}&page={page}&limit={limit}
/api/artist/[name]                    -> artist.getInfo
/api/artist/[name]/albums?page={p}    -> artist.getTopAlbums
/api/artist/[name]/tracks?page={p}    -> artist.getTopTracks
/api/album?artist={name}&album={name} -> album.getInfo
```

### Key Implementation Concerns

1. **Album Timeline (Chronological):** Last.fm does NOT provide release dates in `getTopAlbums`. To build an album timeline, you will need to either:
   - Call `album.getInfo` for each album to try to get `releasedate` (unreliable)
   - Use MusicBrainz API as a supplementary data source for release dates
   - Use the `mbid` from Last.fm albums to query MusicBrainz for release dates

2. **Artist Images:** Since artist images are broken (placeholder stars since 2019), consider:
   - Using album artwork as a fallback visual
   - Integrating Spotify API or MusicBrainz for artist photos
   - Showing a styled placeholder/avatar instead

3. **Response Normalization:** The raw Last.fm JSON is awkward (`#text`, `@attr`, strings-as-numbers). Create a normalization layer in your API routes that:
   - Converts string numbers to actual numbers
   - Flattens `#text` and `@attr` structures
   - Ensures arrays are always arrays (not objects for single items)
   - Strips/sanitizes HTML from bio and wiki content

4. **Caching Strategy:**
   - Artist info: Cache for 24 hours (rarely changes)
   - Top albums/tracks: Cache for 12-24 hours
   - Search results: Cache for 1 hour
   - Album info: Cache for 24-48 hours (very static data)

5. **Error Handling:** Always check for `error` field in response body since Last.fm returns HTTP 200 for errors.

6. **Attribution:** TOS requires "powered by AudioScrobbler" branding and links back to Last.fm pages for artists/albums/tracks.

### TypeScript Type Definitions (Suggested)

```typescript
// Raw Last.fm image object
interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | "";
}

// Raw Last.fm tag
interface LastFmTag {
  name: string;
  url: string;
}

// Raw Last.fm artist search result
interface LastFmArtistSearchResult {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: LastFmImage[];
}

// Raw Last.fm artist info
interface LastFmArtistInfo {
  name: string;
  mbid: string;
  url: string;
  image: LastFmImage[];
  streamable: string;
  ontour: string;
  stats: {
    listeners: string;
    playcount: string;
    userplaycount?: string;
  };
  similar: {
    artist: Array<{
      name: string;
      url: string;
      image: LastFmImage[];
    }>;
  };
  tags: {
    tag: LastFmTag[];
  };
  bio: {
    links: {
      link: {
        "#text": string;
        rel: string;
        href: string;
      };
    };
    published: string;
    summary: string;
    content: string;
  };
}

// Raw Last.fm top album
interface LastFmTopAlbum {
  name: string;
  playcount: number | string; // inconsistent typing
  mbid: string;
  url: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: LastFmImage[];
}

// Raw Last.fm top track
interface LastFmTopTrack {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: {
    "#text": string;
    fulltrack: string;
  };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: LastFmImage[];
  "@attr": {
    rank: string;
  };
}

// Raw Last.fm album info track
interface LastFmAlbumTrack {
  name: string;
  url: string;
  duration: string; // seconds
  "@attr": {
    rank: number;
  };
  streamable: {
    "#text": string;
    fulltrack: string;
  };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
}

// Raw Last.fm album info
interface LastFmAlbumInfo {
  name: string;
  artist: string;
  mbid: string;
  url: string;
  image: LastFmImage[];
  listeners: string;
  playcount: string;
  userplaycount?: number;
  tracks: {
    track: LastFmAlbumTrack[] | LastFmAlbumTrack; // can be single object!
  };
  tags: {
    tag: LastFmTag[];
  };
  wiki?: {
    published: string;
    summary: string;
    content: string;
  };
}

// Pagination attributes (present in list endpoints)
interface LastFmPaginationAttr {
  artist: string;
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}
```

---

## Error Codes Reference

| Code | Meaning |
|------|---------|
| 2 | Invalid service |
| 3 | Invalid method |
| 4 | Authentication failed |
| 5 | Invalid format |
| 6 | Invalid parameters (artist/album not found) |
| 7 | Invalid resource |
| 8 | Operation failed |
| 9 | Invalid session key |
| 10 | Invalid API key |
| 11 | Service offline |
| 13 | Invalid method signature |
| 16 | Temporary error |
| 26 | Suspended API key |
| 29 | Rate limit exceeded |

---

## Summary of What Works vs. What's Missing

| Feature | Available? | Notes |
|---------|-----------|-------|
| Artist name, URL, stats | YES | Reliable |
| Artist bio/summary | YES | HTML, may be empty for small artists |
| Artist tags | YES | Usually 5 tags |
| Similar artists | YES | Usually 5 artists |
| Artist images | NO | Placeholder stars since May 2019 |
| Album list by popularity | YES | Via getTopAlbums |
| Album release dates | UNRELIABLE | Often missing, need MusicBrainz |
| Album artwork | YES | Works well, multiple sizes |
| Album tracklist | YES | Via album.getInfo |
| Track durations | PARTIAL | In album.getInfo, sometimes "0" |
| Track rankings | YES | Via getTopTracks |
| Track playcounts | YES | String format |
| Pagination | YES | All list endpoints support it |
| Search | YES | With listener counts |
