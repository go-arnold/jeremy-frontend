import { blogCards as mockedBlogCards } from "@/data/blog";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiBlogToBlogCard } from "@/lib/mappers";
import type { BlogCard } from "@/types/blog";
import type { ApiArticleList } from "@/lib/api-types";
import BlogPageClient from "./BlogPageClient";

async function getInitialPosts(): Promise<{ posts: BlogCard[]; hasMore: boolean }> {
  try {
    const data = await apiFetch<PaginatedResponse<ApiArticleList>>("/api/v1/articles/?page_size=15");
    return { posts: data.results.map(mapApiBlogToBlogCard), hasMore: !!data.next };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { posts: mockedBlogCards as unknown as BlogCard[], hasMore: false };
  }
}

export default async function BlogPage() {
  const { posts, hasMore } = await getInitialPosts();
  return <BlogPageClient initialPosts={posts} initialHasMore={hasMore} />;
}
