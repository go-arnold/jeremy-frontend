import { apiFetch } from "@/lib/api-client";
import { mapApiEventToEvent } from "@/lib/mappers";
import type { ApiEvent } from "@/lib/api-types";
import type { EventRegistrationResponse } from "@/types/evenements";

/** The backend's actual curated featured event — distinct from the client-side
 * `events.find(e => e.isFeatured) || events[0]` heuristic in `EventsPageClient.tsx`, which only
 * searches whatever page of the general list happens to be loaded and silently falls back to an
 * arbitrary first result if the real featured event isn't in it. */
export async function fetchFeaturedEvent() {
  const data = await apiFetch<ApiEvent>("/api/v1/events/featured/");
  return mapApiEventToEvent(data);
}

/** Currently has no callers — `BookingWidget.tsx` used to call this on ticket booking, but the
 * confirmation it promised never actually happened server-side, so it now shows a
 * `ComingSoonModal` instead (see the comment there). Not dead by oversight; leave unwired until
 * the real booking flow is backed by a server-side confirmation. */
export async function registerForEvent(slug: string) {
  return apiFetch<EventRegistrationResponse>(`/api/v1/events/${slug}/register/`, {
    method: "POST",
  });
}
