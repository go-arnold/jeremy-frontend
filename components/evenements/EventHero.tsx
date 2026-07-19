import Link from "next/link";
import type { EventDetail } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";

export default function EventHero({ event }: { event: EventDetail }) {
  return (
    <section className="px-4 pt-4">
      <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">

        <ContentImage
          src={event.coverImage}
          alt={event.title}
          className="absolute inset-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131315] via-[#12223ce6]/60 to-transparent" />

        {/* Bouton retour */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            href="/evenements"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/30 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="text-xs font-bold">Événements</span>
          </Link>
        </div>

        {/* Badge date calendrier */}
        <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-2 flex flex-col items-center justify-center text-center min-w-[3.5rem]">
          <span className="text-xs font-bold text-primary uppercase">
            {event.dateShort.month}
          </span>
          <span className="text-xl font-black text-white leading-none">
            {event.dateShort.day}
          </span>
        </div>

        {/* Titre + lieu */}
        <div className="absolute bottom-0 left-0 w-full p-5">
          <div className="flex items-center gap-2 text-gray-300 mb-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-xs font-medium">{event.location}</span>
          </div>
          <h1 className="text-lg font-bold text-white leading-tight mb-2 break-words">
            {event.title}
          </h1>
          <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-2">{event.description}</p>
        </div>

      </div>
    </section>
  );
}
