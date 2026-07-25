"use client";

import Link from "next/link";
import type { MagazineArticle } from "@/types";

interface Props {
  articles: MagazineArticle[];
}

export default function MagazineGrid({ articles }: Props) {
  const featured = articles.find((a) => a.featured);
  const secondary = articles.filter((a) => !a.featured);

  return (
    <section className="mt-10 px-4 lg:px-8 lg:max-w-[1600px] lg:mx-auto lg:w-full">
      <div className="flex justify-between items-end mb-6">
        <h3 className="text-xl font-bold tracking-tight uppercase border-l-4 border-[#ff2d2d] pl-3 text-[#F0EDE8]">
          Magazine Culturel
        </h3>
        <Link 
          href="/magazine"
          className="text-primary text-sm font-bold uppercase hover:underline hidden sm:block"
        >
          Voir le magazine complet
        </Link>
      </div>

      {/* ── MOBILE : grille 2 colonnes ── */}
      <div className="lg:hidden grid grid-cols-2 gap-4">
        {featured && (
          <Link href={featured.href} className="col-span-2 relative h-64 rounded-xl overflow-hidden card-glow block">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(to top, rgba(18,16,15,0.9), transparent), url('${featured.image}')` }} />
            <div className="absolute bottom-0 p-4">
              <span className="bg-[#12223ce6] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">{featured.category}</span>
              <h4 className="text-[#F0EDE8] font-bold text-lg mt-1 leading-tight">{featured.title}</h4>
            </div>
          </Link>
        )}
        {secondary.map((article) => (
          <Link key={article.id} href={article.href} className="bg-[#15243ce6] rounded-xl overflow-hidden border border-[#F0EDE8]/5 card-glow block">
            <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
            <div className="p-3">
              <span className="text-[#00A896] text-[9px] font-bold uppercase tracking-tighter">{article.category}</span>
              <h5 className="text-[#F0EDE8] text-sm font-bold mt-1 line-clamp-2">{article.title}</h5>
            </div>
          </Link>
        ))}
      </div>

      {/* ── DESKTOP : layout éditorial 3 colonnes ── */}
      {/*
        Col 1 (large) : article featured vertical
        Col 2 + 3     : articles secondaires en grille 2×2
      */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Featured — colonne gauche pleine hauteur */}
        {featured && (
          <Link href={featured.href} className="col-span-1 relative rounded-2xl overflow-hidden card-glow block min-h-[480px] group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url('${featured.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12100F] via-[#12100F]/40 to-transparent" />
            <div className="absolute bottom-0 p-6 flex flex-col gap-2">
              <span className="bg-[#E63012] text-white text-[10px] font-bold px-3 py-1 rounded uppercase w-fit">
                {featured.category}
              </span>
              <h4 className="text-[#F0EDE8] font-black text-2xl leading-tight">{featured.title}</h4>
              {featured.excerpt && (
                <p className="text-[#8A8178] text-sm line-clamp-3 mt-1">{featured.excerpt}</p>
              )}
              <div className="flex items-center gap-2 mt-3 text-[#E63012] text-sm font-bold">
                <span>Lire l&apos;article</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </Link>
        )}

        {/* Secondaires — 2 colonnes droite */}
        <div className="col-span-2 grid grid-cols-2 gap-5">
          {secondary.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="bg-[#15243ce6] rounded-xl overflow-hidden border border-[#F0EDE8]/5 card-glow block group flex flex-col"
            >
              <div
                className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${article.image}')` }}
              />
              <div className="p-4 flex flex-col gap-1 flex-1">
                <span className="text-[#00A896] text-[10px] font-bold uppercase tracking-wider">
                  {article.category}
                </span>
                <h5 className="text-[#F0EDE8] text-base font-bold leading-snug line-clamp-2">{article.title}</h5>
                {article.excerpt && (
                  <p className="text-[#8A8178] text-xs mt-1 line-clamp-2">{article.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Mobile view all link */}
      <div className="sm:hidden mt-6 text-center">
        <Link 
          href="/magazine"
          className="text-primary text-sm font-bold uppercase hover:underline inline-block"
        >
          Voir le magazine complet
        </Link>
      </div>
    </section>
  );
}
