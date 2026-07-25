export type NowPlaying = {
  slug?: string;
  numericId?: number | null;
  title: string;
  description?: string;
  djName: string;
  coverImage: string;
  isLive: boolean;
  listenerCount: number;
  hlsUrl?: string | null;
  likeCount?: number;
  commentCount?: number;
};

export type ChatMessage = {
  id: string;
  username: string;
  avatar: string;
  message: string;
  tag?: string;
  timeAgo: string;
};

export type ProgramStatus = "on-air" | "upcoming";

export type ProgramSlot = {
  id: string;
  time: string; // e.g. "10:00"
  title: string;
  subtitle: string;
  icon: string; // material symbol name
  status: ProgramStatus;
  /** 0=Monday..6=Sunday (`DayOfWeekEnum`) — undefined on mocked/legacy data. */
  dayOfWeek?: number;
  /** Human-readable day name from the backend (`day_name`), e.g. "Lundi" — shown only for
   * slots that aren't today's, in the "À venir" section. */
  dayName?: string;
};
