"use client";
import { useState } from "react";
import type { Comment } from "@/types/blog";
import Avatar from "@/components/ui/Avatar";

export default function CommentsSection({ comments: initial }: { comments: Comment[] }) {
  const [comments, setComments] = useState(initial);
  const [text, setText]         = useState("");

  function handleSubmit() {
    if (!text.trim()) return;
    setComments((prev) => [
      {
        id: `tmp-${Date.now()}`,
        author: "Moi",
        avatar: "",
        content: text.trim(),
        publishedAt: "À l'instant",
        likes: 0,
      },
      ...prev,
    ]);
    setText("");
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
            className="w-full bg-background-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-500"
            placeholder="Ajouter un commentaire..."
            type="text"
          />
          <button
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:text-white transition"
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

      <button className="w-full mt-6 py-2.5 text-sm font-semibold text-text-muted border border-white/10 rounded-lg hover:bg-white/5 transition">
        Voir plus de commentaires
      </button>
    </section>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(comment.likes);

  function toggle() {
    setLiked((l) => !l);
    setCount((n) => (liked ? n - 1 : n + 1));
  }

  return (
    <div className="flex gap-3">
      <Avatar src={comment.avatar} alt={comment.author} size="sm" />
      <div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-bold text-white">{comment.author}</span>
          <span className="text-xs text-text-muted">{comment.publishedAt}</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
        <div className="flex gap-4 mt-2">
          <button
            onClick={toggle}
            className={`text-xs flex items-center gap-1 transition ${
              liked ? "text-primary" : "text-text-muted hover:text-white"
            }`}
          >
            <span
              className="material-symbols-outlined text-[14px]"
              style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
            {count}
          </button>
          <button className="text-xs text-text-muted hover:text-white">
            Répondre
          </button>
        </div>
      </div>
    </div>
  );
}
