/**
 * Every "share" icon across the app (artists, blog, events, podcasts, radio, live-music, WebTV
 * premier, profile) was decorative — no `onClick` at all — this is the one shared handler to
 * wire all of them consistently, instead of N separate copy-pasted implementations.
 *
 * Uses the native Web Share API where available (mobile browsers, some desktop), falling back
 * to copying the link to the clipboard. This is independent of the backend `share`/engagement
 * endpoint: call `useEngagement(...).share()` too, where the resource actually supports it
 * (podcasts, webtv, releases, emissions, live_music, community posts), to keep the
 * server-side share_count in sync — this function only handles the user-facing share action
 * itself and never fails loudly if the user just cancels the native share sheet.
 */
export function resolveShareUrl(url: string): string {
  return url.startsWith("http") ? url : `${window.location.origin}${url}`;
}

/** External share targets (WhatsApp/Facebook/X/Telegram) for the manual `ShareMenu` fallback —
 * shown when `navigator.share` isn't available (mostly desktop browsers) instead of jumping
 * straight to a silent clipboard copy, so sharing still feels like the native app share sheets
 * users get on mobile. */
export function getShareLinks(url: string, text: string): { label: string; href: string }[] {
  const shareUrl = resolveShareUrl(url);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(text);
  return [
    { label: "WhatsApp", href: `https://wa.me/?text=${encodedText}%20${encodedUrl}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X (Twitter)", href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}` },
  ];
}

export async function shareContent(params: { title: string; url: string; text?: string }): Promise<"shared" | "copied" | "cancelled"> {
  const shareUrl = resolveShareUrl(params.url);

  if (navigator.share) {
    try {
      await navigator.share({ title: params.title, text: params.text, url: shareUrl });
      return "shared";
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return "cancelled";
      // fall through to clipboard on any other native-share failure
    }
  }

  // Both `navigator.share` and `navigator.clipboard` are only exposed in secure contexts
  // (https, or localhost) — over plain http on a LAN IP (common when testing on a phone against
  // a local dev server) `navigator.clipboard` is `undefined`, and calling `.writeText` on it
  // would throw a raw TypeError. Surface a clear, catchable message instead.
  if (!navigator.clipboard?.writeText) {
    throw new Error("Le partage n'est pas disponible sur cette connexion (HTTPS requis).");
  }

  await navigator.clipboard.writeText(shareUrl);
  return "copied";
}
