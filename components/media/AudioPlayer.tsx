'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface AudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  duration?: string;
  onPlay?: () => void;
  onPause?: () => void;
  thumbnail?: string;
}

export default function AudioPlayer({
  src,
  title,
  artist,
  duration,
  onPlay,
  onPause,
  thumbnail,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setTotalDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      onPause?.();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onPause]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      audio.play().catch(e => console.error('Play error:', e));
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = parseFloat(e.target.value);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(totalDuration, audio.currentTime + seconds));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-xl border border-white/10">
      <audio ref={audioRef} src={src} crossOrigin="anonymous" />

      {/* Cover + Info */}
      <div className="flex gap-4 mb-6">
        {thumbnail && (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
            <Image src={thumbnail} alt={title} fill sizes="64px" className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg truncate">{title}</h3>
          {artist && <p className="text-white/60 text-sm truncate">{artist}</p>}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={totalDuration || 0}
          value={currentTime}
          onChange={handleProgressChange}
          aria-label="Progression de la lecture"
          className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary"
          style={{
            background: `linear-gradient(to right, #E63012 0%, #E63012 ${
              totalDuration ? (currentTime / totalDuration) * 100 : 0
            }%, rgba(255,255,255,0.2) ${totalDuration ? (currentTime / totalDuration) * 100 : 0}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-white/50 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(totalDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => skip(-10)}
            className="text-white hover:text-primary transition-colors flex-shrink-0"
            title="Reculer 10s"
            aria-label="Reculer de 10 secondes"
          >
            <span className="material-symbols-outlined">replay_10</span>
          </button>

          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-primary hover:bg-[#B8240C] transition-colors text-white flex-shrink-0"
            aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
          >
            <span className="material-symbols-outlined text-2xl">
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          <button
            onClick={() => skip(10)}
            className="text-white hover:text-primary transition-colors flex-shrink-0"
            title="Avancer 10s"
            aria-label="Avancer de 10 secondes"
          >
            <span className="material-symbols-outlined">forward_10</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="text-white/60 hover:text-white transition-colors flex-shrink-0"
            aria-label={isMuted || volume === 0 ? 'Réactiver le son' : 'Couper le son'}
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
            aria-label="Volume"
            className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="flex items-center gap-2 text-white/60">
          <span className="text-xs">{duration || formatTime(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
}
