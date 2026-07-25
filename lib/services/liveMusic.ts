import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiRadioToRadioProgram, formatRelativeDate } from "@/lib/mappers";
import type { ApiRadioOrLiveProgram as ApiRadioProgram } from "@/lib/api-types";

export async function fetchCurrentSession() {
  try {
    const data = await apiFetch<ApiRadioProgram>("/api/v1/live_music/sessions/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    return null; // nothing live right now
  }
}

/** Full sessions list (live + ended + scheduled) — used to find "the most recently gone live"
 * session via pickFeaturedByTimestamp (lib/mappers.ts) rather than trusting `/sessions/current/`
 * alone, which doesn't guarantee it already picked the right one when several sessions share
 * `status: "live"`/`"ended"` at once. */
export async function fetchLiveMusicSessions() {
  const data = await apiFetch<PaginatedResponse<ApiRadioProgram> | ApiRadioProgram[]>(
    "/api/v1/live_music/sessions/?page_size=50"
  );
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapApiRadioToRadioProgram);
}

export async function fetchProgramme() {
  // ~28 slots across the week — without an explicit page_size the default pagination only
  // returns the first page, silently dropping some days from the displayed schedule grid.
  const data = await apiFetch<PaginatedResponse<ApiRadioProgram> | ApiRadioProgram[]>(
    "/api/v1/live_music/programme/?page_size=50"
  );
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapApiRadioToRadioProgram);
}

interface RawApiChatMessage {
  id?: string | number;
  username?: string;
  avatar_url?: string;
  message?: string;
  created_at?: string;
}

export function mapChatMessage(msg: RawApiChatMessage) {
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
  const data = await apiFetch<PaginatedResponse<RawApiChatMessage> | RawApiChatMessage[]>(
    `/api/v1/live_music/sessions/${slug}/chat/`
  );
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapChatMessage);
}

export async function postLiveMusicChatMessage(slug: string, message: string) {
  const data = await apiFetch<RawApiChatMessage>(`/api/v1/live_music/sessions/${slug}/chat/`, {
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
