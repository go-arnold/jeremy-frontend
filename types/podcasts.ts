export type PodcastCategory =
  | "Tout"
  | "Artistes"
  | "Société"
  | "Histoire"
  | "Entrepreneuriat Créatif"
  | "Environnement"
  | "Économie"
  | "Innovation"
  | "Santé";

// ── /podcasts — épisodes liste ────────────────────────────────────────────────

// Épisode hero "À la une" (grand format 16/10)
export interface FeaturedEpisode {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  duration: string;       // "52 min"
}

// Épisode "Sélection" (grand format plein largeur h-[300px])
export interface SelectionEpisode {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  category: PodcastCategory;
  duration: string;
  host: string;           // "Sarah M."
}

// Épisode "Récents" (liste avec vignette carrée + play button)
export interface RecentEpisode {
  id: string;
  slug: string;
  title: string;
  guest: string;          // "Invité : Akram Idriss"
  image: string;
  category: PodcastCategory;
  duration: string;       // "28 min"
  language: string;       // "FR" | "Français"
}

// Épisode "Sélection récente" (layout horizontal avec add_circle)
export interface LatestPickEpisode {
  id: string;
  slug: string;
  title: string;
  guest: string;          // "Invitée : Imani K. • Fondatrice de KivuTech"
  image: string;
  category: PodcastCategory;
  duration: string;       // "45 min"
  publishedAt: string;    // "Il y a 2 jours"
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
}
