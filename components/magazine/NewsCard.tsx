import type { NewsArticle } from "@/types/magazine";

interface Props {
  article: NewsArticle;
}

export default function NewsCard({ article }: Props) {
  const { variant, category, title, subtitle, imageUrl, imageAlt, author, date, quote } = article;

  /* ── Variante : image portrait tall (ex: MUSIQUE) ── */
  if (variant === "tall-image") {
    return (
      <article className="break-inside-avoid bg-surface-dark rounded-xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-black/20">
        <div className="relative aspect-[3/4] overflow-hidden">
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
              {category}
            </span>
          </div>
          {imageUrl && (
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={imageUrl}
              data-alt={imageAlt}
              alt={imageAlt ?? title}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-3 left-3 right-3">
            <h4 className="text-white font-serif text-lg leading-tight mb-1">{title}</h4>
            {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
          </div>
        </div>
      </article>
    );
  }

  /* ── Variante : image carrée avec texte en dessous (ex: MODE) ── */
  if (variant === "square-image") {
    return (
      <article className="break-inside-avoid bg-surface-dark rounded-xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-black/20">
        <div className="relative aspect-square overflow-hidden">
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
              {category}
            </span>
          </div>
          {imageUrl && (
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={imageUrl}
              data-alt={imageAlt}
              alt={imageAlt ?? title}
            />
          )}
        </div>
        <div className="p-4">
          <h4 className="text-white font-bold text-base leading-tight mb-2">{title}</h4>
          {author && (
            <div className="flex items-center gap-2 text-xs text-accent-gold">
              <span className="material-symbols-outlined text-[14px]">person</span>
              <span>{author.name}</span>
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ── Variante : texte seul (ex: LITTÉRATURE) ── */
  if (variant === "text-only") {
    return (
      <article className="break-inside-avoid bg-surface-dark rounded-xl overflow-hidden p-5 border border-white/5 relative group hover:border-primary/30 transition-colors">
        <span className="text-primary text-[10px] font-bold uppercase tracking-wider mb-2 block">
          {category}
        </span>
        <h4 className="font-serif text-xl text-white italic mb-3">{title}</h4>
        {quote && (
          <p className="text-gray-400 text-xs leading-relaxed mb-4">{quote}</p>
        )}
        <div className="flex justify-between items-center border-t border-white/5 pt-3">
          {date && <span className="text-xs text-gray-500">{date}</span>}
          <button className="bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-full p-1 transition-colors ml-auto">
            <span className="material-symbols-outlined text-sm block">arrow_outward</span>
          </button>
        </div>
      </article>
    );
  }

  /* ── Variante : image courte avec overlay bas (ex: URBAN) ── */
  if (variant === "short-image") {
    return (
      <article className="break-inside-avoid bg-surface-dark rounded-xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300 shadow-lg shadow-black/20">
        <div className="relative aspect-[4/5] overflow-hidden">
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10">
              {category}
            </span>
          </div>
          {imageUrl && (
            <img
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              src={imageUrl}
              data-alt={imageAlt}
              alt={imageAlt ?? title}
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
            <h4 className="text-white font-bold text-sm leading-tight">{title}</h4>
          </div>
        </div>
      </article>
    );
  }

  return null;
}
