export type ReleaseFormat = "all" | "musique" | "clip" | "documentaire" | "expo";

export type FormatFilter = {
  id: ReleaseFormat;
  label: string;
};

export type FeaturedRelease = {
  id: string;
  month: string;           // e.g. "MARS 2026"
  title: string;
  releaseDate: string;     // e.g. "Sortie le 15 mars • Toutes plateformes"
  coverImage: string;
  isPremiere: boolean;
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
  day: number;
  month: string;           // e.g. "Oct"
  format: string;          // e.g. "Album • Musique"
  title: string;
  description: string;
  releaseInfo: string;     // e.g. "Sortie : 12 mars"
  releaseIcon: string;     // material symbol
  coverImage: string;
};
