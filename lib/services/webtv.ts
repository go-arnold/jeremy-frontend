import { apiFetch } from "@/lib/api-client";
import type { ApiVideo } from "@/lib/api-types";

/** View-count increment — call once when playback actually starts, not on every render (mirrors
 * podcasts' `recordEpisodePlay`). Unlike podcasts, WebTV likes/comments/share/save already go
 * through the generic engagement system (`resourceType="webtv/videos"`) — this is the one action
 * that mixin doesn't cover. */
export async function recordVideoView(slug: string) {
  return apiFetch<ApiVideo>(`/api/v1/webtv/videos/${slug}/view/`, {
    method: "POST",
  });
}
