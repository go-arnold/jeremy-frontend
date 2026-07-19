"use client";
import Image from "next/image";
import Avatar from "@/components/ui/Avatar";
import EngagementBar from "@/components/ui/EngagementBar";

interface ArtPostData {
  id: string;
  artist: { username: string; avatar: string; location: string; isVerified?: boolean };
  timeAgo: string;
  image?: string | null;
  coverImage?: string;
  video?: string | null;
  caption: string;
  tags: string[];
  likes?: number;
  comments?: number;
}

export default function ArtPostCard({ post }: { post: ArtPostData }) {
  const mediaSrc = post.image || post.coverImage || "";

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

      {/* Media */}
      {post.video ? (
        <div className="relative w-full rounded-xl overflow-hidden bg-black">
          <video src={post.video} controls className="w-full max-h-80 object-contain" />
        </div>
      ) : mediaSrc ? (
        <div className="relative w-full aspect-[4/3] max-h-80 rounded-xl overflow-hidden bg-surface-dark">
          <Image src={mediaSrc} alt={post.caption || "Publication"} fill sizes="(max-width: 768px) 100vw, 500px" className="object-cover" />
        </div>
      ) : (
        <div className="w-full h-24 rounded-xl bg-surface-dark flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-600 text-4xl">image_not_supported</span>
        </div>
      )}

      {/* Caption */}
      <p className="text-gray-200 text-sm">
        {post.caption}{" "}
        {post.tags?.map((tag) => (
          <span key={tag} className="text-primary">{tag} </span>
        ))}
      </p>

      {/* Actions */}
      <EngagementBar
        resourceType="community/posts"
        id={post.id}
        initialLikeCount={post.likes}
        initialCommentCount={post.comments}
        redirectTo={`/communaute/${post.id}`}
      />
    </article>
  );
}
