import { apiFetch } from "@/lib/api-client";
import type { NewsletterSubscribeResponse } from "@/types/newsletter";

export async function subscribeToNewsletter(email: string) {
  return apiFetch<NewsletterSubscribeResponse>("/api/v1/newsletter/subscribe/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

/** Confirms a subscription from the link sent by the confirmation email — a plain GET, no auth
 * required (anonymous `{}` security scheme in the spec, since the user clicks this from their
 * inbox, not while logged in). */
export async function confirmNewsletterSubscription(token: string) {
  return apiFetch<NewsletterSubscribeResponse>(`/api/v1/newsletter/confirm/${token}/`);
}

/** Unsubscribes from the link sent in every campaign email — same anonymous-GET shape as
 * confirm above. */
export async function unsubscribeFromNewsletter(token: string) {
  return apiFetch<NewsletterSubscribeResponse>(`/api/v1/newsletter/unsubscribe/${token}/`);
}
