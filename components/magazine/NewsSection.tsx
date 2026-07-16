import type { NewsArticle } from "@/types/magazine";
import NewsCard from "./NewsCard";

interface Props {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: Props) {
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
