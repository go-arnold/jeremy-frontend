
import Link from "next/link";
import type { BlogCard } from "@/types/blog";
import ContentImage from "@/components/ui/ContentImage";

interface Props {
  posts: BlogCard[];
}

export default function BlogGrid({ posts }: Props) {
  return (
    <section className="px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {posts.map((post) => (
          <BlogCardItem key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

// ── Carte individuelle ────────────────────────────────────────────────────────
function BlogCardItem({ post }: { post: BlogCard }) {
  // Hauteur image réduite pour la grille 2 colonnes (auparavant dimensionnée pour 1 carte/ligne)
  const imgClass = post.excerpt
    ? "h-28"
    : post.publishedAt && !post.readTime
    ? "h-20"
    : "h-24";

  // Badge sur l'image : catégorie (sauf si card "Société" sans badge explicite)
  const showImageBadge = post.category !== "Société" || !!post.badgeLabel;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col rounded-xl bg-surface overflow-hidden shadow-lg border border-white/5 block"
    >
      {/* Image */}
      <div className={`${imgClass} relative`}>
        <ContentImage
          src={post.image}
          alt={post.title}
          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {showImageBadge && (
          <div className="absolute top-2 left-2">
            <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
              {post.category}
            </span>
          </div>
        )}
      </div>

      {/* Contenu texte */}
      <div className={`p-2.5 flex flex-col ${post.excerpt ? "gap-1.5" : "gap-1"} bg-[#12223ce6]`}>
        {/* Catégorie visible quand pas de badge sur l'image */}
        {!showImageBadge && (
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
            {post.category}
          </span>
        )}

        <h3 className="text-white font-display font-bold leading-snug text-xs line-clamp-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-gray-400 text-[10px] line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {post.publishedAt && (
          <span className="text-gray-500 text-[10px]">{post.publishedAt}</span>
        )}

        {post.readTime && (
          <span className="text-primary text-[10px] font-bold mt-1">
            {post.readTime} de lecture
          </span>
        )}

        {post.badgeLabel && (
          <span className="text-primary text-[10px] font-bold">
            {post.badgeLabel}
          </span>
        )}
      </div>
    </Link>
  );
}
