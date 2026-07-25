/**
 * Backend response shapes consumed by lib/mappers.ts. Based on docs/Art_du_Kivu_API.yaml
 * (OpenAPI spec), corrected where the spec is stale relative to what the mappers actually
 * observed in production (documented inline in mappers.ts) — e.g. the spec still shows
 * `cf_playback_hls_url` for live/radio/webtv streams, but the real field is `playback_hls_url`
 * post Cloudflare→MediaMTX migration.
 */

export interface ApiGenre {
  id?: number;
  name: string;
  slug?: string;
}

export interface ApiArtistList {
  id: number;
  slug: string;
  name: string;
  city?: string;
  photo_url?: string;
  is_featured?: boolean;
  // Spec declares this a comma-joined `string`, but the mapper treats it as an already-split
  // array (no `.split(',')` in the live code path) — array reflects actual current behavior.
  genre_names?: string[];
}

export interface ApiArtistPhoto {
  id?: number | string;
  image_url?: string;
  caption?: string;
  order?: number;
}

export interface ApiArtistVideo {
  id?: number | string;
  title?: string;
  thumbnail_url?: string;
  video_url?: string;
  duration?: string;
  published_at_human?: string;
}

export interface ApiRelease {
  id?: number | string;
  slug?: string;
  title?: string;
  cover_url?: string;
  release_date?: string;
  format?: string;
  is_featured?: boolean;
  is_premiere?: boolean;
  streaming_links?: Record<string, string>;
  description?: string;
  preview_url?: string | null;
  artist_name?: string;
  like_count?: number;
  comment_count?: number;
}

export interface ApiArtistDetail {
  id: number;
  slug: string;
  name: string;
  bio?: string;
  city?: string;
  country?: string;
  photo_url?: string;
  cover_url?: string;
  genres?: ApiGenre[];
  releases?: ApiRelease[];
  videos?: ApiArtistVideo[];
  gallery?: ApiArtistPhoto[];
  // Spec declares these `type: string` (unlike every other domain's like_count/comment_count,
  // which are `number`) — coerced in the mapper rather than trusted as-is.
  like_count?: string | number;
  comment_count?: string | number;
}

export interface ApiCategory {
  name?: string;
}

export interface ApiAuthor {
  username?: string;
  avatar_url?: string;
}

export interface ApiTag {
  name: string;
}

export interface ApiComment {
  id: number | string;
  author_name?: string;
  author_avatar?: string;
  content: string;
  like_count?: number;
  created_at?: string;
}

export interface ApiArticleList {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  featured_image_url?: string;
  image_url?: string;
  category?: ApiCategory;
  read_time?: number;
  is_featured?: boolean;
  published_at?: string | null;
}

export interface ApiArticleDetail extends ApiArticleList {
  content?: string;
  tags?: ApiTag[];
  author?: ApiAuthor;
  author_name?: string;
  like_count?: number;
  comments?: ApiComment[];
}

export interface ApiEventSchedule {
  date?: string;
  start_time?: string;
  title?: string;
  activity?: string;
}

export interface ApiEvent {
  id: number;
  slug: string;
  title: string;
  image_url?: string;
  date?: string;
  end_date?: string | null;
  venue_name?: string;
  venue_address?: string;
  city?: { name?: string } | null;
  city_name?: string;
  category?: string;
  category_name?: string;
  description?: string;
  is_featured?: boolean;
  ticket_price?: string;
  schedule?: ApiEventSchedule[];
}

export interface ApiEpisodeGuest {
  name?: string;
  title?: string;
  role?: string;
  title_role?: string;
  avatar?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  twitter?: string;
}

export interface ApiEpisode {
  id: number;
  slug: string;
  title: string;
  description?: string;
  cover_url?: string;
  duration?: string;
  episode_number?: number;
  season_number?: number;
  play_count?: number;
  published_at?: string;
  series_title?: string;
  // `EpisodeList` sends this flat; `EpisodeDetail` only nests it under `series.slug` — both
  // read here since a single merged type covers both shapes.
  series_slug?: string;
  series?: { title?: string; slug?: string; cover_url?: string };
  guests?: (string | ApiEpisodeGuest)[];
  audio_url?: string;
  transcript?: string;
  like_count?: number;
  comment_count?: number;
  is_featured?: boolean;
}

// ── GET /podcasts/, /podcasts/{slug}/ — podcast show ("series") ─────────────
export interface ApiPodcastSeries {
  id: number;
  slug: string;
  title: string;
  description?: string;
  cover_url?: string;
  audio_url?: string;
  duration?: string;
  category?: string;
  is_series?: boolean;
  is_featured?: boolean;
  episode_count?: number;
}

export interface ApiVideo {
  id: number;
  slug: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  image_url?: string;
  video_url?: string;
  // See file header — real field, not the stale `cf_playback_hls_url` from the spec.
  playback_hls_url?: string;
  duration?: string;
  category?: string;
  is_premier?: boolean;
  is_live?: boolean;
  like_count?: number;
  comment_count?: number;
  published_at_human?: string;
  artist_names?: string[];
}

export interface ApiRadioOrLiveProgram {
  id: number;
  slug: string;
  title: string;
  description?: string;
  presenter?: string;
  host?: string;
  // Radio vs Live Music return this differently shaped (comma-string vs already-split array) —
  // the shared mapper normalizes either, so both are accepted here.
  artist_names?: string | string[];
  // `MusicLiveSlot` (live-music's programme/schedule item) only ever sends this — singular,
  // plain string. Distinct from `artist_names` above (only present on `MusicLiveSession`/
  // `RadioProgram`-shaped payloads, not the programme schedule).
  artist_name?: string;
  start_time?: string;
  end_time?: string;
  day_name?: string;
  // 0=Monday..6=Sunday (`DayOfWeekEnum`) — present on both `RadioProgram` and `MusicLiveSlot`.
  day_of_week?: number;
  cover_url?: string;
  image_url?: string;
  stream_url?: string;
  // See file header — real field, not the stale `cf_playback_hls_url` from the spec.
  playback_hls_url?: string;
  status?: string;
  listener_count?: number;
  online_followers?: number;
  like_count?: number;
  comment_count?: number;
}

export interface ApiCommunityMediaItem {
  type?: string;
  url?: string;
}

export interface ApiCommunityAuthor {
  username?: string;
  avatar_url?: string;
  city?: string;
  is_verified?: boolean;
}

export interface ApiCommunityPost {
  id: number | string;
  author_name?: string;
  author_avatar?: string;
  author?: ApiCommunityAuthor;
  content?: string;
  title?: string;
  media?: ApiCommunityMediaItem[];
  post_type?: string;
  like_count?: number;
  comment_count?: number;
  created_at?: string;
  duration?: string;
  tags?: (string | { name?: string; label?: string })[];
  is_verified?: boolean;
  // Not yet returned by the backend — proposed in
  // docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.2/§3.5 for challenge participations. Optional so
  // existing talent/art/news posts (which never send these) keep working unchanged.
  challenge?: { id?: number | string; slug?: string; title?: string } | string | null;
  is_pinned_result?: boolean;
}

export interface ApiHeroBanner {
  title?: string;
  title_highlight?: string;
  subtitle?: string;
  image_url?: string;
  cta_label?: string;
  cta_url?: string;
}

export interface ApiHit {
  rank?: number;
  title?: string;
  artist_name?: string;
  artist?: string;
  cover_url?: string;
  image_url?: string;
  slug?: string;
}

export interface ApiALaUne {
  artist_of_month?: {
    slug?: string;
    name?: string;
    title?: string;
    genre_names?: string[];
    city?: string;
    photo_url?: string;
    cover_url?: string;
    image_url?: string;
  };
  featured_podcast?: {
    slug?: string;
    title?: string;
    series_name?: string;
    host_name?: string;
    image_url?: string;
    cover_url?: string;
  };
  featured_event?: {
    slug?: string;
    title?: string;
    date?: string;
    venue_name?: string;
    image_url?: string;
    cover_url?: string;
  };
}

export interface ApiBadge {
  id?: number | string;
  slug?: string;
  name?: string;
  description?: string;
  icon_url?: string;
  threshold_seconds?: number;
  order?: number;
}

export interface ApiMediaRankingItem {
  content_type?: string;
  object_id?: number | string;
  title?: string;
  total_seconds?: number;
  cover_url?: string;
}

export interface ApiSavedItem {
  kind?: string;
  id: number | string;
  slug?: string;
  title?: string;
  cover_url?: string;
}

export interface ApiActivityEntry {
  action?: string;
  created_at?: string;
  excerpt?: string;
  target?: {
    kind?: string;
    id?: number | string;
    slug?: string;
    title?: string;
    cover_url?: string;
  };
}

export interface ApiEmission {
  id: number;
  slug: string;
  title: string;
  cover_url?: string;
  status?: string;
  scheduled_at?: string | null;
  duration_minutes?: number;
  viewer_count?: number;
  total_views?: number;
  description?: string;
  stream_url?: string;
  // See file header — real field, not the stale `cf_playback_hls_url` from the spec.
  playback_hls_url?: string;
  // The recorded replay's actual playable file — despite the name, this is an audio file
  // (Cloudinary "video" resource type used for storage, not an actual video track). `stream_url`
  // is empty once an emission is no longer live; this is the real content for `status: "recorded"`.
  video_url?: string;
  host_names?: string[];
  like_count?: number;
  comment_count?: number;
}

// ── Real API shapes (GET /community/challenges/, /community/polls/) ─────────
export interface ApiChallenge {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  prize: string;
  deadline: string;
  participant_count: number;
  is_active: boolean;
  // Not yet returned by the backend — proposed in
  // docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md §3.3. Optional/undefined means "unknown", not "false" —
  // treated as not-yet-participated until the backend actually sends this field.
  has_participated?: boolean;
}

export interface ApiPollOption {
  id: number;
  text: string;
  vote_count: number;
  percentage: number;
}

export interface ApiPoll {
  id: number;
  question: string;
  vote_count: number;
  options: ApiPollOption[];
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}
