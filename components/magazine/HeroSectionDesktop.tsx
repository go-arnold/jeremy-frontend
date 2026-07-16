import type { HeroArticle} from "@/types/magazine";

export default function HeroSectionDesktop({ article }: { article: HeroArticle }) {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: "92vh" }}>
      {/* Image fond */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${article.imageUrl}')` }}
      />

      {/* Overlay : gauche sombre (texte), droite transparente (image) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#12100F] via-[#12223cd9]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12223cd9]/60 to-transparent" />

      {/* Contenu — colonne gauche */}
      <div className="absolute inset-0 flex items-end">
        <div className="max-w-7xl mx-auto px-8 pb-16 w-full">
          <div className="max-w-[55%] flex flex-col gap-5">

            {/* Tag + temps */}
            <div className="flex items-center gap-3">
              <span className="bg-primary text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {article.tag}
              </span>
              <span className="text-white/60 text-xs font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {article.readTime} min read
              </span>
            </div>

            {/* Titre */}
            <h1 className="font-serif text-5xl xl:text-6xl font-medium text-white leading-[1.05]">
              {article.title}
              {article.titleEn && (
                <span className="block text-3xl xl:text-4xl text-white/70 font-light italic mt-3">
                  {article.titleEn}
                </span>
              )}
            </h1>

            {/* Excerpt */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-lg line-clamp-3">
              {article.excerpt}
            </p>

            {/* Auteur */}
            {article.author && (
              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                {article.author.avatarUrl && (
                  <div className="h-12 w-12 rounded-full border-2 border-primary/50 overflow-hidden">
                    <img
                      alt={article.author.name}
                      className="h-full w-full object-cover"
                      src={article.author.avatarUrl}
                    />
                  </div>
                )}
                <div>
                  <span className="text-white text-sm font-semibold block">{article.author.name}</span>
                  <span className="text-accent-gold text-xs">{article.author.role}</span>
                </div>
                <div className="ml-auto">
                  <button className="flex items-center gap-2 bg-primary hover:bg-[#B8240C] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-lg">article</span>
                    Lire l'article
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 right-8 flex flex-col items-center gap-1 text-white/30">
        <span className="text-[10px] tracking-widest uppercase font-bold">Défiler</span>
        <span className="material-symbols-outlined text-sm animate-bounce">keyboard_arrow_down</span>
      </div>
    </section>
  );
}