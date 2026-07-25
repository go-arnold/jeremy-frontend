"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchEmissions } from "@/lib/services/emissions";
import EmissionCardComponent from "@/components/emissions/EmissionCard";
import EmptyState from "@/components/ui/EmptyState";
import VoirPlusPagination from "@/components/ui/VoirPlusPagination";
import type { EmissionCard as EmissionCardType, EmissionDetail } from "@/types/emissions";

interface EmissionsPageClientProps {
  initialEmissions: EmissionCardType[];
  initialHasMore: boolean;
  initialLive: EmissionDetail | null;
}

export default function EmissionsPageClient({
  initialEmissions,
  initialHasMore,
  initialLive,
}: EmissionsPageClientProps) {
  const [emissions, setEmissions] = useState<EmissionCardType[]>(initialEmissions);
  const [live] = useState<EmissionDetail | null>(initialLive);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);

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

  const showEmptyState = emissions.length === 0 && !live;

  return (
    <div className="min-h-screen pb-16">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-8 lg:pt-16">
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
                <Image
                  alt={live.title}
                  src={live.coverImage}
                  fill
                  sizes="(max-width: 1024px) 100vw, 384px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
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
              <div className="flex flex-wrap items-center gap-3 text-xs mt-1">
                <span className="flex items-center gap-1 text-primary font-bold">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  {live.viewerCount} spectateur{live.viewerCount !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1 text-[#8A8178]">
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  {live.totalViews} vue{live.totalViews !== 1 ? "s" : ""} au total
                </span>
              </div>
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
                <EmissionCardComponent key={emission.id} emission={emission} />
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
