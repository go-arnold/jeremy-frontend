"use client";

import React, { useState } from "react";
import { blogCards as mockedBlogCards } from "@/data/blog";
import FeaturedArticle  from "@/components/blog/FeaturedArticle";
import CategoryFilter   from "@/components/blog/CategoryFilter";
import NewsletterBanner from "@/components/blog/NewsletterBanner";
import BlogDesktopLayout from "@/components/blog/BlogDesktopLayout";
import { fetchArticles } from "@/lib/services/articles";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { BlogCard, BlogCategory } from "@/types/blog";

export default function BlogPageClient({
  initialPosts,
  initialHasMore,
  initialCategories,
}: {
  initialPosts: BlogCard[];
  initialHasMore: boolean;
  initialCategories: BlogCategory[];
}) {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>("Tous");
  const [posts, setPosts] = useState<BlogCard[]>(initialPosts);
  const [categories] = useState<BlogCategory[]>(initialCategories);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

  const loadCategory = async (category: BlogCategory) => {
    setActiveCategory(category);
    setLoadingLoadingMore(true);
    try {
      const data = await fetchArticles(1, 15, category === "Tous" ? undefined : category);
      setPosts(data.results);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to filter articles by category:", error);
      const fallbackPosts = mockedBlogCards as unknown as BlogCard[];
      setPosts(
        category === "Tous"
          ? fallbackPosts
          : fallbackPosts.filter((post) => post.category === category)
      );
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await fetchArticles(
        page,
        15,
        activeCategory === "Tous" ? undefined : activeCategory
      );
      const existingIds = new Set(posts.map((p) => p.id));
      const newPosts = data.results.filter((post) => !existingIds.has(post.id));
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more articles:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = posts.length === 0;

  const featured    = posts.find((p) => p.featured) || posts[0];
  const restOfPosts = posts.filter((p) => p.id !== featured?.id);

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">

      {showEmptyState ? (
        <main className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            message="Aucun article trouvé"
            description="Nos rédacteurs préparent de nouveaux contenus passionnants sur la culture du Kivu. Repassez plus tard !"
            icon="article"
          />
        </main>
      ) : (
        <>
          {/* MOBILE */}
          <main className="lg:hidden flex-1 pb-24 max-w-md mx-auto w-full px-4">
            {featured && <FeaturedArticle post={featured} />}
            <CategoryFilter
              categories={categories}
              active={activeCategory}
              onCategoryChange={loadCategory}
              posts={restOfPosts}
            />
            <VoirPlusPagination
              key={`mobile-${activeCategory}`}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={loadingMore}
            />
            <NewsletterBanner />
          </main>

          {/* DESKTOP */}
          <main className="hidden lg:block flex-1 pb-16">
            <BlogDesktopLayout
              featured={featured}
              posts={posts}
              categories={categories}
              active={activeCategory}
              onCategoryChange={loadCategory}
            />
            <div className="mx-auto px-8">
              <VoirPlusPagination
                key={`desktop-${activeCategory}`}
                onLoadMore={loadMore}
                hasMore={hasMore}
                isLoading={loadingMore}
              />
            </div>
          </main>
        </>
      )}
    </div>
  );
}
