import Link from "next/link";
import type { BlogCard } from "@/types/blog";
import ContentImage from "@/components/ui/ContentImage";

type FeaturedCard = BlogCard & { author?: string };

export default function FeaturedArticle({ post }: { post: FeaturedCard }) {
  return (
    <section className=" pt-2 pb-6">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden group shadow-glow">

          <ContentImage
            src={post.image}
            alt={post.title}
            className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12223ce6] via-[#131315]/40 to-transparent" />

          {/* Contenu bas */}
          <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start gap-3">
            <span className="px-3 py-1 rounded-full bg-primary/90 text-white text-xs font-bold tracking-wide backdrop-blur-sm uppercase">
              À la une
            </span>
            <h2 className="font-display font-bold text-3xl leading-tight text-white drop-shadow-md">
              {post.title}
            </h2>
            {/* Auteur + temps de lecture */}
            <div className="flex items-center gap-2 text-gray-300 text-sm font-medium mt-1">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: "18px" }}>
                face
              </span>
              {post.author && <span>Par {post.author}</span>}
              {post.author && post.readTime && (
                <span className="w-1 h-1 rounded-full bg-gray-500 inline-block" />
              )}
              {post.readTime && <span>{post.readTime}</span>}
            </div>
          </div>

        </div>
      </Link>
    </section>
  );
}
