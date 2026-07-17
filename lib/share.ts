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
export async function shareContent(params: { title: string; url: string; text?: string }): Promise<"shared" | "copied" | "cancelled"> {
  const shareUrl = params.url.startsWith("http") ? params.url : `${window.location.origin}${params.url}`;

  if (navigator.share) {
    try {
      await navigator.share({ title: params.title, text: params.text, url: shareUrl });
      return "shared";
    } catch (err: any) {
      if (err?.name === "AbortError") return "cancelled";
      // fall through to clipboard on any other native-share failure
    }
  }

  await navigator.clipboard.writeText(shareUrl);
  return "copied";
}
