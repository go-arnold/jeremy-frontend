"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { useEngagement } from "@/hooks/useEngagement";

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
}

export default function EngagementBar({
  resourceType,
  id,
  initialLiked,
  initialLikeCount,
  initialCommentCount,
  initialSaved,
  enableSave = true,
}: EngagementBarProps) {
  const { isAuthenticated } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authPrompt, setAuthPrompt] = useState(false);

  const {
    liked,
    likeCount,
    toggleLike,
    comments,
    commentCount,
    commentsLoaded,
    loadingComments,
    loadComments,
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

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      setAuthPrompt(true);
      return;
    }
    setAuthPrompt(false);
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

  const handleShare = () => {
    requireAuth(() => {
      share().catch(() => {});
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-white">
        <div className="flex gap-4">
          <button
            onClick={() => requireAuth(toggleLike)}
            className="flex flex-col items-center gap-0.5 group"
          >
            <span
              className={`material-symbols-outlined text-[26px] transition-colors ${
                liked ? "text-red-500" : "group-hover:text-red-500"
              }`}
            >
              {liked ? "favorite" : "favorite_border"}
            </span>
            <span className="text-xs font-medium text-gray-400">{formatCount(likeCount)}</span>
          </button>

          <button onClick={handleToggleComments} className="flex flex-col items-center gap-0.5 group">
            <span
              className={`material-symbols-outlined text-[26px] transition-colors ${
                showComments ? "text-primary" : "group-hover:text-primary"
              }`}
            >
              {showComments ? "chat_bubble" : "chat_bubble_outline"}
            </span>
            <span className="text-xs font-medium text-gray-400">{formatCount(commentCount)}</span>
          </button>

          <button onClick={handleShare} className="flex flex-col items-center gap-0.5 group">
            <span className="material-symbols-outlined text-[26px] group-hover:text-primary transition-colors">
              ios_share
            </span>
            <span className="text-xs font-medium text-gray-400">Partager</span>
          </button>
        </div>

        {enableSave && (
          <button
            onClick={() => requireAuth(toggleSave)}
            className={saved ? "text-primary" : "text-gray-400 hover:text-primary"}
          >
            <span className="material-symbols-outlined text-[26px]">
              {saved ? "bookmark" : "bookmark_border"}
            </span>
          </button>
        )}
      </div>

      {authPrompt && (
        <p className="text-xs text-primary bg-primary/10 border border-primary/20 rounded-lg px-3 py-2">
          <Link href="/auth/login" className="font-bold underline">
            Connectez-vous
          </Link>{" "}
          pour interagir avec ce contenu.
        </p>
      )}

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
                  requireAuth(handleSubmitComment);
                }
              }}
              placeholder="Ajouter un commentaire..."
              className="flex-1 bg-black/40 border border-white/10 rounded-lg h-9 px-3 text-white placeholder:text-gray-500 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
            />
            <button
              onClick={() => requireAuth(handleSubmitComment)}
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
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto no-scrollbar">
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
            </div>
          ) : (
            <p className="text-gray-500 text-xs text-center py-2">Aucun commentaire. Soyez le premier !</p>
          )}
        </div>
      )}
    </div>
  );
}
