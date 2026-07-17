import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiRadioToRadioProgram, formatRelativeDate } from "@/lib/mappers";

export async function fetchCurrentProgram() {
  try {
    const data = await apiFetch<any>("/api/v1/radio/current/");
    return mapApiRadioToRadioProgram(data);
  } catch {
    return null; // nothing live right now
  }
}

export async function fetchProgramSchedule() {
  const data = await apiFetch<PaginatedResponse<any> | any[]>("/api/v1/radio/program/");
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

function mapChatMessage(msg: any): RawChatMessage {
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
  const data = await apiFetch<PaginatedResponse<any> | any[]>("/api/v1/radio/chat/");
  const results = Array.isArray(data) ? data : data.results || [];
  return results.map(mapChatMessage);
}

/** Radio has its own bespoke chat model (`apps.radio.RadioChatViewSet`) — a REST POST, not the
 * `apps.realtime` WebSocket-relay pattern webtv/live_music use. There is currently no live
 * push of new messages to other viewers from this endpoint alone; pair with polling or a
 * WS subscription in the UI layer if real-time delivery is needed. */
export async function postRadioChatMessage(message: string) {
  const data = await apiFetch<any>("/api/v1/radio/chat/", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
  return mapChatMessage(data);
}
