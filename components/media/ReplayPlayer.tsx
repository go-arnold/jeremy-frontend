"use client";

import ContentImage from "@/components/ui/ContentImage";
import AudioPlayer from "@/components/media/AudioPlayer";
import EmptyState from "@/components/ui/EmptyState";

interface Props {
  title: string;
  host: string;
  coverImage: string;
  audioUrl: string;
  dayName?: string;
  endTime?: string;
}

/** Shown instead of the live player (radio's LivePlayer, live-music's NowPlayingHero) when
 * nothing is currently live but a program/session has just ended — the most-recently-live one
 * (see pickFeaturedByWeeklySchedule/pickFeaturedByTimestamp in lib/mappers.ts) is featured here
 * with its recording, mirroring the "Rediffusion audio" pattern already used on the emissions
 * detail page. `dayName`/`endTime` are radio-only (weekly recurring schedule) — omit them for
 * live-music's absolute-timestamp sessions, the fallback caption still reads fine. */
export default function ReplayPlayer({ title, host, coverImage, audioUrl, dayName, endTime }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
        <ContentImage src={coverImage} alt={title} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
          <span className="material-symbols-outlined text-primary text-sm">headphones</span>
          <span className="text-white text-[10px] font-black uppercase tracking-widest">
            Rediffusion
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
            {dayName && endTime ? `Terminé ${dayName} à ${endTime.slice(0, 5)}` : "Dernier programme diffusé"}
          </p>
          <h2 className="text-white text-2xl lg:text-3xl font-black leading-tight">{title}</h2>
          <p className="text-white/70 text-sm mt-1">{host}</p>
        </div>
      </div>

      {audioUrl ? (
        <AudioPlayer src={audioUrl} title={title} artist={host} thumbnail={coverImage} />
      ) : (
        <EmptyState
          icon="mic_off"
          message="Rediffusion pas encore disponible"
          description="L'enregistrement de ce programme est en cours de traitement — revenez un peu plus tard."
        />
      )}
    </div>
  );
}
