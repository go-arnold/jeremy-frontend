"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { VideoItem } from "@/types/artistes";
import ArtisteSectionEmptyState from "./ArtisteSectionEmptyState";

const PAGE_SIZE = 4;

interface Props {
  videos: VideoItem[];
}

export default function KivuTV({ videos }: Props) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  return (
    <section className="flex flex-col px-5">
      <div className="pb-3">
        <h3 className="font-display text-lg font-bold text-white tracking-tight">
          Vidéos
        </h3>
        <span className="text-[11px] text-gray-500 font-medium">
          Vidéos officielles &amp; sets en direct
        </span>
      </div>

      {videos.length === 0 ? (
        <ArtisteSectionEmptyState icon="videocam_off" message="Aucune vidéo disponible pour le moment." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            {visible.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-3 w-full h-10 rounded-xl border border-white/10 text-xs font-bold text-[#8A8178] hover:text-white hover:bg-white/5 transition-colors"
            >
              Voir plus
            </button>
          )}
        </>
      )}
    </section>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <Link href={video.href} className="flex flex-col gap-2 group cursor-pointer" target="_blank" rel="noopener noreferrer">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg bg-black/30">
        {video.thumbnail && (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {/* Overlay play */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="size-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>
        {/* Durée */}
        {video.duration && (
          <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-bold text-white">
            {video.duration}
          </div>
        )}
      </div>

      {/* Texte */}
      <div>
        <h4 className="text-white font-display font-bold text-xs leading-tight line-clamp-2">
          {video.title}
        </h4>
        <p className="text-gray-500 text-[10px] mt-0.5 truncate">
          {video.views} • {video.publishedAt}
        </p>
      </div>
    </Link>
  );
}
