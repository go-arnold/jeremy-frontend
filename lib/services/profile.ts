import { apiFetch } from "@/lib/api-client";
import { mapApiActivityEntryToActivityEntry } from "@/lib/mappers";
import type { ProfileUpdatePayload } from "@/types/monProfil";

/** Raw shape consumed by `mapApiActivityEntryToActivityEntry` (`GET /users/{id}/activity/`,
 * `apps.accounts.profile_services._resolve_target()`). */
interface ApiActivityEntry {
  action?: string;
  created_at?: string;
  excerpt?: string;
  target?: {
    kind?: string;
    title?: string;
    cover_url?: string;
    slug?: string;
    id?: number | string;
  };
}

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
