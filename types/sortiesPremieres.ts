// Matches real backend values (MusicRelease.FORMAT_CHOICES) exactly, since `?format=` is passed
// straight through as a query param — "all" is a synthetic client-only value (no filter applied).
export type ReleaseFormat = "all" | "album" | "single" | "clip" | "documentaire" | "expo";

export type FormatFilter = {
  id: ReleaseFormat;
  label: string;
};

export type FeaturedRelease = {
  id: string;
  slug?: string;
  href?: string;
  month: string;           // e.g. "MARS 2026"
  title: string;
  releaseDate: string;     // e.g. "Sortie le 15 mars • Toutes plateformes"
  /** Raw ISO date (`release_date`), needed for real calendar-grid placement — `releaseDate`
   * above is already human-formatted for display and can't be parsed back reliably. */
  rawDate?: string;
  coverImage: string;
  isPremiere: boolean;
  artistName?: string;
  likeCount?: number;
  commentCount?: number;
  streamingLinks?: Record<string, string>;
  previewUrl?: string | null;
  description?: string;
};

export type CalendarDay = {
  day: number;
  colStart?: number;       // CSS grid col-start for offset (1-7)
  isToday?: boolean;
  hasEvent?: boolean;
  isPast?: boolean;
};

export type CalendarMonth = {
  label: string;           // e.g. "Mars 2026"
  days: CalendarDay[];
};

export type UpcomingRelease = {
  id: string;
  slug?: string;
  href?: string;
  day: number;
  month: string;           // e.g. "Oct"
  format: string;          // e.g. "Album • Musique"
  title: string;
  description: string;
  releaseInfo: string;     // e.g. "Sortie : 12 mars"
  releaseIcon: string;     // material symbol
  coverImage: string;
  rawDate?: string;
  likeCount?: number;
  commentCount?: number;
};
