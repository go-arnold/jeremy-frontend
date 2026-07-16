export type NowPlaying = {
  title: string;
  djName: string;
  coverImage: string;
  isLive: boolean;
  listenerCount: number;
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
};
