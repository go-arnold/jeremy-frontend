import type { EventVenue as IEventVenue } from "@/types/evenements";
import ContentImage from "@/components/ui/ContentImage";

export default function EventVenue({ venue }: { venue: IEventVenue }) {
  return (
    <section className="px-4 mt-6">
      <h2 className="text-base font-bold mb-2.5">Lieu</h2>
      <div className="rounded-xl overflow-hidden border border-white/5 bg-surface-dark">
        <ContentImage src={venue.image} alt={venue.name} className="h-36" />
        <div className="p-3.5 bg-[#12223ce6]">
          <p className="text-xs text-white font-bold">{venue.name}</p>
          <p className="text-[11px] text-slate-400">{venue.address}</p>
        </div>
      </div>
    </section>
  );
}
