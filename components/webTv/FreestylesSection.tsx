import Image from "next/image";
import Link from "next/link";
import type { FreestyleVideo, FreestyleAspect } from "@/types/webtv";

interface Props {
  videos: FreestyleVideo[];
}

const ASPECT_CLASS: Record<FreestyleAspect, string> = {
  "3/4": "aspect-[3/4]",
  square: "aspect-square",
  "9/16": "aspect-[9/16]",
};

export default function FreestylesSection({ videos }: Props) {
  return (
    <section className="flex flex-col gap-4 px-4 lg:px-0">
      {/* Header — mobile */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-accent-pink text-lg">mic_external_on</span>
          <h2 className="text-white text-base font-bold tracking-tight">Freestyles</h2>
        </div>
        <a className="text-primary text-xs font-bold" href="/freestyles">
          Voir tout
        </a>
      </div>

      {/* Header — desktop */}
      <div className="hidden lg:flex items-center gap-3">
        <span className="material-symbols-outlined text-accent-pink">mic_external_on</span>
        <h2 className="text-white text-xl font-bold tracking-tight">Freestyles</h2>
        <div className="kivu-divider flex-1" />
        <a className="text-primary text-xs font-bold hover:text-[#F0EDE8] transition-colors" href="/freestyles">
          Voir tout
        </a>
      </div>

      <div className="columns-2 lg:columns-4 gap-4 space-y-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={video.href || "#"}
            className={`relative break-inside-avoid rounded-xl overflow-hidden bg-surface-dark group ring-1 ring-white/5 cursor-pointer block w-full ${ASPECT_CLASS[video.aspect]}`}
          >
            {/* "New" badge */}
            {video.isNew && (
              <div className="absolute top-2 left-2 z-10 bg-accent-pink text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                New
              </div>
            )}

            <Image
              alt={video.imageAlt}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              src={video.imageUrl}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-0 left-0 w-full p-2 lg:p-3">
              <h4 className="text-white text-xs lg:text-sm font-bold leading-snug line-clamp-1">{video.title}</h4>
              <p className="text-gray-400 text-[9px] lg:text-[10px]">{video.author}</p>
            </div>

            {/* Play — toujours visible (icône obligatoire sur chaque vidéo) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-8 lg:w-12 lg:h-12 rounded-full bg-primary/80 flex items-center justify-center text-white backdrop-blur lg:shadow-lg">
                <span className="material-symbols-outlined text-base lg:text-2xl">play_arrow</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
