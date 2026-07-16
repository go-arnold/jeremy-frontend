"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { typeToHref } from "@/lib/mappers";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import ContentImage from "@/components/ui/ContentImage";

interface SearchResultItem {
  type: string;
  id: number | string;
  slug: string | null;
  title: string;
  image_url: string | null;
  score?: number;
}

interface SearchResponse {
  count: number;
  page: number;
  page_size: number;
  results: SearchResultItem[];
}

const TYPE_TABS: { id: string; label: string }[] = [
  { id: "", label: "Tous" },
  { id: "artists", label: "Artistes" },
  { id: "articles", label: "Articles" },
  { id: "events", label: "Événements" },
  { id: "podcast_series", label: "Podcasts" },
  { id: "podcast_episodes", label: "Épisodes" },
  { id: "releases", label: "Sorties" },
  { id: "webtv_videos", label: "Web TV" },
  { id: "community_posts", label: "Communauté" },
];

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const runSearch = useCallback(async (term: string, activeType: string, page: number, append = false) => {
    if (!term.trim()) {
      setResults([]);
      setCount(0);
      setError("");
      return;
    }
    try {
      const params = new URLSearchParams({ q: term, page: String(page), page_size: "20" });
      if (activeType) params.set("type", activeType);
      const data = await apiFetch<SearchResponse>(`/api/v1/search/?${params.toString()}`);
      setResults((prev) => (append ? [...prev, ...data.results] : data.results));
      setCount(data.count);
      setError("");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
      if (!append) {
        setResults([]);
        setCount(0);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    runSearch(q, type, 1, false).finally(() => setLoading(false));
  }, [q, type, runSearch]);

  const handleSubmit = (submittedQuery: string) => {
    const params = new URLSearchParams();
    if (submittedQuery.trim()) params.set("q", submittedQuery.trim());
    if (type) params.set("type", type);
    router.push(`/recherche?${params.toString()}`);
  };

  const handleTypeChange = (nextType: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (nextType) params.set("type", nextType);
    router.push(`/recherche?${params.toString()}`);
  };

  const loadMore = async (nextPage: number) => {
    setLoadingMore(true);
    await runSearch(q, type, nextPage, true);
    setLoadingMore(false);
  };

  const hasMore = results.length < count;

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 lg:px-8 max-w-4xl mx-auto">
      <SearchInputForm key={q} initialQuery={q} onSubmit={handleSubmit} />

      <div className="flex flex-wrap gap-2 mb-8">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.id || "tous"}
            onClick={() => handleTypeChange(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              type === tab.id
                ? "bg-primary text-white"
                : "bg-white/5 text-[#8A8178] hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : !q.trim() ? (
        <EmptyState
          message="Que recherchez-vous ?"
          description="Tapez un terme pour explorer artistes, événements, podcasts et plus."
          icon="search"
        />
      ) : error ? (
        <EmptyState message="Recherche indisponible" description={error} icon="cloud_off" />
      ) : results.length === 0 ? (
        <EmptyState
          message="Aucun résultat"
          description={`Aucun résultat pour "${q}".`}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {results.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={typeToHref(item.type, item.slug, item.id)}
                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-all border border-white/5"
              >
                <ContentImage
                  src={item.image_url}
                  alt={item.title}
                  className="w-14 h-14 rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#F0EDE8] truncate">{item.title}</p>
                  <p className="text-xs text-[#8A8178]">
                    {TYPE_TABS.find((t) => t.id === item.type)?.label || item.type}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <VoirPlusPagination key={`${q}-${type}`} onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
        </>
      )}
    </div>
  );
}

/**
 * Keyed by `q` from the parent so the draft resets to the committed query whenever the URL
 * changes externally (e.g. clicking a type tab) — avoids syncing via a setState-in-effect.
 */
function SearchInputForm({ initialQuery, onSubmit }: { initialQuery: string; onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState(initialQuery);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(query);
      }}
      className="flex items-center gap-2 mb-6"
    >
      <div className="relative flex-1">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">
          search
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Artistes, sons, événements..."
          className="w-full h-11 pl-10 pr-4 rounded-full text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary transition-all"
          style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
        />
      </div>
      <button
        type="submit"
        className="h-11 px-5 rounded-full bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-[#B8240C] transition-all"
      >
        Rechercher
      </button>
    </form>
  );
}
