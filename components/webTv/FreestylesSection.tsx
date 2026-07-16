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
    <section className="px-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-accent-pink">mic_external_on</span>
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Freestyles</h2>
      </div>

      <div className="columns-2 gap-4 space-y-4">
        {videos.map((video) => (
          <Link
            key={video.id}
            href={video.href || "#"}
            className="relative break-inside-avoid rounded-xl overflow-hidden bg-surface-dark group ring-1 ring-white/5"
          >
            {/* "New" badge */}
            {video.isNew && (
              <div className="absolute top-2 left-2 z-10 bg-accent-pink text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                New
              </div>
            )}

            <img
              alt={video.imageAlt}
              className={`w-full ${ASPECT_CLASS[video.aspect]} object-cover group-hover:scale-105 transition-transform duration-500`}
              src={video.imageUrl}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

            <div className="absolute bottom-0 left-0 w-full p-3">
              <h4 className="text-white text-sm font-bold leading-snug">{video.title}</h4>
              <p className="text-gray-400 text-[10px]">{video.author}</p>
            </div>

            {/* Hover play button */}
            {video.showPlayButton && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="size-10 rounded-full bg-primary/80 flex items-center justify-center text-white backdrop-blur">
                  <span className="material-symbols-outlined text-xl">play_arrow</span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
