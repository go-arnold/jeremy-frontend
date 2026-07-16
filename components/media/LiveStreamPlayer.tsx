'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LiveStreamPlayerProps {
  hlsUrl?: string;
  dashUrl?: string;
  title: string;
  status: 'live' | 'scheduled' | 'offline';
  viewerCount?: number;
  thumbnail?: string;
  autoplay?: boolean;
  onFullscreen?: (isFullscreen: boolean) => void;
}

export default function LiveStreamPlayer({
  hlsUrl,
  dashUrl,
  title,
  status,
  viewerCount = 0,
  thumbnail,
  autoplay = true,
  onFullscreen,
}: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsInstanceRef = useRef<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showControls, setShowControls] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load HLS stream using hls.js
  const loadStream = useCallback(async (videoEl: HTMLVideoElement, url: string) => {
    setHasError(false);
    setIsLoading(true);

    try {
      // Safari / iOS native HLS support
      if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = url;
        setIsLoading(false);
        if (autoplay) videoEl.play().catch(() => {});
        return;
      }

      // Dynamic import of hls.js for non-Safari browsers
      const { default: Hls } = await import('hls.js');

      if (Hls.isSupported()) {
        // Destroy any existing HLS instance
        if (hlsInstanceRef.current) {
          hlsInstanceRef.current.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsInstanceRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(videoEl);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (autoplay) {
            videoEl.play().catch(() => {
              setIsPlaying(false);
            });
          }
        });

        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          if (data.fatal) {
            console.error('Fatal HLS error:', data.type, data.details);
            setHasError(true);
            setErrorMsg('Erreur de flux — veuillez réessayer');
            setIsLoading(false);

            // Try to recover
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
        // Fallback: try direct src (may work for some browsers)
        videoEl.src = url;
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Failed to load HLS stream:', err);
      setHasError(true);
      setErrorMsg('Impossible de charger le flux vidéo');
      setIsLoading(false);
    }
  }, [autoplay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsUrl || status === 'offline') {
      setIsLoading(false);
      return;
    }

    loadStream(video, hlsUrl);

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [hlsUrl, status, loadStream]);

  // Sync fullscreen events
  useEffect(() => {
    const handleFsChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullscreen(isFull);
      onFullscreen?.(isFull);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [onFullscreen]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(e => console.error('Play error:', e));
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const isOffline = status === 'offline' || (!hlsUrl && status !== 'live');

  return (
    <div
      ref={containerRef}
      className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="relative w-full aspect-video">

        {/* Thumbnail / poster */}
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoading || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
          />
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          poster={thumbnail}
          className="w-full h-full object-cover"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setErrorMsg('Erreur de lecture');
            setIsLoading(false);
          }}
        />

        {/* Loading spinner */}
        {isLoading && !isOffline && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-12 h-12 border-4 border-white/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {/* Play button overlay when paused */}
        {!isPlaying && !hasError && !isOffline && !isLoading && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-10"
          >
            <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white" style={{ fontSize: '40px', marginLeft: '4px' }}>
                play_arrow
              </span>
            </div>
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-black/70 px-4 py-2 rounded-full backdrop-blur-sm">
          {status === 'live' && (
            <>
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-bold text-xs tracking-wide">EN DIRECT</span>
            </>
          )}
          {status === 'scheduled' && (
            <>
              <span className="material-symbols-outlined text-yellow-400 text-sm">schedule</span>
              <span className="text-yellow-400 font-semibold text-xs">À VENIR</span>
            </>
          )}
          {isOffline && (
            <span className="text-gray-400 text-xs font-medium">HORS LIGNE</span>
          )}
        </div>

        {/* Viewer Count */}
        {status === 'live' && viewerCount > 0 && (
          <div className="absolute top-4 left-4 z-20 bg-black/70 px-3 py-1.5 rounded-full text-white text-xs flex items-center gap-1.5 backdrop-blur-sm">
            <span className="material-symbols-outlined text-sm">people</span>
            <span className="font-medium">{viewerCount.toLocaleString('fr-FR')}</span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 gap-4 z-20">
            <span className="material-symbols-outlined text-6xl text-red-400">signal_wifi_off</span>
            <p className="text-white font-semibold text-center px-4">{errorMsg || 'Erreur de diffusion'}</p>
            <button
              onClick={() => hlsUrl && videoRef.current && loadStream(videoRef.current, hlsUrl)}
              className="px-6 py-2 bg-primary rounded-full text-white text-sm font-bold hover:bg-[#B8240C] transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Offline State */}
        {isOffline && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 gap-4 z-20">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-gray-400">videocam_off</span>
            </div>
            <div className="text-center px-6">
              <p className="text-white font-bold text-lg mb-1">Direct indisponible</p>
              <p className="text-gray-400 text-sm">Aucune diffusion en direct pour le moment</p>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-300 z-10 ${
            showControls && !isOffline ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button onClick={togglePlay} className="text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              {/* Volume */}
              <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                <span className="material-symbols-outlined">
                  {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                </span>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary"
              />

              {/* Live indicator */}
              {status === 'live' && (
                <span className="ml-2 text-red-500 font-bold text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  DIRECT
                </span>
              )}
            </div>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white hover:text-primary transition-colors">
              <span className="material-symbols-outlined">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Title bar */}
      <div className="px-4 py-3 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-between">
        <h3 className="text-white font-bold text-base truncate">{title}</h3>
        {status === 'live' && (
          <span className="flex items-center gap-1.5 text-xs text-red-400 font-bold shrink-0 ml-3">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>
    </div>
  );
}
