import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiRadioToRadioProgram, formatRelativeDate } from "@/lib/mappers";

export async function fetchCurrentSession() {
  try {
    const data = await apiFetch<any>("/api/v1/live_music/sessions/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    return null; // nothing live right now
  }
}

export async function fetchProgramme() {
  const data = await apiFetch<PaginatedResponse<any> | any[]>("/api/v1/live_music/programme/");
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapApiRadioToRadioProgram);
}

export function mapChatMessage(msg: any) {
  return {
    id: String(msg.id || Math.random()),
    username: msg.username || "Anonyme",
    avatar: msg.avatar_url || "",
    message: msg.message || "",
    tag: "",
    // LiveChatMessageSerializer only ever returns a raw `created_at`, never a `created_at_human`
    // companion field — the latter always read undefined and fell straight to the fallback.
    // Same raw shape is delivered over the `useLiveRoom` WebSocket broadcast, so this also
    // normalizes real-time messages, not just the initial REST history fetch.
    timeAgo: formatRelativeDate(msg.created_at),
  };
}

/** Live Music uses the generic `apps.realtime` chat (`LiveChatViewSetMixin`) — same
 * architecture as WebTV — so pair this with `useLiveRoom("live_music", slug)` for real-time
 * delivery to other viewers, not just this poster's own optimistic append. */
export async function fetchLiveMusicChat(slug: string) {
  const data = await apiFetch<PaginatedResponse<any> | any[]>(
    `/api/v1/live_music/sessions/${slug}/chat/`
  );
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapChatMessage);
}

export async function postLiveMusicChatMessage(slug: string, message: string) {
  const data = await apiFetch<any>(`/api/v1/live_music/sessions/${slug}/chat/`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return mapChatMessage(data);
}

export async function fetchLiveMusicOnlineCount(slug: string) {
  const data = await apiFetch<{ online_count: number }>(
    `/api/v1/live_music/sessions/${slug}/online-count/`
  );
  return data.online_count;
}
