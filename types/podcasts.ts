// Real EpisodeListSerializer/EpisodeDetailSerializer send freeform category strings (series
// title, e.g. "Voix du Kivu") that never matched this original closed set at all — widened to
// `string` rather than pretending it's an enum (same fix as EventCategory).
export type PodcastCategory = string;

// ── /podcasts — liste d'épisodes ──────────────────────────────────────────────
// Single shape shared by the featured card, the compact "Récents" preview (mobile carousel +
// desktop sidebar) and the expanded/filtered list — these all render the same fields, so unlike
// the four near-duplicate interfaces this replaces, there's no separate FeaturedEpisode/
// SelectionEpisode/RecentEpisode/LatestPickEpisode with their own unsafe `as unknown as` bridging.
export interface PodcastListItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  category: PodcastCategory;
  duration: string;       // "52 min"
  guestNames: string;     // joined guest names, "" if none listed
  episodeNumber?: number;
  seasonNumber?: number;
  publishedAt: string;    // "Il y a 2 jours"
  isFeatured?: boolean;
  /** Slug of the podcast show this episode belongs to — absent on older responses that only
   * ever sent `series_title`, not a slug. */
  seriesSlug?: string;
}

// ── /podcasts/shows/[slug] — podcast show (série) ────────────────────────────
export interface PodcastShow {
  id: string;
  numericId?: number | null;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  category: PodcastCategory;
  episodeCount: number;
}

// ── /podcasts/[slug] — épisode détail ────────────────────────────────────────

export interface EpisodeGuest {
  name: string;
  title: string;          // "Prix Nobel de la Paix"
  avatar: string;
  bio: string;
  website?: string;
  twitter?: string;
}

export interface RelatedEpisode {
  id: string;
  slug: string;
  episodeNumber: number;  // 41
  title: string;
  image: string;
  duration: string;       // "24:00"
}

export interface PodcastEpisode {
  id: string;
  /** Real numeric DB id — `id` above is slug-based for routing; gamification's `consumption/`
   * endpoint needs the actual `object_id`. */
  numericId?: number | null;
  slug: string;
  episodeNumber: number;  // 42
  publishedAt: string;    // "14 NOV"
  title: string;
  subtitle: string;       // sous-titre italique
  coverImage: string;
  tags: string[];         // ["Société", "Santé"]
  badge?: string;         // "Exclusif"
  description: string;   // texte long "Infos"
  duration: string;       // "45:00"
  currentTime: string;    // "14:20" — position initiale du player
  progressPercent: number; // 35
  audioUrl: string;
  transcript?: string;
  likeCount?: number;
  commentCount?: number;
  /** First entry mirrors `guests[0]` for existing single-guest UI; `guests` is the real full
   * list (the real API field is a free-form JSONField, so entries may be name-only). */
  guest: EpisodeGuest;
  guests?: EpisodeGuest[];
  relatedEpisodes: RelatedEpisode[];
  /** Slug of the podcast show this episode belongs to — lets `subtitle` (the show name) link to
   * `/podcasts/shows/[seriesSlug]` instead of being plain text. */
  seriesSlug?: string;
}
