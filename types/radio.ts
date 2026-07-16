export type ProgramStatus = "now" | "next" | "later";

export interface ChatMessage {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  /** Texte affiché pour le timestamp, ex: "2m", "Now" */
  timeLabel: string;
}

export interface LiveShow {
  title: string;
  host: string;
  listenerCount: string; // ex: "1.2k"
  isPlaying: boolean;
  imageUrl: string;
  imageAlt: string;
  messages: ChatMessage[];
}

export interface ProgramSlot {
  id: string;
  status: ProgramStatus;
  time: string; // ex: "08:00"
  title: string;
  host: string;
}

export interface MembershipBanner {
  title: string;
  subtitle: string;
  ctaLabel: string;
}
