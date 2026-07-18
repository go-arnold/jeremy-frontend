"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { PodcastEpisode } from "@/types/podcasts";
import { recordEpisodePlay } from "@/lib/services/podcasts";
import { useConsumptionHeartbeat } from "@/hooks/useConsumptionHeartbeat";

/* ────── Helpers ────── */
function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseDuration(str: string): number {
  if (!str) return 0;
  const parts = str.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

/* Number of waveform bars to render */
const BAR_COUNT = 60;

/* Seeded pseudo-random waveform heights (deterministic per episode) */
function generateWaveform(seed: string): number[] {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
  return Array.from({ length: BAR_COUNT }, (_, i) => {
    s = (s * 9301 + 49297) % 233280;
    const base = s / 233280;
    // Envelope: louder in the middle, quieter at the edges
    const envelope = Math.sin((i / BAR_COUNT) * Math.PI);
    return 0.15 + base * 0.75 * (0.4 + envelope * 0.6);
  });
}

/* ────── Main Component ────── */
export default function EpisodePlayer({ episode }: { episode: PodcastEpisode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(() => parseDuration(episode.duration));
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [showSpeed, setShowSpeed] = useState(false);
  const [buffered, setBuffered] = useState(0);
  // Derived from episode data and read during render — belongs in useMemo, not a ref (refs
  // must not be read during render, per react-hooks/refs).
  const waveform = useMemo(
    () => generateWaveform(episode.id || episode.title || "podcast"),
    [episode.id, episode.title]
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  /* ── Audio event handlers ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => {
      if (isFinite(audio.duration) && audio.duration > 0) setDuration(audio.duration);
    };
    const onProgress = () => {
      if (audio.buffered.length > 0) {
        setBuffered((audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100);
      }
    };
    const onEnded = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("progress", onProgress);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("progress", onProgress);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  /* ── Play-count + listening-time tracking ──
   * Nothing in the app called either of these before — play_count never incremented from
   * real listening, and gamification badges could never be earned organically. */
  const episodeKey = episode.slug || episode.id;
  const hasRecordedPlayRef = useRef(false);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !episodeKey) return;

    const onFirstPlay = () => {
      if (hasRecordedPlayRef.current) return;
      hasRecordedPlayRef.current = true;
      recordEpisodePlay(episodeKey).catch(() => {});
    };
    audio.addEventListener("play", onFirstPlay, { once: true });
    return () => audio.removeEventListener("play", onFirstPlay);
  }, [episodeKey]);

  useConsumptionHeartbeat(playing, "podcast", episode.numericId, episode.title, episode.coverImage);

  /* ── Controls ── */
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      try { await audio.play(); } catch (e) { console.warn("Audio play failed:", e); }
    }
  }, [playing]);

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    audio.currentTime = (pct / 100) * audio.duration;
    setCurrentTime(audio.currentTime);
  }, []);

  const skip = useCallback((secs: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + secs));
  }, []);

  const changeSpeed = useCallback((s: number) => {
    if (audioRef.current) audioRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeed(false);
  }, []);

  /* ── Waveform click handler ── */
  const handleWaveformClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  }, [seek]);

  /* ── Waveform drag ── */
  const dragging = useRef(false);
  const handleWaveformMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seek(Math.max(0, Math.min(100, pct)));
  }, [seek]);

  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="mb-8 pt-2 select-none">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* ── Waveform progress bar ── */}
      <div
        className="w-full flex items-end gap-[2px] h-14 mb-1 cursor-pointer group"
        style={{ padding: "4px 0" }}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        onClick={handleWaveformClick}
        onMouseDown={() => { dragging.current = true; }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onMouseMove={handleWaveformMouseMove}
      >
        {waveform.map((h, i) => {
          const barPct = (i / BAR_COUNT) * 100;
          const isPlayed = barPct <= progress;
          const isBuffered = barPct <= buffered;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-75"
              style={{
                height: `${h * 100}%`,
                background: isPlayed
                  ? "linear-gradient(to top, #E63012, #ff6b4a)"
                  : isBuffered
                  ? "rgba(230,48,18,0.25)"
                  : "rgba(255,255,255,0.12)",
                transform: isPlayed
                  ? "scaleY(1.05)"
                  : "scaleY(1)",
                minHeight: "3px",
              }}
            />
          );
        })}
      </div>

      {/* ── Time labels ── */}
      <div className="flex justify-between text-xs text-text-muted font-mono mb-4 px-0.5">
        <span className="text-primary font-semibold">{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center justify-between px-2">

        {/* Speed picker */}
        <div className="relative">
          <button
            onClick={() => setShowSpeed((v) => !v)}
            className="text-text-muted hover:text-white transition flex items-center gap-1"
            aria-label="Vitesse de lecture"
          >
            <span className="material-symbols-outlined text-[26px]">speed</span>
            <span className="text-[11px] font-bold text-primary">{speed}x</span>
          </button>
          {showSpeed && (
            <div className="absolute bottom-10 left-0 bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-xl z-20 min-w-[80px]">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => changeSpeed(s)}
                  className={`w-full text-center py-2 text-sm font-bold transition-colors ${speed === s ? "text-primary bg-primary/10" : "text-white hover:bg-white/5"}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prev 30s / Play / Next 30s */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => skip(-30)}
            className="text-white hover:text-primary transition"
            aria-label="Reculer 30 secondes"
          >
            <span className="material-symbols-outlined text-[32px]">replay_30</span>
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg shadow-primary/30 text-white hover:bg-primary/90 transition transform active:scale-95"
            aria-label={playing ? "Pause" : "Lecture"}
          >
            <span className="material-symbols-outlined text-[36px]">
              {playing ? "pause" : "play_arrow"}
            </span>
          </button>

          <button
            onClick={() => skip(30)}
            className="text-white hover:text-primary transition"
            aria-label="Avancer 30 secondes"
          >
            <span className="material-symbols-outlined text-[32px]">forward_30</span>
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              const newVol = volume > 0 ? 0 : 1;
              if (audioRef.current) audioRef.current.volume = newVol;
              setVolume(newVol);
            }}
            className="text-text-muted hover:text-white transition"
            aria-label="Volume"
          >
            <span className="material-symbols-outlined text-[26px]">
              {volume === 0 ? "volume_off" : volume < 0.5 ? "volume_down" : "volume_up"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
