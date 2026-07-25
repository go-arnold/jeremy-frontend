import { blogCards as mockedBlogCards } from "@/data/blog";
import { fetchArticleCategories, fetchArticles } from "@/lib/services/articles";
import type { BlogCard, BlogCategory } from "@/types/blog";
import BlogPageClient from "./BlogPageClient";

// ISR — refetches at most every 60s instead of freezing at build time forever.
export const revalidate = 60;

function buildCategories(posts: BlogCard[], apiCategoryNames: string[] = []): BlogCategory[] {
  const merged = [...apiCategoryNames, ...posts.map((p) => p.category).filter(Boolean)];
  const unique = Array.from(new Set(merged));
  return ["Tous", ...unique.filter((c) => c !== "Tous")];
}

async function getInitialData(): Promise<{ posts: BlogCard[]; hasMore: boolean; categories: BlogCategory[] }> {
  try {
    const [articlesData, categoriesData] = await Promise.all([
      fetchArticles(1, 15),
      fetchArticleCategories(),
    ]);
    const apiCategoryNames = categoriesData.map((category) => category.name).filter(Boolean);
    return {
      posts: articlesData.results,
      hasMore: !!articlesData.next,
      categories: buildCategories(articlesData.results, apiCategoryNames),
    };
  } catch (error) {
    console.error("Failed to fetch articles:", error);
    const mocked = mockedBlogCards as unknown as BlogCard[];
    return { posts: mocked, hasMore: false, categories: buildCategories(mocked) };
  }
}

export default async function BlogPage() {
  const { posts, hasMore, categories } = await getInitialData();
  return <BlogPageClient initialPosts={posts} initialHasMore={hasMore} initialCategories={categories} />;
}
