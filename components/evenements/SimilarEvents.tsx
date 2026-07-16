import Link from "next/link";
import type { EventCard } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";

interface Props {
  events?: EventCard[]; // optionnel — sécurisé contre undefined
}

export default function SimilarEvents({ events = [] }: Props) {
  if (!events.length) return null;

  return (
    <section className="px-4 mt-6">
      <h2 className="text-lg font-bold mb-3">Événements similaires</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar">
        {events.map((event) => (
          <Link key={event.id} href={`/evenements/${event.slug}`} className="w-40 shrink-0">
            <ContentImage
              src={event.image}
              alt={event.title}
              className="h-40 rounded-xl"
            />
            <p className="text-sm font-bold text-white mt-2">{event.title}</p>
            <p className="text-xs text-slate-400">{event.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
