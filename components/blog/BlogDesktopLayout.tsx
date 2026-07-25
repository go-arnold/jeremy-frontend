"use client";

import Link from "next/link";
import type { BlogCard, BlogCategory } from "@/types/blog";
import ContentImage from "@/components/ui/ContentImage";

interface Props {
  featured?: BlogCard & { author?: string };
  posts: BlogCard[];
  categories: BlogCategory[];
  active: BlogCategory;
  onCategoryChange: (category: BlogCategory) => void;
}

export default function BlogDesktopLayout({ featured, posts, categories, active, onCategoryChange }: Props) {
  const gridPosts = featured ? posts.filter((post) => post.id !== featured.id) : posts;
  // Article mis en avant dans la sidebar (2e article de la liste)
  const sidebarHighlight = gridPosts[0];
  const sidebarSecondary = gridPosts.slice(1, 4);

  return (
    <div className="mx-auto px-8 w-full">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between py-10 border-b border-white/10 mb-10">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-primary mb-2">
            Art du Kivu
          </p>
          <h1 className="text-5xl font-black text-[#F0EDE8] leading-tight">
            Le <span className="text-primary">Blog</span>
          </h1>
          <p className="text-[#8A8178] mt-2 text-base">
            Culture, musique et actualités du Kivu
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#8A8178] text-sm">{posts.length + (featured ? 1 : 0)} articles</span>
        </div>
      </div>

      {/* ── Ligne 1 : Featured hero (60%) + Articles sidebar (40%) ── */}
      {featured && (
        <div className="grid grid-cols-[3fr_2fr] gap-6 mb-12">

          {/* Featured grande carte */}
          <Link href={`/blog/${featured.slug}`} className="group block">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <ContentImage
                src={featured.image}
                alt={featured.title}
                className="absolute inset-0"
                imageClassName="transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1280px) 60vw, 900px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12223c] via-[#12223c]/30 to-transparent" />
              {/* Badge */}
              <div className="absolute top-5 left-5 flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-primary text-white text-xs font-black tracking-wide uppercase">
                  À la une
                </span>
              </div>
              {/* Contenu bas */}
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col gap-3">
                <h2 className="font-display font-black text-4xl leading-tight text-white max-w-xl">
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-gray-300 text-base line-clamp-2 max-w-lg leading-relaxed">
                    {featured.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  {featured.author && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-sm">face</span>
                      Par {featured.author}
                    </span>
                  )}
                  {featured.readTime && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-500" />
                      <span className="text-primary font-bold">{featured.readTime}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>

          {/* Sidebar articles en avant */}
          <div className="flex flex-col gap-4">
            {/* Article mis en avant */}
            {sidebarHighlight && (
              <Link href={`/blog/${sidebarHighlight.slug}`} className="group block flex-1">
                <div
                  className="relative rounded-xl overflow-hidden"
                  style={{ height: "200px" }}
                >
                  <ContentImage
                    src={sidebarHighlight.image}
                    alt={sidebarHighlight.title}
                    className="absolute inset-0"
                    imageClassName="transition-transform duration-500 group-hover:scale-105"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 p-4">
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-1">
                      {sidebarHighlight.category}
                    </span>
                    <h3 className="text-white font-bold text-base leading-tight line-clamp-2">
                      {sidebarHighlight.title}
                    </h3>
                  </div>
                </div>
              </Link>
            )}

            {/* Articles secondaires — liste compacte */}
            <div className="flex flex-col gap-0 divide-y divide-white/5">
              {sidebarSecondary.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex items-start gap-3 py-3 hover:bg-white/3 transition-colors rounded-lg px-1"
                >
                  <ContentImage
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 rounded-lg shrink-0"
                    sizes="64px"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-0.5">
                      {post.category}
                    </span>
                    <h4 className="text-[#F0EDE8] text-sm font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                    {post.publishedAt && (
                      <span className="text-[#8A8178] text-[10px] mt-0.5 block">{post.publishedAt}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Ligne 2 : Grille filtrée (large) + Sidebar sticky (narrow) ── */}
      <div className="grid grid-cols-[1fr_300px] gap-10 items-start">

        {/* ── Colonne principale ── */}
        <div>
          {/* Filtres tabs */}
          <div className="flex items-center gap-1 border-b border-white/10 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`relative px-4 py-3 text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  active === cat
                    ? "text-white"
                    : "text-[#8A8178] hover:text-[#F0EDE8]"
                }`}
              >
                {cat === "Tous" ? "Tout" : cat}
                {active === cat && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
            <span className="ml-auto text-[#8A8178] text-xs font-medium pb-3">
              {posts.length} article{posts.length > 1 ? "s" : ""}
            </span>
          </div>

          {/* Grille 3 colonnes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {gridPosts.map((post) => (
              <BlogCardDesktop key={post.id} post={post} />
            ))}
          </div>

          {gridPosts.length === 0 && (
            <div className="flex flex-col items-center py-20 gap-3 text-center">
              <span className="material-symbols-outlined text-[#4A443E] text-5xl">article</span>
              <p className="text-[#8A8178] text-sm">Aucun article dans cette catégorie.</p>
            </div>
          )}
        </div>

        {/* ── Sidebar sticky ── */}
        <aside className="sticky top-24 flex flex-col gap-5">

          {/* Newsletter */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(230,48,18,0.12), rgba(18,34,60,0.8))",
              border: "1px solid rgba(230,48,18,0.2)",
            }}
          >
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-20 h-20 bg-primary rounded-full blur-3xl opacity-20 pointer-events-none" />
            <span className="material-symbols-outlined text-primary text-3xl block mb-3">mail</span>
            <h3 className="text-[#F0EDE8] font-black text-base mb-1">Restez Connecté</h3>
            <p className="text-[#8A8178] text-xs mb-4 leading-relaxed">
              L&apos;actualité culturelle du Kivu, directement dans votre boîte.
            </p>
            <input
              type="email"
              placeholder="votre@email.com"
              className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary mb-2 transition-all"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
            <button className="w-full py-2.5 bg-primary hover:bg-[#B8240C] text-white font-bold rounded-xl text-sm transition-all">
              S&apos;abonner
            </button>
          </div>

          {/* Catégories populaires */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
              Catégories
            </h3>
            <div className="flex flex-col gap-1">
              {categories.filter(c => c !== "Tous").map((cat) => {
                const count = posts.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      active === cat
                        ? "bg-primary/15 text-primary border border-primary/25"
                        : "text-[#8A8178] hover:text-[#F0EDE8] hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-xs font-black rounded-full px-1.5 py-0.5 min-w-[22px] text-center ${
                      active === cat ? "bg-primary/20 text-primary" : "bg-white/5 text-[#4A443E]"
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Article récent mis en avant */}
          {posts[posts.length - 1] && (
            <Link
              href={`/blog/${posts[posts.length - 1].slug}`}
              className="group block rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <ContentImage
                src={posts[posts.length - 1].image}
                alt={posts[posts.length - 1].title}
                className="w-full aspect-video"
                imageClassName="transition-transform duration-500 group-hover:scale-105"
                sizes="300px"
              />
              <div
                className="p-4"
                style={{ background: "rgba(18,34,60,0.7)" }}
              >
                <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-1">
                  {posts[posts.length - 1].category}
                </span>
                <h4 className="text-[#F0EDE8] text-sm font-bold leading-snug group-hover:text-primary transition-colors">
                  {posts[posts.length - 1].title}
                </h4>
              </div>
            </Link>
          )}
        </aside>
      </div>
    </div>
  );
}

// ── BlogCard desktop 3 colonnes ─────────────────────
function BlogCardDesktop({ post }: { post: BlogCard }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300"
      style={{ background: "rgba(18,34,60,0.5)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video">
        <ContentImage
          src={post.image}
          alt={post.title}
          className="absolute inset-0"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 1280px) 33vw, 360px"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-[10px] font-black text-white uppercase tracking-wider">
            {post.category}
          </span>
        </div>
      </div>

      {/* Texte */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="text-[#F0EDE8] font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[#8A8178] text-xs leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
          {post.publishedAt && (
            <span className="text-[#4A443E] text-[10px]">{post.publishedAt}</span>
          )}
          {post.readTime && (
            <span className="text-primary text-[10px] font-bold">{post.readTime}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
