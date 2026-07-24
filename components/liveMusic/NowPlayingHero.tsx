"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { NowPlaying } from "@/types/liveMusic";
import { useAudioLiveStream } from "@/hooks/useAudioLiveStream";
import { useConsumptionHeartbeat } from "@/hooks/useConsumptionHeartbeat";
import { useLiveLoadingMessages } from "@/hooks/useLiveLoadingMessages";

interface NowPlayingHeroState {
  track: NowPlaying;
  audioRef: ReturnType<typeof useAudioLiveStream>["audioRef"];
  isLoading: boolean;
  hasError: boolean;
  isPlaying: boolean;
  loadingMessage: string;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  retry: () => void;
}

const NowPlayingHeroContext = createContext<NowPlayingHeroState | null>(null);

function useNowPlayingHeroState(): NowPlayingHeroState {
  const ctx = useContext(NowPlayingHeroContext);
  if (!ctx) throw new Error("NowPlayingHero must be rendered inside a NowPlayingHeroProvider");
  return ctx;
}

/**
 * Owns the single HLS stream/audio element for the live-music page — mount this ONCE, wrapping
 * both the mobile and desktop layout blocks. Previously `app/live-music/page.tsx` mounted
 * `<NowPlayingHero>` twice (once inside a `lg:hidden` block, once inside a `hidden lg:block`
 * block), each instance independently calling `useAudioLiveStream` — two `<audio>` elements and
 * two parallel HLS connections regardless of breakpoint. `NowPlayingHero` below is now a pure
 * presentational reader of this context, safe to render as many times as there are visual slots
 * without ever creating a second stream — same pattern as LivePlayerProvider/LivePlayer in
 * components/radio-en-direct/LivePlayer.tsx.
 */
export function NowPlayingHeroProvider({ track, children }: { track: NowPlaying; children: ReactNode }) {
  const { audioRef, isLoading, hasError, isPlaying, togglePlay, setVolume, retry } = useAudioLiveStream(
    track.hlsUrl,
    track.isLive
  );
  useConsumptionHeartbeat(isPlaying, "live_music", track.numericId, track.title, track.coverImage);
  const loadingMessage = useLiveLoadingMessages(isLoading && !hasError);

  return (
    <NowPlayingHeroContext.Provider
      value={{ track, audioRef, isLoading, hasError, isPlaying, loadingMessage, togglePlay, setVolume, retry }}
    >
      <audio ref={audioRef} />
      {children}
    </NowPlayingHeroContext.Provider>
  );
}

export default function NowPlayingHero() {
  const { track, isLoading, hasError, isPlaying, loadingMessage, togglePlay, setVolume, retry } =
    useNowPlayingHeroState();

  return (
    <section className="w-full px-6 lg:px-0 z-10 flex flex-col items-center lg:gap-6">
      {/* Live badge */}
      <div className="flex items-center gap-2 mb-6 lg:mb-0 bg-black/40 border border-primary/30 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-[0_0_15px_rgba(230,48,18,0.2)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="text-primary text-[11px] font-bold tracking-widest uppercase">En direct</span>
      </div>

      {/* Cover art — plus grand sur desktop */}
      <div className="relative w-full aspect-square max-w-[320px] lg:max-w-none mb-8 lg:mb-0 group">
        <div className="absolute inset-0 border border-white/10 rounded-[2rem] rotate-6 scale-95 transition-transform duration-700 group-hover:rotate-12 bg-[#181012]" />
        <div className="absolute inset-0 border border-primary/20 rounded-[2rem] -rotate-3 scale-95 transition-transform duration-700 group-hover:-rotate-6 bg-[#181012]" />
        <div
          className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
          style={{ boxShadow: "0 0 40px rgba(230,48,18,0.15), 0 25px 60px rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ backgroundImage: `url('${track.coverImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Waveform bars — decorative, doesn't represent the real audio signal */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-end gap-1.5 h-12 px-8">
            {[
              { dur: "0.8s", delay: "0s" },
              { dur: "1.1s", delay: "0.1s" },
              { dur: "1.3s", delay: "0.2s" },
              { dur: "0.9s", delay: "0.3s" },
              { dur: "1.2s", delay: "0.4s" },
              { dur: "0.8s", delay: "0.5s" },
            ].map((bar, i) => (
              <div
                key={i}
                className="w-1.5 bg-primary rounded-t-sm animate-[bar-bounce_0.8s_ease-in-out_infinite]"
                style={{
                  animationDuration: bar.dur,
                  animationDelay: bar.delay,
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Track info */}
      <div className="text-center w-full mb-8 lg:mb-0">
        <h2 className="text-3xl lg:text-2xl font-extrabold text-white mb-2 lg:mb-1 leading-tight tracking-tight">
          {track.title}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-text-secondary text-lg lg:text-base font-medium">avec</span>
          <span className="text-white text-lg lg:text-base font-bold bg-white/10 px-2 py-0.5 rounded-md">
            {track.djName}
          </span>
        </div>
      </div>

      {/* Player controls */}
      <div className="flex flex-col items-center gap-4 lg:gap-6 w-full max-w-[280px] lg:max-w-none mb-10 lg:mb-0">
        {hasError ? (
          <button onClick={retry} className="text-primary text-sm font-bold underline">
            Réessayer
          </button>
        ) : (
          <button
            onClick={togglePlay}
            disabled={isLoading || !track.hlsUrl}
            className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white hover:scale-105 active:scale-95 transition-all duration-300 group disabled:opacity-50"
            style={{ boxShadow: "0 0 30px rgba(230,48,18,0.4)" }}
          >
            <div className="absolute inset-0 rounded-full border border-white/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
            {isLoading ? (
              <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span
                className="material-symbols-outlined text-[48px]"
                style={{ fontVariationSettings: "'FILL' 1", marginLeft: isPlaying ? "0" : "4px" }}
              >
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            )}
          </button>
        )}

        {isLoading && !hasError && (
          <p className="text-text-muted text-sm font-medium">{loadingMessage}</p>
        )}

        <div className="flex items-center gap-3 w-full px-2">
          <span className="material-symbols-outlined text-text-secondary text-sm">volume_down</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-primary bg-white/10"
          />
          <span className="material-symbols-outlined text-text-secondary text-sm">volume_up</span>
        </div>
      </div>
    </section>
  );
}
