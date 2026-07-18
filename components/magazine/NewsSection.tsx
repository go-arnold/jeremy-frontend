import type { NewsArticle } from "@/types/magazine";
import NewsCard from "./NewsCard";
import NewsCardFeatured from "./NewsCardFeatured";

interface Props {
  articles: NewsArticle[];
  /** Mobile: masonry 2 colonnes. Desktop: grille éditoriale 3 colonnes avec une carte featured. */
  variant?: "mobile" | "desktop";
}

export default function NewsSection({ articles, variant = "mobile" }: Props) {
  if (variant === "desktop") {
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

  return (
    <section className="mt-8 px-5">
      <div className="flex items-end justify-between mb-6 border-b border-white/10 pb-2">
        <div>
          <h3 className="font-serif text-2xl text-white italic">Actualités Culturelles</h3>
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold mt-1">
            Cultural News
          </p>
        </div>
        <a className="text-primary text-sm font-bold flex items-center hover:underline" href="#">
          Voir tout{" "}
          <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
        </a>
      </div>

      <div className="columns-2 gap-4 space-y-4">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
