export function isValidImageSrc(src?: string | null): src is string {
  if (typeof src !== "string" || src.trim() === "") return false;
  if (src.startsWith("/placeholder-")) return false;
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
