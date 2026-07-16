import type { NewsArticle } from "@/types/magazine";
import NewsCardFeatured from "@/components/magazine/NewsCardFeatured";
import NewsCard from "@/components/magazine/NewsCard";

// ── NewsSection desktop — grille 3 colonnes ─────────
export default function NewsSectionDesktop({ articles }: { articles: NewsArticle[] }) {
  return (
    <section>
      <div className="flex items-end justify-between mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-serif text-3xl text-white italic">Actualités Culturelles</h2>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mt-1">Cultural News</p>
        </div>
        <a className="text-primary text-sm font-bold flex items-center gap-1 hover:text-[#F0EDE8] transition-colors" href="#">
          Voir tout
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      {/* Grille éditoriale :
          - 1ère carte : featured grande (col-span-2, ligne 1)
          - Reste : grille 3 colonnes */}
      <div className="grid grid-cols-3 gap-5">
        {articles.slice(0, 1).map((article) => (
          <div key={article.id} className="col-span-2 row-span-1">
            <NewsCardFeatured article={article} />
          </div>
        ))}
        {articles.slice(1, 3).map((article) => (
          <div key={article.id}>
            <NewsCard article={article} />
          </div>
        ))}
        {articles.slice(3).map((article) => (
          <div key={article.id}>
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}