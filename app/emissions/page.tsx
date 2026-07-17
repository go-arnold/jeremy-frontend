"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchEmissions, fetchLiveEmission } from "@/lib/services/emissions";
import EmissionCard from "@/components/emissions/EmissionCard";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { EmissionCard as EmissionCardType, EmissionDetail } from "@/types/emissions";

export default function EmissionsPage() {
  const [emissions, setEmissions] = useState<EmissionCardType[]>([]);
  const [live, setLive] = useState<EmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [data, liveEmission] = await Promise.all([
          fetchEmissions(1),
          fetchLiveEmission(),
        ]);
        setEmissions(data.results);
        setHasMore(!!data.next);
        setLive(liveEmission);
      } catch (error) {
        console.error("Failed to fetch emissions:", error);
      } finally {
        setLoading(false);
        setInitialDataLoaded(true);
      }
    }
    init();
  }, []);

  const loadMore = async (nextPage: number) => {
    setLoadingMore(true);
    try {
      const data = await fetchEmissions(nextPage);
      setEmissions((prev) => [...prev, ...data.results]);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load more emissions:", error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const showEmptyState = initialDataLoaded && emissions.length === 0 && !live;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 lg:pt-16">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-2">
            Art du Kivu
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-[#F0EDE8] leading-tight">
            Émissions
          </h1>
          <p className="text-[#8A8178] mt-2 text-base">
            Débats, magazines et talk-shows en direct du Kivu
          </p>
        </div>

        {live && (
          <Link
            href={live.href}
            className="group relative flex flex-col lg:flex-row gap-4 rounded-2xl overflow-hidden border border-primary/30 mb-10"
            style={{ background: "rgba(18,34,60,0.6)" }}
          >
            <div className="relative w-full lg:w-96 aspect-video shrink-0 overflow-hidden bg-black">
              {live.coverImage && (
                <img
                  alt={live.title}
                  src={live.coverImage}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute top-3 left-3 bg-primary px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="text-[10px] font-black uppercase text-white tracking-widest">
                  En direct
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center p-5 gap-2">
              <h2 className="text-2xl font-black text-[#F0EDE8] leading-tight group-hover:text-primary transition-colors">
                {live.title}
              </h2>
              {live.hostNames.length > 0 && (
                <p className="text-[#8A8178] text-sm">{live.hostNames.join(", ")}</p>
              )}
              <p className="text-[#F0EDE8]/70 text-sm line-clamp-2">{live.description}</p>
            </div>
          </Link>
        )}

        {showEmptyState ? (
          <EmptyState
            message="Aucune émission pour le moment"
            description="Revenez bientôt pour découvrir les prochaines émissions du Kivu."
            icon="live_tv"
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {emissions.map((emission) => (
                <EmissionCard key={emission.id} emission={emission} />
              ))}
            </div>
            <div className="mt-8">
              <VoirPlusPagination onLoadMore={loadMore} hasMore={hasMore} isLoading={loadingMore} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
