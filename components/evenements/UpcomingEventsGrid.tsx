import Link from "next/link";
import type { EventGridItem } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  events: EventGridItem[];
  /** Shown under the empty state so the user has a way back to the unfiltered list. */
  onClearFilters?: () => void;
}

// Pure grid + empty state — the "Prochainement" header (title, "Voir plus"/"Voir tout" action)
// lives in EventsPageClient.tsx now, shared between the compact carousel and this expanded view
// instead of being duplicated here.
export default function UpcomingEventsGrid({ events, onClearFilters }: Props) {
  if (events.length === 0) {
    return (
      <EmptyState
        message="Aucun événement dans ce filtre"
        description="Essayez une autre ville ou un autre mois."
        icon="event_busy"
      >
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-2 text-primary text-sm font-bold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        )}
      </EmptyState>
    );
  }

  return (
    <div className="columns-2 gap-4 space-y-4">
      {events.map((event) => (
        <EventGridCard key={event.id} event={event} />
      ))}
    </div>
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
        className={`relative w-full ${event.aspectRatio} rounded-xl overflow-hidden mb-2.5 bg-surface-dark`}
      >
        <ContentImage
          src={event.image}
          alt={event.title}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        {/* Badge catégorie */}
        <div className="absolute top-2 right-2 bg-[#12223ce6] backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-wider border border-white/10">
          {event.category}
        </div>
      </div>

      {/* Infos texte */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[11px] text-primary font-medium uppercase tracking-wide">
          <span>{event.dateLabel}</span>
          <span>{event.city}</span>
        </div>
        <h3 className="text-sm font-bold text-white leading-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>
        <p className="text-[11px] text-gray-500">{event.venue}</p>
      </div>
    </Link>
  );
}
