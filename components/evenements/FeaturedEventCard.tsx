"use client";
import { useState } from "react";
import Link from "next/link";
import type { FeaturedEvent } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";
import ShareMenu from "@/components/ui/ShareMenu";
import { resolveShareUrl } from "@/lib/share";

export default function FeaturedEventCard({ event }: { event: FeaturedEvent }) {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const shareUrl = `/evenements/${event.slug}`;

  const handleShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Découvrez ${event.title} sur Art du Kivu`,
          url: resolveShareUrl(shareUrl),
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        // fall through to the manual menu on any other native-share failure
      }
    }
    setShareMenuOpen(true);
  };

  return (
    <section>
      {/* Label "En Vedette" */}
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-primary">
          En Vedette
        </h2>
      </div>

      <Link href={`/evenements/${event.slug}`} className="block">
        <div className="group relative w-full aspect-[4/5] sm:aspect-video rounded-2xl overflow-hidden shadow-2xl bg-surface-dark">

          <ContentImage
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#12223ce6]/60 to-transparent" />

          {/* Badge date */}
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 flex flex-col items-center justify-center text-center min-w-[3.5rem]">
            <span className="text-xs font-bold text-primary uppercase">
              {event.dateShort?.month || "—"}
            </span>
            <span className="text-xl font-black text-white leading-none">
              {event.dateShort?.day || "—"}
            </span>
          </div>

          {/* Partager */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleShare();
            }}
            className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">share</span>
          </button>

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-xs font-medium">{event.location}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-white leading-tight sm:leading-none tracking-tight mb-2 break-words">
                {event.title}
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 leading-relaxed max-w-[90%]">
                {event.description}
              </p>
            </div>

            {/* CTA — stoppe la propagation du Link parent */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all w-full sm:w-auto justify-center shadow-[0_4px_14px_rgba(41,163,163,0.4)]"
            >
              <span>Voir Détails</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>

      <ShareMenu
        open={shareMenuOpen}
        onClose={() => setShareMenuOpen(false)}
        url={shareUrl}
        text={`Découvrez ${event.title} sur Art du Kivu`}
      />
    </section>
  );
}
