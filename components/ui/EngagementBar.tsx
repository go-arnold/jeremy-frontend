"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { useEngagement } from "@/hooks/useEngagement";
import { resolveShareUrl } from "@/lib/share";
import AuthPromptModal from "./AuthPromptModal";
import ShareMenu from "./ShareMenu";

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function formatRelativeTime(iso: string): string {
  if (!iso) return "Récemment";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Récemment";
  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));
  if (seconds < 60) return "À l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

interface EngagementBarProps {
  resourceType: string;
  id: string | number;
  initialLiked?: boolean;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialSaved?: boolean;
  enableSave?: boolean;
  /** Where the "please sign in" prompt sends the user back after login. */
  redirectTo?: string;
}

export default function EngagementBar({
  resourceType,
  id,
  initialLiked,
  initialLikeCount,
  initialCommentCount,
  initialSaved,
  enableSave = true,
  redirectTo = "/communaute",
}: EngagementBarProps) {
  const { isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState<string | null>(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const {
    liked,
    likeCount,
    toggleLike,
    comments,
    commentCount,
    commentsLoaded,
    loadingComments,
    loadComments,
    commentsHasMore,
    loadingMoreComments,
    loadMoreComments,
    postComment,
    share,
    saved,
    toggleSave,
  } = useEngagement(resourceType, id, {
    initialLiked,
    initialLikeCount,
    initialCommentCount,
    initialSaved,
  });

  // Every gated action gets its own message so the prompt explains *what* requires an account —
  // "aimer ce post" vs "commenter" vs "mettre ce post en signet" (partager reste libre, non
  // gated : voir handleShare ci-dessous, qui n'appelle jamais requireAuth).
  const requireAuth = (message: string, action: () => void) => {
    if (!isAuthenticated) {
      setAuthPromptMessage(message);
      return;
    }
    action();
  };

  const handleToggleComments = () => {
    if (!showComments && !commentsLoaded) loadComments();
    setShowComments((v) => !v);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await postComment(newComment.trim());
      setNewComment("");
    } catch {
      // optimistic UI already reflects nothing added; leave the draft so the user can retry
    } finally {
      setSubmitting(false);
    }
  };

  // Sharing a link never requires an account — only like/comment/save do. On devices/browsers
  // with the native Web Share API (mostly mobile), that gives the OS share sheet with every
  // installed app as a target. Elsewhere (mostly desktop), ShareMenu offers the same well-known
  // external destinations instead of silently copying the link with no other option.
  const handleShare = async () => {
    share().catch(() => {});
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Art du Kivu — Communauté",
          text: "Découvrez cette publication sur Art du Kivu",
          url: resolveShareUrl(redirectTo),
        });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        // fall through to the manual menu on any other native-share failure
      }
    }
    setShareMenuOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-white">
        <div className="flex gap-4">
          <button
            onClick={() => requireAuth("Connectez-vous ou créez un compte pour aimer ce post : ça ne prend que 2 secondes !", toggleLike)}
            className="flex flex-col items-center gap-0.5 group"
          >
            <span
              className={`material-symbols-outlined text-[22px] sm:text-[26px] transition-colors ${
                liked ? "text-red-500" : "group-hover:text-red-500"
              }`}
            >
              {liked ? "favorite" : "favorite_border"}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400">{formatCount(likeCount)}</span>
          </button>

          <button onClick={handleToggleComments} className="flex flex-col items-center gap-0.5 group">
            <span
              className={`material-symbols-outlined text-[22px] sm:text-[26px] transition-colors ${
                showComments ? "text-primary" : "group-hover:text-primary"
              }`}
            >
              {showComments ? "chat_bubble" : "chat_bubble_outline"}
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400">{formatCount(commentCount)}</span>
          </button>

          <button onClick={handleShare} className="flex flex-col items-center gap-0.5 group">
            <span className="material-symbols-outlined text-[22px] sm:text-[26px] group-hover:text-primary transition-colors">
              ios_share
            </span>
            <span className="text-[10px] sm:text-xs font-medium text-gray-400">Partager</span>
          </button>
        </div>

        {enableSave && (
          <button
            onClick={() => requireAuth("Connectez-vous ou créez un compte pour mettre ce post en signet : ça ne prend que 2 secondes !", toggleSave)}
            className={saved ? "text-primary" : "text-gray-400 hover:text-primary"}
          >
            <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
              {saved ? "bookmark" : "bookmark_border"}
            </span>
          </button>
        )}
      </div>

      {showComments && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  requireAuth("Connectez-vous ou créez un compte pour commenter : ça ne prend que 2 secondes !", handleSubmitComment);
                }
              }}
              placeholder="Ajouter un commentaire..."
              className="flex-1 bg-black/40 border border-white/10 rounded-lg h-9 px-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <button
              onClick={() => requireAuth("Connectez-vous ou créez un compte pour envoyer votre commentaire : ça ne prend que 2 secondes !", handleSubmitComment)}
              disabled={submitting || !newComment.trim()}
              className="h-9 px-3 rounded-lg bg-primary/80 hover:bg-primary text-white transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">send</span>
            </button>
          </div>

          {loadingComments ? (
            <div className="flex justify-center py-3">
              <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : comments.length > 0 ? (
            <div className="flex flex-col gap-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div className="relative w-7 h-7 rounded-full bg-surface-dark border border-white/10 overflow-hidden flex-shrink-0">
                    {c.avatarUrl ? (
                      <Image src={c.avatarUrl} alt={c.username} fill sizes="28px" className="object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-gray-400 text-sm flex items-center justify-center h-full">
                        person
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-white text-xs font-bold">{c.username}</span>
                      <span className="text-gray-500 text-[10px]">{formatRelativeTime(c.createdAt)}</span>
                    </div>
                    <p className="text-gray-300 text-xs mt-0.5">{c.content}</p>
                  </div>
                </div>
              ))}
              {commentsHasMore && (
                <button
                  onClick={loadMoreComments}
                  disabled={loadingMoreComments}
                  className="self-center text-primary text-xs font-bold hover:underline disabled:opacity-50 mt-1"
                >
                  {loadingMoreComments ? "Chargement..." : "Voir plus de commentaires"}
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-xs text-center py-2">Aucun commentaire. Soyez le premier !</p>
          )}
        </div>
      )}

      <AuthPromptModal
        open={!!authPromptMessage}
        onClose={() => setAuthPromptMessage(null)}
        redirectTo={redirectTo}
        message={authPromptMessage || undefined}
      />

      <ShareMenu
        open={shareMenuOpen}
        onClose={() => setShareMenuOpen(false)}
        url={redirectTo}
        text="Découvrez cette publication sur Art du Kivu"
      />
    </div>
  );
}
