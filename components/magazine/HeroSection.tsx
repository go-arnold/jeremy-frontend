import Image from "next/image";
import Link from "next/link";
import type { HeroArticle } from "@/types/magazine";

interface Props {
  article: HeroArticle;
}

export default function HeroSection({ article }: Props) {
  return (
    <>
      {/* ── Mobile ── */}
      <Link
        href={article.slug ? `/blog/${article.slug}` : "#"}
        className="relative h-[85vh] w-full overflow-hidden block lg:hidden"
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
                  <div className="relative h-10 w-10 rounded-full border-2 border-primary/50 overflow-hidden bg-surface-dark">
                    <Image
                      alt={`Portrait de l'auteur ${article.author.name}`}
                      fill
                      sizes="40px"
                      className="object-cover"
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

      {/* ── Desktop ── */}
      <section className="hidden lg:block relative w-full overflow-hidden" style={{ height: "92vh" }}>
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
          <div className="max-w-[1800px] mx-auto px-8 pb-16 w-full">
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
                    <div className="relative h-12 w-12 rounded-full border-2 border-primary/50 overflow-hidden">
                      <Image
                        alt={article.author.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                        src={article.author.avatarUrl}
                      />
                    </div>
                  )}
                  <div>
                    <span className="text-white text-sm font-semibold block">{article.author.name}</span>
                    <span className="text-accent-gold text-xs">{article.author.role}</span>
                  </div>
                  <div className="ml-auto">
                    <Link
                      href={article.slug ? `/blog/${article.slug}` : "#"}
                      className="flex items-center gap-2 bg-primary hover:bg-[#B8240C] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-primary/20"
                    >
                      <span className="material-symbols-outlined text-lg">article</span>
                      Lire l&apos;article
                    </Link>
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
    </>
  );
}
