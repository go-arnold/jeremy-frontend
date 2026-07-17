"use client";
import { useState, useRef, useEffect } from "react";
import Avatar from "@/components/ui/Avatar";
import EngagementBar from "@/components/ui/EngagementBar";

interface PostData {
  id: string;
  artist: { username: string; avatar: string; location: string; isVerified?: boolean };
  timeAgo: string;
  title: string;
  coverImage?: string;
  image?: string;
  video?: string;
  audio?: string;
  duration?: string;
  likes: number;
  comments: number;
  caption: string;
  tags: string[];
}

export default function TalentPostCard({ post }: { post: PostData }) {
  const [mediaError, setMediaError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgInView, setImgInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);

  // Lazy loading with Intersection Observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    if (imgContainerRef.current) {
      observerRef.current.observe(imgContainerRef.current);
    }
    return () => observerRef.current?.disconnect();
  }, []);

  const coverSrc = post.coverImage || post.image || "";
  const hasVideo = !!post.video;
  const hasAudio = !!post.audio;
  const hasImage = !!coverSrc;

  /* ──── Media Renderer ──── */
  const renderMedia = () => {
    if (hasVideo) {
      return (
        <div className="relative w-full rounded-xl overflow-hidden bg-black" ref={imgContainerRef}>
          <video
            src={post.video}
            controls
            preload="metadata"
            className="w-full max-h-80 object-contain"
            poster={coverSrc || undefined}
          />
        </div>
      );
    }
    
    if (hasAudio) {
      return (
        <div className="relative w-full rounded-xl overflow-hidden bg-surface-dark" ref={imgContainerRef}>
          <div className="flex items-center gap-3 p-4 bg-black/30">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-2xl">music_note</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{post.title || post.caption}</p>
              <p className="text-gray-400 text-xs">{post.duration || "Audio"}</p>
            </div>
            <audio src={post.audio} controls className="max-w-[200px] h-10" />
          </div>
        </div>
      );
    }
    
    if (hasImage) {
      return (
        <div className="relative aspect-[4/5] w-full bg-surface-dark rounded-xl overflow-hidden group" ref={imgContainerRef}>
          {!imgLoaded && !mediaError && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-dark animate-pulse">
              <span className="material-symbols-outlined text-gray-600 text-4xl">image</span>
            </div>
          )}
          {imgInView && (
            <img
              ref={imgRef}
              src={coverSrc}
              alt={post.title || post.caption}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-80" : "opacity-0"}`}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              onError={() => setMediaError(true)}
            />
          )}
          {mediaError && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface-dark">
              <div className="text-center">
                <span className="material-symbols-outlined text-gray-600 text-4xl">broken_image</span>
                <p className="text-gray-500 text-xs mt-1">Image indisponible</p>
              </div>
            </div>
          )}
          {!mediaError && hasImage && !hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                <span className="material-symbols-outlined text-3xl ml-1">play_arrow</span>
              </div>
            </div>
          )}
          {post.duration && (
            <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded text-xs text-white font-mono">
              {post.duration}
            </div>
          )}
        </div>
      );
    }
    
    // No media at all - show placeholder
    return (
      <div className="w-full h-32 rounded-xl bg-surface-dark flex items-center justify-center" ref={imgContainerRef}>
        <div className="text-center">
          <span className="material-symbols-outlined text-gray-600 text-4xl">article</span>
          <p className="text-gray-500 text-xs mt-1">Post sans média</p>
        </div>
      </div>
    );
  };

  return (
    <article className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={post.artist.avatar} alt={post.artist.username} size="md" className="border border-white/10" />
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm flex items-center gap-1">
              {post.artist.username}
              {post.artist.isVerified && (
                <span className="material-symbols-outlined text-primary text-sm">verified</span>
              )}
            </span>
            <span className="text-gray-500 text-xs">{post.artist.location} • {post.timeAgo}</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* Media - with lazy loading and placeholders */}
      {renderMedia()}

      {/* Title */}
      {post.title && <p className="text-white font-semibold text-sm">{post.title}</p>}

      {/* Caption */}
      {(post.caption || post.tags?.length > 0) && (
        <p className="text-gray-200 text-sm leading-relaxed">
          {post.caption}{" "}
          {post.tags?.map((tag) => (
            <span key={tag} className="text-primary">{tag} </span>
          ))}
        </p>
      )}

      {/* Actions */}
      <EngagementBar
        resourceType="community/posts"
        id={post.id}
        initialLikeCount={post.likes}
        initialCommentCount={post.comments}
      />
    </article>
  );
}