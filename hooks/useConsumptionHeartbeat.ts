"use client";

import { useEffect } from "react";
import { recordConsumption } from "@/lib/services/gamification";
import type { ConsumptionContentType } from "@/types/gamification";

const HEARTBEAT_SECONDS = 30;

/** Shared gamification heartbeat for any audio/video player — call every ~30s while content is
 * actively playing, matching the pattern first built for `EpisodePlayer.tsx` (podcasts). Without
 * this, `services.record_consumption`'s threshold-based badges can never be earned organically. */
export function useConsumptionHeartbeat(
  playing: boolean,
  contentType: ConsumptionContentType,
  objectId: number | null | undefined,
  title: string,
  coverUrl?: string
) {
  useEffect(() => {
    if (!playing || !objectId) return;
    const interval = setInterval(() => {
      recordConsumption({
        content_type: contentType,
        object_id: objectId,
        seconds: HEARTBEAT_SECONDS,
        title,
        cover_url: coverUrl,
      }).catch(() => {});
    }, HEARTBEAT_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [playing, contentType, objectId, title, coverUrl]);
}
