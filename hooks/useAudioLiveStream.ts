"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type HlsType from "hls.js";

interface HlsErrorData {
  fatal: boolean;
  type: string;
  details: string;
}

/**
 * hls.js wiring for a live AUDIO stream, sharing the exact same credentials fix as
 * `components/media/LiveStreamPlayer.tsx` (the video equivalent) — MediaMTX ties each viewer
 * to a session via a cross-origin cookie that only gets sent with `xhrSetup`'s
 * `withCredentials = true`, paired with nginx reflecting the real request Origin instead of "*".
 *
 * Unlike the video player this only manages the media element + loading/error state — the
 * calling component owns its own play/pause/volume UI and just calls `audioRef`/`retry`.
 */
export function useAudioLiveStream(hlsUrl: string | null | undefined, autoplay = false) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsInstanceRef = useRef<HlsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const load = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !hlsUrl) {
      setIsLoading(false);
      return;
    }
    setHasError(false);
    setIsLoading(true);

    try {
      if (audio.canPlayType("application/vnd.apple.mpegurl")) {
        audio.src = hlsUrl;
        setIsLoading(false);
        if (autoplay) audio.play().catch(() => {});
        return;
      }

      const { default: Hls } = await import("hls.js");
      if (Hls.isSupported()) {
        if (hlsInstanceRef.current) hlsInstanceRef.current.destroy();

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.withCredentials = true;
          },
        });
        hlsInstanceRef.current = hls;
        hls.loadSource(hlsUrl);
        hls.attachMedia(audio);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (autoplay) audio.play().catch(() => setIsPlaying(false));
        });

        hls.on(Hls.Events.ERROR, (_event, data: HlsErrorData) => {
          if (data.fatal) {
            setHasError(true);
            setIsLoading(false);
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
      } else {
        audio.src = hlsUrl;
        setIsLoading(false);
      }
    } catch {
      setHasError(true);
      setIsLoading(false);
    }
  }, [hlsUrl, autoplay]);

  useEffect(() => {
    load();
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [load]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(() => {});
  }, [isPlaying]);

  const setVolume = useCallback((v: number) => {
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return { audioRef, isLoading, hasError, isPlaying, togglePlay, setVolume, retry: load };
}
