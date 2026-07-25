"use client";

import { useEffect, useRef, useState } from "react";
import type { PremierVideo } from "@/types/webtv";
import PremierSection from "./PremierSection";

interface Props {
  videos: PremierVideo[];
  variant?: "mobile" | "desktop";
}

/** Hero slot for /web-tv: a single live/premier video renders exactly like before (one
 * PremierSection, no carousel chrome). When more than one video is live at once, they're paged
 * through as a snap carousel — same auto-advance + scrollIntoView + dots recipe used for
 * Communauté défis / Événements "Prochainement" / Podcasts "Récents" (see CLAUDE.md). */
export default function LiveVideosCarousel({ videos, variant = "mobile" }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const showCarousel = videos.length > 1;

  useEffect(() => {
    if (!showCarousel) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % videos.length);
    }, 6000);
    return () => clearInterval(id);
  }, [showCarousel, videos.length]);

  useEffect(() => {
    if (!showCarousel) return;
    const child = scrollRef.current?.children[activeIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [activeIndex, showCarousel]);

  if (videos.length === 0) return null;
  if (!showCarousel) return <PremierSection video={videos[0]} variant={variant} />;

  return (
    <div className="flex flex-col gap-3">
      <div ref={scrollRef} className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory">
        {videos.map((video, i) => (
          <div key={video.href || `${video.title}-${i}`} className="min-w-full shrink-0 snap-center">
            <PremierSection video={video} variant={variant} />
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5 px-4 lg:px-0">
        {videos.map((_, i) => (
          <button
            key={i}
            aria-label={`Vidéo en direct ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}
