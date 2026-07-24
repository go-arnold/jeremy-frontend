import { apiFetch } from "@/lib/api-client";
import { mapApiActivityEntryToActivityEntry } from "@/lib/mappers";
import type { ProfileUpdatePayload } from "@/types/monProfil";
import type { ApiActivityEntry } from "@/lib/api-types";

export async function updateProfile(payload: ProfileUpdatePayload) {
  return apiFetch<{ id: number; username: string }>("/api/v1/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function fetchActivity(userId: string | number) {
  const data = await apiFetch<ApiActivityEntry[]>(`/api/v1/users/${userId}/activity/`);
  return data.map(mapApiActivityEntryToActivityEntry);
}
