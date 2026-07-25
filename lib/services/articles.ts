import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiBlogToBlogCard, mapApiArticleToBlogPost } from "@/lib/mappers";
import type { ApiArticleList, ApiArticleDetail } from "@/lib/api-types";
import type { BlogCard, BlogCategory } from "@/types/blog";

export async function fetchArticles(page = 1, pageSize = 15, category?: string) {
  const params = new URLSearchParams({ page: String(page), page_size: String(pageSize) });
  if (category) params.set("category", category);
  const data = await apiFetch<PaginatedResponse<ApiArticleList>>(`/api/v1/articles/?${params.toString()}`);
  return { ...data, results: data.results.map(mapApiBlogToBlogCard) };
}

export async function fetchArticleCategories() {
  const data = await apiFetch<
    { id: string; name: string; slug: string }[] |
    PaginatedResponse<{ id: string; name: string; slug: string }>
  >("/api/v1/articles/categories/");
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchArticle(slug: string) {
  const data = await apiFetch<ApiArticleDetail>(`/api/v1/articles/${slug}/`);
  return mapApiArticleToBlogPost(data);
}

export async function fetchRelatedArticles(currentSlug: string, category?: BlogCategory, limit = 3): Promise<BlogCard[]> {
  const data = await fetchArticles(1, Math.max(limit + 1, 4), category || undefined);
  return data.results.filter((post) => post.slug !== currentSlug).slice(0, limit);
}

/** Articles have their own bespoke like/comment system (`apps.articles`, NOT the generic
 * `EngagementActionsMixin` used by podcasts/webtv/releases/community) — a different response
 * shape, so this doesn't go through `useEngagement`. */
export async function toggleArticleLike(slug: string) {
  return apiFetch<{ action: "liked" | "unliked" }>(`/api/v1/articles/${slug}/like/`, {
    method: "POST",
  });
}

export interface ArticleComment {
  id: number;
  author_name: string;
  author_avatar: string | null;
  content: string;
  like_count: number;
  created_at: string;
}

export async function fetchArticleComments(slug: string, page = 1) {
  return apiFetch<PaginatedResponse<ArticleComment>>(
    `/api/v1/articles/${slug}/comments/?page=${page}`
  );
}

export async function postArticleComment(slug: string, content: string, parentId?: number) {
  return apiFetch<ArticleComment>(`/api/v1/articles/${slug}/comments/`, {
    method: "POST",
    body: JSON.stringify(parentId ? { content, parent_id: parentId } : { content }),
  });
}
