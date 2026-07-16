import type { BlogPost } from "@/types/blog";
import Avatar from "@/components/ui/Avatar";

export default function ArticleMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center justify-between py-6 border-b border-white/5 mb-6">

      {/* Auteur */}
      <div className="flex items-center gap-3">
        <Avatar
          src={post.author.avatar}
          alt={post.author.name}
          size="lg"
          className="border-2 border-surface"
        />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-white">Par {post.author.name}</span>
          <span className="text-xs text-text-muted">{post.author.publishedAt}</span>
        </div>
      </div>

      {/* Temps de lecture */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-primary text-xs font-semibold">
        <span className="material-symbols-outlined text-[16px]">schedule</span>
        <span>{post.readTime}</span>
      </div>

    </div>
  );
}
