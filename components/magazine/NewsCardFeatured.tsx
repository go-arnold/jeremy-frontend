import type { HeroArticle, NewsArticle, YouthItem, RadioBanner } from "@/types/magazine";


// ── NewsCard Featured (version large desktop) ───────
export default function NewsCardFeatured({ article }: { article: NewsArticle }) {
  return (
    <article className="relative h-full min-h-[360px] rounded-2xl overflow-hidden group cursor-pointer shadow-xl">
      {article.imageUrl && (
        <img
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src={article.imageUrl}
          alt={article.imageAlt ?? article.title}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3">
        <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest w-fit">
          {article.category}
        </span>
        <h3 className="font-serif text-2xl text-white leading-tight">{article.title}</h3>
        {article.subtitle && (
          <p className="text-gray-300 text-sm line-clamp-2">{article.subtitle}</p>
        )}
        <div className="flex items-center gap-2 pt-2 border-t border-white/10">
          {article.author && (
            <span className="text-accent-gold text-xs font-bold">{article.author.name}</span>
          )}
          {article.date && (
            <span className="text-gray-500 text-xs ml-auto">{article.date}</span>
          )}
        </div>
      </div>
    </article>
  );
}