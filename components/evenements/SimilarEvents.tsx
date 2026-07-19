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
      <h2 className="text-base font-bold mb-2.5">Événements similaires</h2>
      <div className="flex gap-3.5 overflow-x-auto hide-scrollbar">
        {events.map((event) => (
          <Link key={event.id} href={`/evenements/${event.slug}`} className="w-36 shrink-0">
            <ContentImage
              src={event.image}
              alt={event.title}
              className="h-36 rounded-xl"
            />
            <p className="text-xs font-bold text-white mt-2">{event.title}</p>
            <p className="text-[10px] text-slate-400">{event.date}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
