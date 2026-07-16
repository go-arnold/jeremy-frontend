"use client";

import React, { useState, useEffect } from "react";
import { blogCards as mockedBlogCards, blogCategories } from "@/data/blog";
import FeaturedArticle  from "@/components/blog/FeaturedArticle";
import CategoryFilter   from "@/components/blog/CategoryFilter";
import NewsletterBanner from "@/components/blog/NewsletterBanner";
import BlogDesktopLayout from "@/components/blog/BlogDesktopLayout";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiBlogToBlogCard } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { BlogCard } from "@/types/blog";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const data = await apiFetch<PaginatedResponse<any>>("/api/v1/articles/?page_size=15");
        const mapped = data.results.map(mapApiBlogToBlogCard);
        setPosts(mapped);
        setHasMore(!!data.next);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setPosts(mockedBlogCards as any);
      } finally {
        setLoading(false);
        setInitialDataLoaded(true);
      }
    }
    init();
  }, []);

  const loadMore = async (page: number) => {
    setLoadingLoadingMore(true);
    try {
      const data = await apiFetch<PaginatedResponse<any>>(`/api/v1/articles/?page=${page}&page_size=15`);
      const newPosts = data.results.map(mapApiBlogToBlogCard);
      setPosts(prev => [...prev, ...newPosts]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more articles:", error);
      setHasMore(false);
    } finally {
      setLoadingLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && posts.length === 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

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
            {featured && <FeaturedArticle post={featured as any} />}
            <CategoryFilter categories={blogCategories} posts={restOfPosts} />
            <VoirPlusPagination 
              onLoadMore={loadMore} 
              hasMore={hasMore} 
              isLoading={loadingMore} 
            />
            <NewsletterBanner />
          </main>

          {/* DESKTOP */}
          <main className="hidden lg:block flex-1 pb-16">
            <BlogDesktopLayout
              featured={featured as any}
              posts={restOfPosts}
              categories={blogCategories}
            />
            <div className="max-w-7xl mx-auto px-8">
              <VoirPlusPagination 
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
