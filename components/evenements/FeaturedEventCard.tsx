import Link from "next/link";
import type { FeaturedEvent } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";

export default function FeaturedEventCard({ event }: { event: FeaturedEvent }) {
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
              {event.dateShort.month}
            </span>
            <span className="text-xl font-black text-white leading-none">
              {event.dateShort.day}
            </span>
          </div>

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-4">
            <div>
              <div className="flex items-center gap-2 text-gray-300 mb-1">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <span className="text-sm font-medium">{event.location}</span>
              </div>
              <h3 className="text-3xl font-bold text-white leading-none tracking-tight mb-2">
                {event.title}
              </h3>
              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed max-w-[90%]">
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
    </section>
  );
}
