export type UserProfile = {
  displayName: string;
  handle: string;
  bio: string;
  coverImage: string;
  avatar: string;
  isOnline: boolean;
};

export type ProfileStat = {
  id: string;
  value: string;
  label: string;
};

export type FavoriteArtist = {
  id: string;
  name: string;
  avatar: string;
};

export type ListenHistoryItemBase = {
  id: string;
  title: string;
  subtitle: string;
  coverImage: string;
  accentColor: string; // tailwind bg color e.g. "bg-orange-500/20"
  iconColor: string;   // tailwind text color e.g. "text-orange-500"
  icon: string;        // material symbol name
};

export type ListenHistoryItemIdle = ListenHistoryItemBase & {
  status: "idle";
};

export type ListenHistoryItemPlaying = ListenHistoryItemBase & {
  status: "playing";
  progressPercent: number; // 0–100
  timeRemaining: string;   // e.g. "Reste 15m"
};

export type ListenHistoryItem = ListenHistoryItemIdle | ListenHistoryItemPlaying;

export type Badge = {
  id: string;
  icon: string;         // material symbol, used as a fallback when iconUrl is absent
  iconUrl?: string | null; // real badges are a Cloudinary image, not a Material Symbol name
  label: string;        // two words, shown on two lines via \n
  color: string;        // tailwind text color
  glowColor: string;    // inline box-shadow color string e.g. "rgba(250,204,21,0.2)"
  unlocked: boolean;
};

// ── PATCH /auth/me/ ───────────────────────────────────────────────────────────
export interface ProfileUpdatePayload {
  username?: string;
  handle?: string;
  bio?: string;
  /** A Cloudinary `secure_url` already uploaded via the signed upload-signature flow — this
   * endpoint does not accept a raw file. */
  avatar?: string;
  cover_image?: string;
}

// ── GET /users/{id}/activity/ ─────────────────────────────────────────────────
export interface ApiActivityTarget {
  kind: string;
  id: number | null;
  slug: string | null;
  title: string;
  cover_url: string;
}

export interface ApiActivityEntry {
  action: "like" | "comment";
  created_at: string;
  excerpt?: string;
  target: ApiActivityTarget;
}

export interface ActivityEntry {
  id: string;
  action: "like" | "comment";
  createdAt: string;
  excerpt?: string;
  targetTitle: string;
  targetCoverImage: string;
  targetHref: string;
}
