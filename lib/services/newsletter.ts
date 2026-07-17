import { apiFetch } from "@/lib/api-client";
import type { NewsletterSubscribeResponse } from "@/types/newsletter";

export async function subscribeToNewsletter(email: string) {
  return apiFetch<NewsletterSubscribeResponse>("/api/v1/newsletter/subscribe/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
