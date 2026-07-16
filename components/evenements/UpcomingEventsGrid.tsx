import Link from "next/link";
import type { EventGridItem } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";

export default function UpcomingEventsGrid({ events }: { events: EventGridItem[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Prochainement</h2>
        <a className="text-sm font-medium text-primary hover:text-primary/80" href="#">
          Voir tout
        </a>
      </div>

      {/* Grille masonry 2 colonnes CSS */}
      <div className="columns-2 gap-4 space-y-4">
        {events.map((event) => (
          <EventGridCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}

function EventGridCard({ event }: { event: EventGridItem }) {
  return (
    <Link
      href={`/evenements/${event.slug}`}
      className="masonry-item relative group cursor-pointer block break-inside-avoid"
    >
      {/* Image avec aspect ratio variable selon la carte */}
      <div
        className={`relative w-full ${event.aspectRatio} rounded-xl overflow-hidden mb-3 bg-surface-dark`}
      >
        <ContentImage
          src={event.image}
          alt={event.title}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge catégorie */}
        <div className="absolute top-2 right-2 bg-[#12223ce6] backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10">
          {event.category}
        </div>
      </div>

      {/* Infos texte */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs text-primary font-medium uppercase tracking-wide">
          <span>{event.dateLabel}</span>
          <span>{event.city}</span>
        </div>
        <h3 className="text-base font-bold text-white leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500">{event.venue}</p>
      </div>
    </Link>
  );
}
