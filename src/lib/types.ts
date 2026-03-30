// ============================================================
// Raw Last.fm API response types (before normalization)
// ============================================================

export interface LastFmImage {
  "#text": string;
  size: "small" | "medium" | "large" | "extralarge" | "mega" | "";
}

export interface LastFmTag {
  name: string;
  url: string;
}

export interface LastFmPaginationAttr {
  artist?: string;
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}

// artist.search response
export interface LastFmArtistSearchResult {
  name: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: string;
  image: LastFmImage[];
}

export interface LastFmSearchResponse {
  results: {
    "opensearch:Query": { searchTerms: string; startPage: string };
    "opensearch:totalResults": string;
    "opensearch:startIndex": string;
    "opensearch:itemsPerPage": string;
    artistmatches: {
      artist: LastFmArtistSearchResult[] | LastFmArtistSearchResult;
    };
  };
}

// artist.getInfo response
export interface LastFmArtistInfoResponse {
  artist: {
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
      tag: LastFmTag[] | LastFmTag;
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
  };
}

// artist.getTopAlbums response
export interface LastFmTopAlbumItem {
  name: string;
  playcount: number | string;
  mbid: string;
  url: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: LastFmImage[];
}

export interface LastFmTopAlbumsResponse {
  topalbums: {
    album: LastFmTopAlbumItem[] | LastFmTopAlbumItem;
    "@attr": LastFmPaginationAttr;
  };
}

// artist.getTopTracks response
export interface LastFmTopTrackItem {
  name: string;
  playcount: string;
  listeners: string;
  mbid: string;
  url: string;
  streamable: { "#text": string; fulltrack: string };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  image: LastFmImage[];
  "@attr": { rank: string };
}

export interface LastFmTopTracksResponse {
  toptracks: {
    track: LastFmTopTrackItem[] | LastFmTopTrackItem;
    "@attr": LastFmPaginationAttr;
  };
}

// album.getInfo response
export interface LastFmAlbumTrack {
  name: string;
  url: string;
  duration: string;
  "@attr": { rank: number | string };
  streamable: { "#text": string; fulltrack: string };
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
}

export interface LastFmAlbumInfoResponse {
  album: {
    name: string;
    artist: string;
    mbid: string;
    url: string;
    image: LastFmImage[];
    listeners: string;
    playcount: string;
    userplaycount?: number;
    tracks: {
      track: LastFmAlbumTrack[] | LastFmAlbumTrack;
    };
    tags: {
      tag: LastFmTag[] | LastFmTag;
    };
    wiki?: {
      published: string;
      summary: string;
      content: string;
    };
  };
}

// Last.fm error response
export interface LastFmErrorResponse {
  error: number;
  message: string;
}

// ============================================================
// Normalized app types (after normalization)
// ============================================================

export interface Artist {
  name: string;
  mbid: string | null;
  url: string;
  image: string | null;
  listeners: number;
  playcount: number;
  onTour: boolean;
  tags: string[];
  bio: {
    summary: string;
    full: string;
  } | null;
  similarArtists: SimilarArtist[];
}

export interface SimilarArtist {
  name: string;
  url: string;
  image: string | null;
}

export interface Album {
  name: string;
  mbid: string | null;
  url: string;
  image: string | null;
  playcount: number;
  listeners?: number;
  artistName: string;
  // From MusicBrainz enrichment
  releaseDate: string | null; // YYYY-MM-DD or YYYY
  releaseYear: number | null;
  albumType: string | null; // Album, Single, EP, Compilation, Live
  // From album.getInfo
  trackCount?: number;
  totalDuration?: number; // seconds
  tags?: string[];
  wiki?: {
    summary: string;
    full: string;
  } | null;
  tracks?: Track[];
}

export interface Track {
  name: string;
  url: string;
  playcount: number;
  listeners: number;
  rank: number;
  duration: number | null; // seconds, null if unknown
  albumName?: string;
  albumImage?: string | null;
  artistName: string;
}

export interface FunFact {
  id: string;
  icon: string; // Lucide icon name
  category: "career" | "popularity" | "discography" | "comparison";
  title: string;
  text: string;
  score: number; // interestingness score for sorting
}

export interface ArtistFullProfile {
  artist: Artist;
  albums: Album[];
  topTracks: Track[];
  funFacts: FunFact[];
}

// ============================================================
// API route response types
// ============================================================

export interface SearchApiResponse {
  artists: Array<{
    name: string;
    listeners: number;
    image: string | null;
    url: string;
  }>;
  total: number;
}

export interface ApiErrorResponse {
  error: string;
  code?: number;
}
