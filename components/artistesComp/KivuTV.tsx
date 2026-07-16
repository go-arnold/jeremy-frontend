import Link from "next/link";
import type { VideoItem } from "@/types/artistes";

interface Props {
  videos: VideoItem[];
}

export default function KivuTV({ videos }: Props) {
  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex flex-col">
          <h3 className="font-display text-xl font-bold text-white tracking-tight">
            Art du Kivu TV
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            Vidéos officielles &amp; sets en direct
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pb-4 pl-5">
        <div className="flex gap-4 pr-5 min-w-max">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoCard({ video }: { video: VideoItem }) {
  return (
    <Link href={video.href} className="flex flex-col gap-3 w-64 group cursor-pointer" target="_blank" rel="noopener noreferrer">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${video.thumbnail}')` }}
        />
        {/* Overlay play */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </div>
        </div>
        {/* Durée */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold text-white">
          {video.duration}
        </div>
      </div>

      {/* Texte */}
      <div>
        <h4 className="text-white font-display font-bold text-base leading-tight">
          {video.title}
        </h4>
        <p className="text-gray-500 text-sm mt-1">
          {video.views} • {video.publishedAt}
        </p>
      </div>
    </Link>
  );
}
