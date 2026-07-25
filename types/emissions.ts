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
  /** No `ended_at`/`started_at` field exists on the backend at all — this is derived
   * (`scheduledAt + durationMinutes`) as the best available estimate of when a recorded
   * emission's original broadcast finished. `null` when `scheduledAt` is missing. Already
   * computable from the list endpoint's own fields, so it lives on the card, not just detail. */
  endedAt: string | null;
}

// ── Detail, /emissions/[slug] ─────────────────────────────────────────────────
export interface EmissionDetail extends EmissionCard {
  description: string;
  streamUrl: string;
  hlsUrl: string | null;
  /** The recorded replay's actual audio file (real field is `video_url` — see the comment on
   * `ApiEmission` for why). Only ever populated once `recording_status` is ready; empty while
   * live or scheduled. */
  videoUrl: string;
  hostNames: string[];
  likeCount: number;
  commentCount: number;
}
