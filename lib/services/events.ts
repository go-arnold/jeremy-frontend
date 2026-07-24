import { apiFetch } from "@/lib/api-client";
import type { EventRegistrationResponse } from "@/types/evenements";

/** Currently has no callers — `BookingWidget.tsx` used to call this on ticket booking, but the
 * confirmation it promised never actually happened server-side, so it now shows a
 * `ComingSoonModal` instead (see the comment there). Not dead by oversight; leave unwired until
 * the real booking flow is backed by a server-side confirmation. */
export async function registerForEvent(slug: string) {
  return apiFetch<EventRegistrationResponse>(`/api/v1/events/${slug}/register/`, {
    method: "POST",
  });
}
