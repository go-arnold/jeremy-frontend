import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import ContentImage from "@/components/ui/ContentImage";

export default function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <div className="relative w-full h-[65vh] shrink-0">

      <ContentImage src={post.coverImage} alt={post.title} className="absolute inset-0" />

      {/* Overlay dégradé — identique à la page originale */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#17181c] via-[#17181c]/40 to-transparent" />

      {/* Bouton retour */}
      <div className="absolute top-0 left-0 w-full z-20 flex items-center px-4 pt-14">
        <Link
          href="/blog"
          className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </Link>
      </div>

      {/* Catégories + titre */}
      <div className="absolute bottom-0 left-0 w-full p-5 pb-8 flex flex-col gap-4">
        <div className="flex gap-2">
          {post.categories.map((cat, i) => (
            <span
              key={cat}
              className={`px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full ${
                i === 0
                  ? "bg-primary"
                  : "bg-white/10 backdrop-blur-md border border-white/10"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
        <h1 className="text-2xl md:text-2xl font-bold leading-tight text-white drop-shadow-lg">
          {post.title}
        </h1>
      </div>
    </div>
  );
}
