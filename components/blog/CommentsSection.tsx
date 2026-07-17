"use client";
import { useState } from "react";
import type { Comment } from "@/types/blog";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/providers/AuthProvider";
import { postArticleComment, fetchArticleComments } from "@/lib/services/articles";

export default function CommentsSection({ slug, comments: initial }: { slug: string; comments: Comment[] }) {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initial);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    setSubmitting(true);
    try {
      const created = await postArticleComment(slug, text.trim());
      setComments((prev) => [
        {
          id: created.id.toString(),
          author: created.author_name,
          avatar: created.author_avatar || "",
          content: created.content,
          publishedAt: "À l'instant",
          likes: created.like_count || 0,
        },
        ...prev,
      ]);
      setText("");
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const data = await fetchArticleComments(slug, nextPage);
      setComments((prev) => [
        ...prev,
        ...data.results.map((c) => ({
          id: c.id.toString(),
          author: c.author_name,
          avatar: c.author_avatar || "",
          content: c.content,
          publishedAt: "Récemment",
          likes: c.like_count || 0,
        })),
      ]);
      setPage(nextPage);
      setHasMore(!!data.next);
    } catch (err) {
      console.error("Failed to load more comments:", err);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <section className="bg-[#12223ce6] rounded-2xl p-4 mb-4 border border-white/10 rounded-lg hover:bg-white/5 transition">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">
          Commentaires{" "}
          <span className="text-text-muted text-sm font-normal ml-1">
            ({comments.length})
          </span>
        </h3>
      </div>

      {/* Zone de saisie */}
      <div className="flex gap-3 mb-8">
        <Avatar src="" alt="Votre avatar" size="md" />
        <div className="flex-grow relative">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={submitting}
            className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500 disabled:opacity-50"
            placeholder={isAuthenticated ? "Ajouter un commentaire..." : "Connectez-vous pour commenter..."}
            type="text"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:text-white transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-6">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>

      {hasMore && comments.length > 0 && (
        <button
          onClick={handleLoadMore}
          disabled={loadingMore}
          className="w-full mt-6 py-2.5 text-sm font-semibold text-text-muted border border-white/10 rounded-lg hover:bg-white/5 transition disabled:opacity-50"
        >
          {loadingMore ? "Chargement..." : "Voir plus de commentaires"}
        </button>
      )}
    </section>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3">
      <Avatar src={comment.avatar} alt={comment.author} size="sm" />
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-bold text-white">{comment.author}</span>
          <span className="text-xs text-text-muted">{comment.publishedAt}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
        {/* No per-comment like endpoint exists server-side — showing the real count as a
            plain (non-interactive) number rather than a toggle that would never persist. */}
        {comment.likes > 0 && (
          <div className="flex gap-1 items-center mt-2 text-xs text-text-muted">
            <span className="material-symbols-outlined text-[14px]">favorite</span>
            {comment.likes}
          </div>
        )}
      </div>
    </div>
  );
}
