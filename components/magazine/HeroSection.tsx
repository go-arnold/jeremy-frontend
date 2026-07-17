import Link from "next/link";
import type { HeroArticle } from "@/types/magazine";

interface Props {
  article: HeroArticle;
}

export default function HeroSection({ article }: Props) {
  return (
    <Link
      href={article.slug ? `/blog/${article.slug}` : "#"}
      className="relative h-[85vh] w-full overflow-hidden block"
    >
      <section className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          data-alt={article.imageAlt}
          style={{ backgroundImage: `url('${article.imageUrl}')` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-4 pb-12">
          <div className="flex items-center gap-3">
            <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {article.tag}
            </span>
            <span className="text-white/80 text-xs font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {article.readTime} min read
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl font-medium text-white leading-[1.1] text-shadow">
            {article.title}
            {article.titleEn && (
              <span className="block text-2xl md:text-3xl text-white/90 font-light italic mt-2">
                {article.titleEn}
              </span>
            )}
          </h2>

          <p className="text-gray-300 text-sm md:text-base line-clamp-2 leading-relaxed max-w-md">
            {article.excerpt}
            {article.excerptEn && (
              <span className="opacity-70"> {article.excerptEn}</span>
            )}
          </p>

          {article.author && (
            <div className="flex items-center gap-3 mt-2">
              {article.author.avatarUrl && (
                <div className="h-10 w-10 rounded-full border-2 border-primary/50 overflow-hidden bg-surface-dark">
                  <img
                    alt={`Portrait de l'auteur ${article.author.name}`}
                    className="h-full w-full object-cover"
                    src={article.author.avatarUrl}
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold">
                  {article.author.name}
                </span>
                <span className="text-accent-gold text-xs">
                  {article.author.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </Link>
  );
}
