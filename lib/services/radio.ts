import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiRadioToRadioProgram, formatRelativeDate } from "@/lib/mappers";
import type { ApiRadioOrLiveProgram as ApiRadioProgram } from "@/lib/api-types";

export async function fetchCurrentProgram() {
  try {
    const data = await apiFetch<ApiRadioProgram>("/api/v1/radio/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    return null; // nothing live right now
  }
}

export async function fetchProgramSchedule() {
  // The full weekly schedule is ~63 slots (7 days × ~9/day) — without an explicit page_size the
  // default pagination only returns the first ~20, which can silently miss the actual live/ended
  // slot (it could be on any day of the week) when picking the program to feature.
  const data = await apiFetch<PaginatedResponse<ApiRadioProgram> | ApiRadioProgram[]>(
    "/api/v1/radio/program/?page_size=100"
  );
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapApiRadioToRadioProgram);
}

interface RawChatMessage {
  id: string;
  username: string;
  avatarUrl: string;
  text: string;
  timeLabel: string;
}

interface RawApiChatMessage {
  id?: string | number;
  username?: string;
  user?: { username?: string; avatar_url?: string };
  avatar_url?: string;
  message?: string;
  content?: string;
  created_at?: string;
}

function mapChatMessage(msg: RawApiChatMessage): RawChatMessage {
  return {
    id: String(msg.id || Math.random()),
    username: msg.username || msg.user?.username || "Anonyme",
    avatarUrl: msg.avatar_url || msg.user?.avatar_url || "",
    text: msg.message || msg.content || "",
    // RadioChatSerializer only ever returns a raw `created_at`, never a `created_at_human`
    // companion field — the latter always read undefined and fell straight to the fallback.
    timeLabel: formatRelativeDate(msg.created_at),
  };
}

export async function fetchRadioChat() {
  const data = await apiFetch<PaginatedResponse<RawApiChatMessage> | RawApiChatMessage[]>(
    "/api/v1/radio/chat/"
  );
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapChatMessage);
}

/** Radio has its own bespoke chat model (`apps.radio.RadioChatViewSet`) — a REST POST, not the
 * `apps.realtime` WebSocket-relay pattern webtv/live_music use. There is currently no live
 * push of new messages to other viewers from this endpoint alone; pair with polling or a
 * WS subscription in the UI layer if real-time delivery is needed. */
export async function postRadioChatMessage(message: string) {
  const data = await apiFetch<RawApiChatMessage>("/api/v1/radio/chat/", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return mapChatMessage(data);
}
