import type { PremierVideo } from "@/types/webtv";
import { useState } from "react";
import Link from "next/link";
import LiveStreamPlayer from "@/components/media/LiveStreamPlayer";
import VideoPlayer from "@/components/media/VideoPlayer";
import { shareContent } from "@/lib/share";

export default function PremierSection({ video }: { video: PremierVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = () => {
    shareContent({ title: video.title, url: video.href || "/web-tv" }).catch(() => {});
  };

  return (
    <section className="flex flex-col px-4 pt-6 gap-4">
      <div className="group relative w-full aspect-[4/3] mt-16 overflow-hidden rounded-xl bg-surface-dark shadow-lg ring-1 ring-white/10">
        {isPlaying ? (
          <div className="absolute inset-0 z-50 bg-black">
            {video.isLive ? (
              <LiveStreamPlayer
                hlsUrl={video.playbackHlsUrl || ""}
                title={video.title}
                status="live"
                thumbnail={video.imageUrl}
              />
            ) : (
              <VideoPlayer
                src={video.videoUrl || ""}
                title={video.title}
                thumbnail={video.imageUrl}
                autoplay
              />
            )}
            <button 
              onClick={() => setIsPlaying(false)}
              className="absolute top-4 right-4 z-[60] bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ) : (
          <>
            {/* Badge EN DIRECT — clairement visible (pastille animée, même traitement que desktop) */}
            {video.isLive && (
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-primary text-white text-[11px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                {video.liveTag}
              </div>
            )}

            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              data-alt={video.imageAlt}
              style={{ backgroundImage: `url('${video.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 pointer-events-none" />

            {/* Play — toujours visible (icône obligatoire, pas seulement au survol) */}
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-[0_0_20px_rgba(20,156,184,0.5)] backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined" style={{ fontSize: "36px", marginLeft: "4px" }}>
                  play_arrow
                </span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 w-full p-5 flex items-end justify-between gap-2 pointer-events-none">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                  Exclusive{video.location ? ` • ${video.location}` : ""}
                </p>
                <Link href={video.href || "/web-tv"} className="pointer-events-auto w-fit">
                  <h3 className="text-white text-2xl font-bold leading-tight hover:underline">{video.title}</h3>
                </Link>
                <p className="text-gray-300 text-sm font-medium line-clamp-1">{video.subtitle}</p>
              </div>
              <button
                onClick={handleShare}
                className="pointer-events-auto flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
