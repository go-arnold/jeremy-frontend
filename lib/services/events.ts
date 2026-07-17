import { apiFetch } from "@/lib/api-client";
import type { EventRegistrationResponse } from "@/types/evenements";

export async function registerForEvent(slug: string) {
  return apiFetch<EventRegistrationResponse>(`/api/v1/events/${slug}/register/`, {
    method: "POST",
  });
}
