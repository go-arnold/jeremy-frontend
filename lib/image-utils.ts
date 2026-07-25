export function isValidImageSrc(src?: string | null): src is string {
  if (typeof src !== "string" || src.trim() === "") return false;
  if (src.startsWith("/placeholder-")) return false;
  // next/image's `src` must be an absolute URL or a site-relative path starting with "/" — some
  // community posts come back with a bare, truncated fragment instead (e.g.
  // "artdukivu/seed/square/163" instead of the full Cloudinary URL), which next/image throws a
  // hard render error on rather than firing `onError` like a normal failed image load. Treating
  // it as invalid up front routes it through the placeholder instead of crashing the page.
  if (!/^https?:\/\//.test(src) && !src.startsWith("/")) return false;
  return true;
}

/**
 * Some API endpoints (e.g. `/events/`) return `http://` Cloudinary URLs instead of `https://` —
 * next.config.ts's `images.remotePatterns` only allows `https` (deliberately, to avoid mixed
 * content), so an `http://` src makes `next/image` throw "Invalid src prop ... is not configured"
 * instead of just failing to load. Cloudinary (and effectively every image host in this app)
 * serves the exact same asset over https, so upgrading here is safe and avoids loosening the
 * remotePatterns config just to work around a backend inconsistency.
 */
export function toSecureImageUrl(src: string): string {
  return src.startsWith("http://") ? `https://${src.slice("http://".length)}` : src;
}
