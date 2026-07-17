"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { toggleArticleLike } from "@/lib/services/articles";
import { shareContent } from "@/lib/share";

interface Props {
  slug: string;
  title: string;
  initialLikeCount: number;
}

/** Articles have no save/bookmark backend capability at all (only like + comments, no
 * `EngagementActionsMixin`) — the "bookmark_border" icon this replaces had nothing real to do,
 * so this wires the actually-available like toggle instead, plus a real share action. */
export default function ArticleEngagementButtons({ slug, title, initialLikeCount }: Props) {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    try {
      const result = await toggleArticleLike(slug);
      setLiked(result.action === "liked");
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
    }
  };

  const handleShare = () => {
    shareContent({ title, url: `/blog/${slug}` }).catch(() => {});
  };

  return (
    <>
      <button
        onClick={handleLike}
        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors border ${
          liked ? "text-primary border-primary/30 bg-primary/10" : "text-[#8A8178] hover:text-white hover:bg-white/5 border-white/10"
        }`}
        title={`${likeCount} j'aime`}
      >
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}>
          favorite
        </span>
      </button>
      <button
        onClick={handleShare}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-[#8A8178] hover:text-white hover:bg-white/5 transition-colors border border-white/10"
      >
        <span className="material-symbols-outlined text-lg">share</span>
      </button>
    </>
  );
}
