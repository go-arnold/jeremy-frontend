import Link from "next/link";
import type { PodcastListItem } from "@/types/podcasts";
import ContentImage from "@/components/ui/ContentImage";

// The image only ever carries the "Nouveau" badge — title/duration/guest/button used to be
// overlaid on a gradient over the photo, which made both the image and the text harder to read
// depending on what the cover photo looked like. Keeping them in a plain text block below the
// (modestly sized) image guarantees legibility regardless of the artwork.
export default function FeaturedEpisodeCard({ episode }: { episode: PodcastListItem }) {
  return (
    <section className="px-4 pt-2">
      <h2 className="text-white text-base font-extrabold leading-tight tracking-[-0.015em] mb-3">
        À la une
      </h2>
      <Link href={`/podcasts/${episode.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
          <ContentImage
            src={episode.image}
            alt={episode.title}
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-1 bg-primary text-[9px] font-black text-white rounded-md tracking-wider uppercase">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
            </span>
            Nouveau
          </span>
        </div>

        <div className="pt-3 flex flex-col gap-2">
          <h3 className="text-white text-sm font-bold leading-snug truncate">{episode.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#8A8178]">
              <span className="material-symbols-outlined text-sm">schedule</span>
              <span className="text-xs">{episode.duration}</span>
            </div>
            <span className="bg-white text-black px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              Écouter
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
