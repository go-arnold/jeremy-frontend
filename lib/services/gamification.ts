import { apiFetch } from "@/lib/api-client";
import type { ConsumptionPayload, ConsumptionResponse } from "@/types/gamification";

/** Heartbeat while content is actively playing — call every ~30s from any audio/video player
 * (radio, live-music, podcasts, webtv), never for paused/idle time. Powers both the profile's
 * listen-history ranking and real badge-earning (`services.record_consumption`,
 * threshold-based) — without this being called, badges can never be earned organically. */
export async function recordConsumption(payload: ConsumptionPayload) {
  return apiFetch<ConsumptionResponse>("/api/v1/gamification/consumption/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
