export function isValidImageSrc(src?: string | null): src is string {
  if (typeof src !== "string" || src.trim() === "") return false;
  if (src.startsWith("/placeholder-")) return false;
  return true;
}
