import type { ApiBadge } from "@/lib/api-types";

// ── GET /gamification/users/{id}/badges/ — earned only ───────────────────────
export interface ApiUserBadge {
  badge: ApiBadge;
  earned_at: string;
}

// ── POST /gamification/consumption/ ──────────────────────────────────────────
export type ConsumptionContentType = "radio" | "podcast" | "webtv" | "live_music" | "release";

export interface ConsumptionPayload {
  content_type: ConsumptionContentType;
  object_id: number;
  seconds: number;
  title?: string;
  cover_url?: string;
}

export interface ConsumptionResponse {
  newly_earned_badges: ApiBadge[];
}

// ── GET /gamification/media-ranking/ ─────────────────────────────────────────
export interface MediaRankingItem {
  content_type: ConsumptionContentType;
  object_id: number;
  title: string;
  cover_url: string;
  total_seconds: number;
}
