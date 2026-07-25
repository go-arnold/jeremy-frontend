import Link from "next/link";
import type { BlogCard } from "@/types/blog";
import ContentImage from "@/components/ui/ContentImage";

export default function RelatedPosts({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;

  return (
    <section className="mb-10">
      <h3 className="text-xl font-bold text-white mb-5 font-display">
        Vous aimerez aussi
      </h3>
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="flex-shrink-0 w-60 group cursor-pointer"
          >
            <div className="w-full h-40 rounded-xl mb-3 relative overflow-hidden">
              <ContentImage src={post.image} alt={post.title} className="absolute inset-0" sizes="240px" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-300" />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              {post.category}
            </span>
            <h4 className="text-base font-bold text-white leading-tight mt-1 group-hover:text-primary transition-colors">
              {post.title}
            </h4>
          </Link>
        ))}
      </div>
    </section>
  );
}
