"use client";

import type { LiveShow } from "@/types/radio";
import LiveChat from "./LiveChat";
import { useAudioLiveStream } from "@/hooks/useAudioLiveStream";
import { useConsumptionHeartbeat } from "@/hooks/useConsumptionHeartbeat";
import { shareContent } from "@/lib/share";

interface Props {
  show: LiveShow;
  /** The page mounts one variant or the other behind a `lg:` breakpoint (see
   * app/radio-en-direct/page.tsx) rather than toggling visibility on a single instance, because
   * the desktop layout is a grid cell sized against a sidebar — it can't just be a CSS-hidden
   * sibling of the mobile markup without breaking that grid sizing. Both variants therefore still
   * run their own useAudioLiveStream/useConsumptionHeartbeat (pre-existing behavior, unchanged);
   * merging into one file removes the duplicated JSX/logic source, not the dual mount. */
  variant?: "mobile" | "desktop";
}

export default function LivePlayer({ show, variant = "mobile" }: Props) {
  const { audioRef, isLoading, hasError, isPlaying, togglePlay, setVolume, retry } = useAudioLiveStream(
    show.hlsUrl,
    show.isPlaying
  );
  useConsumptionHeartbeat(isPlaying, "radio", show.numericId, show.title, show.imageUrl);

  const handleShare = () => {
    shareContent({ title: show.title, url: "/radio-en-direct" }).catch(() => {});
  };

  if (variant === "desktop") {
    return (
      <div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl group"
        style={{ minHeight: "600px" }}
      >
        <audio ref={audioRef} />

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${show.imageUrl}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12223c] via-[#12223c]/60 to-transparent" />
        {/* Gradient latéral gauche pour le texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12223c]/80 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-6 left-6 z-10 flex gap-3 items-center">
          <div className="flex h-9 items-center gap-2 rounded-xl bg-[#E63012] px-4 shadow-lg shadow-[#E63012]/30">
            <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
            <p className="text-[11px] font-black tracking-widest uppercase text-white">EN DIRECT</p>
          </div>
          <div className="flex h-9 items-center gap-2 px-3 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10">
            <span className="material-symbols-outlined text-white text-sm">group</span>
            <p className="text-white text-sm font-bold">{show.listenerCount}</p>
          </div>
        </div>

        {/* Contenu bas */}
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-6">
          {/* Info émission */}
          <div>
            <p className="text-[#E63012] text-xs font-bold uppercase tracking-widest mb-2">On Air Now</p>
            <h2 className="text-white text-4xl xl:text-5xl font-black leading-tight tracking-tight">
              {show.title}
            </h2>
            <p className="text-[#F0EDE8]/70 text-xl font-medium mt-1">{show.host}</p>
          </div>

          {/* Contrôles player */}
          <div className="flex items-center gap-6">
            {/* Bouton play */}
            <button
              onClick={togglePlay}
              disabled={isLoading || hasError || !show.hlsUrl}
              className="flex shrink-0 items-center justify-center rounded-full w-20 h-20 bg-[#E63012] text-white shadow-xl shadow-[#E63012]/30 hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? (
                <span className="w-7 h-7 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span
                  className="material-symbols-outlined !text-5xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              )}
            </button>

            {/* Statut + waveform */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-white text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                  {hasError ? (
                    <>
                      <span className="text-[#E63012]">Flux indisponible</span>
                      <button onClick={retry} className="text-white/70 underline normal-case font-semibold">
                        Réessayer
                      </button>
                    </>
                  ) : isLoading ? (
                    "Connexion..."
                  ) : (
                    "Flux en direct"
                  )}
                </p>
                {/* Waveform animée */}
                <div className="flex gap-1 items-end h-5">
                  {[0.1, 0.2, 0.3, 0.4, 0.5, 0.15, 0.35].map((delay, i) => (
                    <div
                      key={i}
                      className="w-1 bg-[#E63012] rounded-full animate-bounce"
                      style={{
                        height: `${[12, 18, 10, 20, 14, 16, 8][i]}px`,
                        animationDelay: `${delay}s`,
                        animationPlayState: isPlaying ? "running" : "paused",
                      }}
                    />
                  ))}
                </div>
              </div>
              {/* Volume */}
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white/40 text-sm">volume_down</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="1"
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-[#E63012]"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                />
                <span className="material-symbols-outlined text-white/40 text-sm">volume_up</span>
              </div>
            </div>

            {/* Actions secondaires */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleShare}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="px-4 mb-2">
      <audio ref={audioRef} />

      <div className= "text-[#ffffff] font-black text-xl uppercase py-4 tracking-wider">
        <h1> RADIO EN DIRECT</h1>
      </div>

      {/* ── Cover 16:9 ── */}
      <div
        className="relative w-full rounded-2xl overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >

        {/* Image fond */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-alt={show.imageAlt}
          style={{ backgroundImage: `url('${show.imageUrl}')` }}
        />

        {/* Gradients : haut léger + bas fort */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/90" />

        {/* ── Badges EN DIRECT + auditeurs — haut gauche ── */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(230,48,18,0.90)",
              boxShadow: "0 0 14px rgba(230,48,18,0.45)",
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <p className="text-white text-[10px] font-extrabold leading-normal tracking-wider uppercase">
              EN DIRECT
            </p>
          </div>

          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: "#00000073" }}
          >
            <span
              className="material-symbols-outlined text-white/70"
              style={{ fontSize: "13px" }}
            >
              group
            </span>
            <p className="text-white/80 text-[10px] font-bold">{show.listenerCount}</p>
          </div>
        </div>

        {/* ── Actions haut droite ── */}
        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <button
            onClick={handleShare}
            className="size-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
          >
            <span className="material-symbols-outlined text-white" style={{ fontSize: "18px" }}>
              share
            </span>
          </button>
        </div>

        {/* ── Waveform animée — bas centre (décoratif, ne prétend pas représenter le flux réel) ── */}
        <div className="absolute bottom-[50px] left-0 right-0 flex justify-center items-end gap-[3px] h-7 pointer-events-none">
          {[0.85, 1.1, 0.65, 1.3, 0.9, 1.4, 0.7, 1.05, 0.8, 1.2, 0.6, 1.1, 0.9].map((dur, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full animate-bounce"
              style={{
                background: "rgba(255,255,255,0.5)",
                animationDuration: `${dur}s`,
                animationDelay: `${i * 0.07}s`,
                height: `${10 + Math.sin(i * 0.9) * 8}px`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            />
          ))}
        </div>

        {/* ── Titre + host — bas overlay ── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
          <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-0.5">
            On Air Now
          </p>
          <h1
            className="text-white text-xl font-extrabold leading-tight tracking-tight"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
          >
            {show.title}
          </h1>
          <p className="text-slate-300 text-sm font-medium opacity-90 mt-0.5">{show.host}</p>
        </div>
      </div>

      {/* ── Bloc contrôles — attaché sous la cover ── */}
      <div
        className="rounded-b-2xl px-5 pt-4 pb-4"
        style={{
          background: "rgba(18,34,60,0.92)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderTop: "none",
          marginTop: "-1px",
        }}
      >
        {/* Statut du flux (pas de barre de progression — un direct n'a pas de position/durée) */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
            {hasError ? (
              <span className="text-primary">Flux indisponible</span>
            ) : isLoading ? (
              "Connexion..."
            ) : (
              "Flux en direct"
            )}
          </p>
          {hasError && (
            <button onClick={retry} className="text-primary text-[10px] font-bold underline">
              Réessayer
            </button>
          )}
        </div>

        {/* Contrôle principal */}
        <div className="flex items-center justify-center mb-4">
          <button
            onClick={togglePlay}
            disabled={isLoading || hasError || !show.hlsUrl}
            className="flex shrink-0 items-center justify-center rounded-full size-16 bg-primary text-white shadow-xl transform active:scale-95 transition-transform disabled:opacity-50"
            style={{
              boxShadow: isPlaying
                ? "0 0 0 0 rgba(230,48,18,0.5), 0 4px 20px rgba(230,48,18,0.4)"
                : "0 4px 16px rgba(230,48,18,0.3)",
              animation: isPlaying ? "pulse-ring 2s ease-out infinite" : "none",
            }}
          >
            {isLoading ? (
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span
                className="material-symbols-outlined !text-4xl"
                style={{
                  fontVariationSettings: "'FILL' 1",
                  marginLeft: isPlaying ? "0" : "2px",
                }}
              >
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            )}
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white/35" style={{ fontSize: "17px" }}>
            volume_down
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            defaultValue="1"
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer accent-primary"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <span className="material-symbols-outlined text-white/35" style={{ fontSize: "17px" }}>
            volume_up
          </span>
        </div>
      </div>

      {/* Chat — section séparée sous le player */}
      <div className="mt-5">
        <LiveChat messages={show.messages} />
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(230,48,18,0.55), 0 4px 20px rgba(230,48,18,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(230,48,18,0), 0 4px 20px rgba(230,48,18,0.4); }
          100% { box-shadow: 0 0 0 0 rgba(230,48,18,0), 0 4px 20px rgba(230,48,18,0.4); }
        }
      `}</style>
    </section>
  );
}
