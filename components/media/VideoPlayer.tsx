'use client';

import React, { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  title: string;
  description?: string;
  thumbnail?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onFullscreen?: (isFullscreen: boolean) => void;
  autoplay?: boolean;
}

export default function VideoPlayer({
  src,
  title,
  description,
  thumbnail,
  onPlay,
  onPause,
  onFullscreen,
  autoplay = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (!src) {
    return (
      <div className="w-full aspect-video bg-black rounded-2xl flex flex-col items-center justify-center border border-white/5 p-6 text-center">
        <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">videocam_off</span>
        <p className="text-gray-400 text-sm font-bold">{title || "Vidéo non disponible"}</p>
        {description && <p className="text-gray-500 text-xs mt-1 max-w-xs">{description}</p>}
      </div>
    );
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setTotalDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onPause?.();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', () => {});
      video.removeEventListener('pause', () => {});
    };
  }, [onPause]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      onPause?.();
    } else {
      video.play().catch(e => console.error('Play error:', e));
      onPlay?.();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = parseFloat(e.target.value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        setIsFullscreen(true);
        onFullscreen?.(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
        onFullscreen?.(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '0:00';
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(totalDuration, video.currentTime + seconds));
  };

  return (
    <div
      ref={containerRef}
      className="w-full bg-black rounded-2xl overflow-hidden shadow-2xl group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false);
      }}
    >
      <div className="relative w-full aspect-video">
        <video
          ref={videoRef}
          src={src || undefined}
          poster={thumbnail}
          autoPlay={autoplay}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />

        {/* Play button overlay when not playing */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors z-10"
          >
            <span className="material-symbols-outlined text-7xl text-white opacity-80">
              play_circle
            </span>
          </button>
        )}

        {/* Controls */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="px-4 pt-2 pb-1">
            <input
              type="range"
              min="0"
              max={totalDuration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary"
              style={{
                background: `linear-gradient(to right, #E63012 0%, #E63012 ${
                  totalDuration ? (currentTime / totalDuration) * 100 : 0
                }%, rgba(255,255,255,0.2) ${totalDuration ? (currentTime / totalDuration) * 100 : 0}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
          </div>

          {/* Control Buttons */}
          <div className="px-4 py-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              </button>

              <button
                onClick={() => skip(-10)}
                className="text-white hover:text-primary transition-colors"
                title="Reculer 10s"
              >
                <span className="material-symbols-outlined text-sm">replay_10</span>
              </button>

              <button
                onClick={() => skip(10)}
                className="text-white hover:text-primary transition-colors"
                title="Avancer 10s"
              >
                <span className="material-symbols-outlined text-sm">forward_10</span>
              </button>

              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">
                    {isMuted || volume === 0 ? 'volume_off' : 'volume_up'}
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
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white text-xs whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">
                  {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Title and Description */}
      {(title || description) && (
        <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950">
          <h3 className="text-white font-bold text-xl mb-2">{title}</h3>
          {description && <p className="text-white/60 text-sm line-clamp-2">{description}</p>}
        </div>
      )}
    </div>
  );
}
