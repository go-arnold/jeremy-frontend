import type { MetadataRoute } from "next";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { fetchArticles } from "@/lib/services/articles";
import { fetchReleases } from "@/lib/services/releases";
import { fetchEmissions } from "@/lib/services/emissions";
import { fetchEpisodes } from "@/lib/services/podcasts";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artdukivu.com";

const STATIC_ROUTES = [
  "",
  "/artistes",
  "/blog",
  "/communaute",
  "/concerts",
  "/documentaires",
  "/emissions",
  "/evenements",
  "/freestyles",
  "/interviews",
  "/live-music",
  "/magazine",
  "/podcasts",
  "/radio-en-direct",
  "/sorties-premieres",
  "/studio-sessions",
  "/top-artistes",
  "/top-morceaux",
  "/web-tv",
];

/** Every slug fetch is independent and best-effort — one content type's API failing must not
 * take the rest of the sitemap down with it. */
async function safeSlugs(
  fetcher: () => Promise<({ slug?: string } | null)[]>
): Promise<string[]> {
  try {
    const items = await fetcher();
    return items
      .map((item) => item?.slug)
      .filter((slug): slug is string => Boolean(slug));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, releases, emissions, episodes, artists, events, videos] = await Promise.all([
    safeSlugs(async () => (await fetchArticles(1, 100)).results),
    safeSlugs(async () => (await fetchReleases(1, 100)).results),
    safeSlugs(async () => (await fetchEmissions(1)).results ?? []),
    safeSlugs(async () => (await fetchEpisodes(1, 100)).results),
    safeSlugs(async () => (await apiFetch<PaginatedResponse<{ slug?: string }>>("/api/v1/artists/?page_size=100")).results),
    safeSlugs(async () => (await apiFetch<PaginatedResponse<{ slug?: string }>>("/api/v1/events/?page_size=100")).results),
    safeSlugs(async () => (await apiFetch<PaginatedResponse<{ slug?: string }>>("/api/v1/webtv/videos/?page_size=100")).results),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...articles.map((slug) => ({ url: `${SITE_URL}/blog/${slug}` })),
    ...releases.map((slug) => ({ url: `${SITE_URL}/sorties-premieres/${slug}` })),
    ...emissions.map((slug) => ({ url: `${SITE_URL}/emissions/${slug}` })),
    ...episodes.map((slug) => ({ url: `${SITE_URL}/podcasts/${slug}` })),
    ...artists.map((slug) => ({ url: `${SITE_URL}/artistes/${slug}` })),
    ...events.map((slug) => ({ url: `${SITE_URL}/evenements/${slug}` })),
    ...videos.map((slug) => ({ url: `${SITE_URL}/web-tv/${slug}` })),
  ];

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
  }));

  return [...staticEntries, ...dynamicEntries];
}
