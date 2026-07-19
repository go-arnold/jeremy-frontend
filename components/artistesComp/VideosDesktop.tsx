"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { VideoItem } from "@/types/artistes";
import ArtisteSectionEmptyState from "./ArtisteSectionEmptyState";

const PAGE_SIZE = 6;

export default function VideosDesktop({ videos }: { videos: VideoItem[] }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-xl">smart_display</span>
        <h3 className="font-display text-2xl font-bold text-white tracking-tight">Vidéos</h3>
      </div>

      {videos.length === 0 ? (
        <ArtisteSectionEmptyState icon="videocam_off" message="Aucune vidéo disponible pour le moment." />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            {visible.map((video) => (
              <Link
                key={video.id}
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-black/30"
              >
                {video.thumbnail && (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 1024px) 33vw, 300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-white text-3xl drop-shadow-lg">play_circle</span>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <h4 className="text-white text-xs font-bold leading-snug line-clamp-2">{video.title}</h4>
                </div>
              </Link>
            ))}
          </div>
          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="self-center px-6 h-10 rounded-xl border border-white/10 text-xs font-bold text-[#8A8178] hover:text-white hover:bg-white/5 transition-colors"
            >
              Voir plus
            </button>
          )}
        </>
      )}
    </section>
  );
}
