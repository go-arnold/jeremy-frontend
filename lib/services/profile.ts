import { apiFetch } from "@/lib/api-client";
import { mapApiActivityEntryToActivityEntry } from "@/lib/mappers";
import type { ProfileUpdatePayload } from "@/types/monProfil";

export async function updateProfile(payload: ProfileUpdatePayload) {
  return apiFetch<any>("/api/v1/auth/me/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function fetchActivity(userId: string | number) {
  const data = await apiFetch<any[]>(`/api/v1/users/${userId}/activity/`);
  return data.map(mapApiActivityEntryToActivityEntry);
}
