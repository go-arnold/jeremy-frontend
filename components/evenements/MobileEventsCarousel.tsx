"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EventGridItem } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";
import EmptyState from "@/components/ui/EmptyState";

function chunkPairs<T>(items: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) pairs.push(items.slice(i, i + 2));
  return pairs;
}

/** Default "Prochainement" preview on mobile — pairs of events on a single row, auto-advancing
 * every few seconds when there's more than one pair (same carousel pattern as the Communauté
 * défis sidebar). Replaced by the full `UpcomingEventsGrid` once the user expands or filters. */
export default function MobileEventsCarousel({ events }: { events: EventGridItem[] }) {
  const pairs = chunkPairs(events);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const safeIndex = pairs.length > 0 ? activeIndex % pairs.length : 0;

  useEffect(() => {
    if (pairs.length <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % pairs.length);
    }, 4500);
    return () => clearInterval(id);
  }, [pairs.length]);

  useEffect(() => {
    const child = scrollRef.current?.children[safeIndex] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }, [safeIndex]);

  if (events.length === 0) {
    return (
      <EmptyState
        message="Aucun événement à venir"
        description="Revenez bientôt pour de nouveaux événements."
        icon="event_busy"
      />
    );
  }

  return (
    <div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1">
        {pairs.map((pair, i) => (
          <div key={i} className="min-w-full snap-center grid grid-cols-2 gap-3">
            {pair.map((event) => (
              <EventMiniCard key={event.id} event={event} />
            ))}
          </div>
        ))}
      </div>
      {pairs.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {pairs.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === safeIndex ? "w-4 bg-primary" : "w-1.5 bg-white/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventMiniCard({ event }: { event: EventGridItem }) {
  return (
    <Link href={`/evenements/${event.slug}`} className="flex flex-col gap-1.5 group">
      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-surface-dark">
        <ContentImage
          src={event.image}
          alt={event.title}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-1.5 right-1.5 bg-[#12223ce6] backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-bold text-white uppercase tracking-wide border border-white/10">
          {event.category}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between text-[10px] text-primary font-medium uppercase tracking-wide">
          <span>{event.dateLabel}</span>
          <span>{event.city}</span>
        </div>
        <h3 className="text-xs font-bold text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>
      </div>
    </Link>
  );
}
