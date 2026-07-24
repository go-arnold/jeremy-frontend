import { blogCards as mockedBlogCards } from "@/data/blog";
import { fetchArticles } from "@/lib/services/articles";
import type { BlogCard } from "@/types/blog";
import BlogPageClient from "./BlogPageClient";

async function getInitialPosts(): Promise<{ posts: BlogCard[]; hasMore: boolean }> {
  try {
    const data = await fetchArticles(1, 15);
    return { posts: data.results, hasMore: !!data.next };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    return { posts: mockedBlogCards as unknown as BlogCard[], hasMore: false };
  }
}

export default async function BlogPage() {
  const { posts, hasMore } = await getInitialPosts();
  return <BlogPageClient initialPosts={posts} initialHasMore={hasMore} />;
}
