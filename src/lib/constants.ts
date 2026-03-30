// API Base URLs
export const LASTFM_BASE_URL = "https://ws.audioscrobbler.com/2.0";
export const MUSICBRAINZ_BASE_URL = "https://musicbrainz.org/ws/2";

// User-Agent (required by MusicBrainz, recommended by Last.fm)
export const USER_AGENT = "SoundScope/1.0.0 (https://soundscope.vercel.app)";

// Rate Limits
export const LASTFM_MAX_REQUESTS_PER_SECOND = 4; // Stay under 5/s limit
export const MUSICBRAINZ_REQUEST_DELAY_MS = 1100; // 1 req/sec + buffer

// Cache Durations (in seconds)
export const CACHE_DURATIONS = {
  search: 300, // 5 minutes
  artistInfo: 86400, // 24 hours
  topAlbums: 86400, // 24 hours
  topTracks: 3600, // 1 hour
  albumInfo: 172800, // 48 hours
  aggregatedProfile: 86400, // 24 hours
} as const;

// Default Limits
export const DEFAULT_LIMITS = {
  searchResults: 10,
  topAlbums: 20,
  topTracks: 10,
  topTracksMax: 50,
} as const;

// Last.fm Error Codes
export const LASTFM_ERRORS = {
  INVALID_SERVICE: 2,
  INVALID_METHOD: 3,
  AUTH_FAILED: 4,
  INVALID_FORMAT: 5,
  INVALID_PARAMS: 6, // artist/album not found
  INVALID_RESOURCE: 7,
  OPERATION_FAILED: 8,
  INVALID_SESSION: 9,
  INVALID_API_KEY: 10,
  SERVICE_OFFLINE: 11,
  INVALID_SIGNATURE: 13,
  TEMPORARY_ERROR: 16,
  SUSPENDED_KEY: 26,
  RATE_LIMIT: 29,
} as const;

// Genre → Color mapping for chips
export const GENRE_COLORS: Record<
  string,
  { border: string; text: string }
> = {
  pop: { border: "border-purple-500/30", text: "text-purple-300" },
  rock: { border: "border-rose-500/30", text: "text-rose-300" },
  "r&b": { border: "border-cyan-500/30", text: "text-cyan-300" },
  "hip-hop": { border: "border-amber-500/30", text: "text-amber-300" },
  rap: { border: "border-amber-500/30", text: "text-amber-300" },
  electronic: { border: "border-emerald-500/30", text: "text-emerald-300" },
  jazz: { border: "border-sky-500/30", text: "text-sky-300" },
  metal: { border: "border-red-500/30", text: "text-red-300" },
  indie: { border: "border-indigo-500/30", text: "text-indigo-300" },
  alternative: { border: "border-violet-500/30", text: "text-violet-300" },
  classical: { border: "border-yellow-500/30", text: "text-yellow-300" },
  country: { border: "border-orange-500/30", text: "text-orange-300" },
  folk: { border: "border-lime-500/30", text: "text-lime-300" },
  soul: { border: "border-pink-500/30", text: "text-pink-300" },
  blues: { border: "border-blue-500/30", text: "text-blue-300" },
  reggae: { border: "border-green-500/30", text: "text-green-300" },
  punk: { border: "border-fuchsia-500/30", text: "text-fuchsia-300" },
};

// Album Type → Color mapping for timeline nodes
export const ALBUM_TYPE_COLORS: Record<string, string> = {
  Album: "#8B5CF6", // purple
  Single: "#22D3EE", // cyan
  EP: "#34D399", // emerald
  Live: "#FBBF24", // amber
  Compilation: "#38BDF8", // sky
  Other: "#818CF8", // indigo
};

// Countries for fun facts listener comparisons
export const COUNTRY_POPULATIONS: Array<{ name: string; population: number }> = [
  { name: "Iceland", population: 370000 },
  { name: "Malta", population: 520000 },
  { name: "Luxembourg", population: 640000 },
  { name: "Montenegro", population: 620000 },
  { name: "Cyprus", population: 1200000 },
  { name: "Estonia", population: 1330000 },
  { name: "Latvia", population: 1880000 },
  { name: "Slovenia", population: 2100000 },
  { name: "North Macedonia", population: 2080000 },
  { name: "Lithuania", population: 2800000 },
  { name: "Uruguay", population: 3470000 },
  { name: "Croatia", population: 3870000 },
  { name: "Ireland", population: 5030000 },
  { name: "New Zealand", population: 5120000 },
  { name: "Norway", population: 5430000 },
  { name: "Denmark", population: 5870000 },
  { name: "Finland", population: 5540000 },
  { name: "Singapore", population: 5690000 },
  { name: "Switzerland", population: 8770000 },
  { name: "Austria", population: 9100000 },
  { name: "Sweden", population: 10400000 },
  { name: "Portugal", population: 10300000 },
  { name: "Belgium", population: 11590000 },
  { name: "Netherlands", population: 17530000 },
  { name: "Australia", population: 26000000 },
  { name: "Canada", population: 38250000 },
  { name: "Argentina", population: 45810000 },
  { name: "Spain", population: 47420000 },
];
