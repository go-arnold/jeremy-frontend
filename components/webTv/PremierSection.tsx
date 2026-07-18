import type { PremierVideo } from "@/types/webtv";
import { useState } from "react";
import Link from "next/link";
import LiveStreamPlayer from "@/components/media/LiveStreamPlayer";
import VideoPlayer from "@/components/media/VideoPlayer";
import { shareContent } from "@/lib/share";

interface PremierSectionProps {
  video: PremierVideo;
  variant?: "mobile" | "desktop";
}

export default function PremierSection({ video, variant = "mobile" }: PremierSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = () => {
    shareContent({ title: video.title, url: video.href || "/web-tv" }).catch(() => {});
  };

  const player = isPlaying ? (
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
  ) : null;

  if (variant === "desktop") {
    return (
      <section className="flex flex-col gap-4">
        {/* Label section */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">À l'affiche</span>
          <div className="kivu-divider flex-1" />
        </div>

        <div className="group relative w-full aspect-video overflow-hidden rounded-2xl bg-surface-dark shadow-2xl ring-1 ring-white/10">
          {isPlaying ? (
            player
          ) : (
            <>
              {/* Live badge */}
              {video.isLive && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-[#E63012] text-white text-[11px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-lg">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                  </span>
                  {video.liveTag}
                </div>
              )}

              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 cursor-pointer"
                style={{ backgroundImage: `url('${video.imageUrl}')` }}
                onClick={() => setIsPlaying(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />

              {/* Play — toujours visible (icône obligatoire, pas seulement au survol) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex w-20 h-20 items-center justify-center rounded-full bg-primary/90 text-white shadow-[0_0_40px_rgba(230,48,18,0.5)] backdrop-blur-sm transform group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontSize: "44px", marginLeft: "5px" }}>
                    play_arrow
                  </span>
                </div>
              </div>

              {/* Infos bas */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-2 pointer-events-none">
                <p className="text-primary text-xs font-bold uppercase tracking-wider">
                  Exclusive{video.location ? ` • ${video.location}` : ""}
                </p>
                <Link href={video.href || "/web-tv"} className="pointer-events-auto w-fit">
                  <h3 className="text-white text-3xl xl:text-4xl font-black leading-tight max-w-2xl hover:underline">
                    {video.title}
                  </h3>
                </Link>
                <p className="text-gray-300 text-base font-medium">{video.subtitle}</p>

                {/* Actions */}
                <div className="flex gap-3 mt-3 pointer-events-auto">
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-[#B8240C] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                    Regarder
                  </button>
                  <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-xl font-bold text-sm backdrop-blur-sm transition-all border border-white/10">
                    <span className="material-symbols-outlined text-lg">add</span>
                    Ma liste
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all border border-white/10"
                  >
                    <span className="material-symbols-outlined text-lg">share</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col px-4 pt-6 gap-4">
      <div className="group relative w-full aspect-[4/3] mt-16 overflow-hidden rounded-xl bg-surface-dark shadow-lg ring-1 ring-white/10">
        {isPlaying ? (
          player
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
