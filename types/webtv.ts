export type VideoCategory = "Freestyles" | "Studio Sessions" | "Docs" | "Interviews" | "Concerts" | "All";

export type FreestyleAspect = "3/4" | "square" | "9/16";

export interface FilterTab {
  label: VideoCategory;
  active?: boolean;
}

export interface PremierVideo {
  title: string;
  subtitle: string;
  liveTag: string; // ex: "En direct", "Exclusive"
  location?: string; // ex: "Goma"
  imageUrl: string;
  imageAlt: string;
  videoUrl?: string;
  playbackHlsUrl?: string;
  isLive?: boolean;
  href?: string;
}

export interface StudioSession {
  id: string;
  title: string;
  author: string;
  /** Texte relatif, ex: "2 days ago" */
  publishedAt: string;
  duration: string; // ex: "04:20"
  imageUrl: string;
  imageAlt: string;
  href?: string;
}

export interface FreestyleVideo {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  imageAlt: string;
  aspect: FreestyleAspect;
  isNew?: boolean;
  /** Afficher bouton play au hover */
  showPlayButton?: boolean;
  href?: string;
}

export interface DocVideo {
  id: string;
  title: string;
  description: string;
  tag: string; // ex: "Doc", "Culture"
  date: string; // ex: "Oct 24, 2026"
  duration: string; // ex: "24:10"
  imageUrl: string;
  imageAlt: string;
  href?: string;
}
