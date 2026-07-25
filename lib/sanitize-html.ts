const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "blockquote",
  "h2",
  "h3",
  "h4",
  "a",
]);

const SAFE_HREF = /^(https?:\/\/|mailto:|tel:|\/|#)/i;

function sanitizeHref(raw: string | null): string {
  if (!raw) return "#";
  const decoded = raw.trim().replace(/^['"]|['"]$/g, "");
  return SAFE_HREF.test(decoded) ? decoded : "#";
}

/**
 * Minimal sanitizer for backend-provided article rich text.
 * Keeps a small, safe tag allowlist and strips style/events/unsafe tags.
 */
export function sanitizeArticleHtml(input: string): string {
  let html = input || "";

  // Remove dangerous blocks entirely.
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "");
  html = html.replace(/<(object|embed|form|input|button|textarea|select|meta|link)[^>]*>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  return html.replace(/<\/?([a-z0-9-]+)([^>]*)>/gi, (match, rawTag: string, rawAttrs: string) => {
    const tag = rawTag.toLowerCase();
    const isClosing = match.startsWith("</");

    if (!ALLOWED_TAGS.has(tag)) return "";
    if (isClosing) return `</${tag}>`;

    if (tag === "a") {
      const hrefMatch = rawAttrs.match(/\shref\s*=\s*(".*?"|'.*?'|[^\s>]+)/i);
      const href = sanitizeHref(hrefMatch?.[1] ?? null);
      return `<a href="${href}" rel="noopener noreferrer">`;
    }

    return `<${tag}>`;
  });
}
