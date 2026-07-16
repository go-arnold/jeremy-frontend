
import Link from "next/link";
import type { BlogCard } from "@/types/blog";

interface Props {
  posts: BlogCard[];
}

export default function BlogGrid({ posts }: Props) {
  const left  = posts.filter((_, i) => i % 2 === 0);
  const right = posts.filter((_, i) => i % 2 !== 0);
  return (
    <section className="px-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <BlogCardItem key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

// ── Carte individuelle ────────────────────────────────────────────────────────
function BlogCardItem({ post }: { post: BlogCard }) {
  // Hauteur image : h-64 si excerpt, h-32 si publishedAt seul, h-40 sinon
  const imgClass = post.excerpt
    ? "h-64"
    : post.publishedAt && !post.readTime
    ? "h-32"
    : "h-40";

  // Badge sur l'image : catégorie (sauf si card "Société" sans badge explicite)
  const showImageBadge = post.category !== "Société" || !!post.badgeLabel;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col rounded-xl bg-surface-dark overflow-hidden shadow-lg border border-white/5 block"
    >
      {/* Image */}
      <div
        className={`${imgClass} bg-cover bg-center transition-opacity duration-300 group-hover:opacity-90 relative`}
        style={{ backgroundImage: post.image ? `url('${post.image}')` : 'linear-gradient(#222, #444)' }}
      >
        {showImageBadge && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
              {post.category}
            </span>
          </div>
        )}
      </div>

      {/* Contenu texte */}
      <div className={`p-3 flex flex-col ${post.excerpt ? "gap-2" : "gap-1"} bg-[#12223ce6]`}>
        {/* Catégorie en texte (si pas de badge image ET pas d'excerpt) */}
        {!post.excerpt && !showImageBadge && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {post.category}
          </span>
        )}
        {/* Catégorie visible quand pas de badge sur l'image */}
        {!showImageBadge && (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {post.category}
          </span>
        )}

        <h3
          className={`text-white font-display font-bold leading-snug ${
            post.excerpt ? "text-lg" : "text-base"
          }`}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {post.publishedAt && (
          <span className="text-gray-500 text-xs">{post.publishedAt}</span>
        )}

        {post.readTime && (
          <span className="text-primary text-xs font-bold mt-1">
            {post.readTime} de lecture
          </span>
        )}

        {post.badgeLabel && (
          <span className="text-primary text-xs font-bold">
            {post.badgeLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
