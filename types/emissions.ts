export type EmissionStatus = "live" | "scheduled" | "recorded";

// ── Card, /emissions list ────────────────────────────────────────────────────
export interface EmissionCard {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  status: EmissionStatus;
  isLive: boolean;
  scheduledAt: string | null;
  durationMinutes: number;
  viewerCount: number;
  totalViews: number;
  href: string;
}

// ── Detail, /emissions/[slug] ─────────────────────────────────────────────────
export interface EmissionDetail extends EmissionCard {
  description: string;
  streamUrl: string;
  hlsUrl: string | null;
  hostNames: string[];
  likeCount: number;
  commentCount: number;
}
