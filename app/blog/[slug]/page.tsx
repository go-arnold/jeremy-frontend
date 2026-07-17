import { notFound } from "next/navigation";
import { getBlogPost as getMockedBlogPost, getRelatedCards } from "@/data/blog";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { mapApiArticleToBlogPost } from "@/lib/mappers";

import ReadingProgress  from "@/components/blog/ReadingProgress";
import ArticleHero      from "@/components/blog/ArticleHero";
import ArticleMeta      from "@/components/blog/ArticleMeta";
import ArticleBody      from "@/components/blog/ArticleBody";
import ArticleTags      from "@/components/blog/ArticleTags";
import RelatedPosts     from "@/components/blog/RelatedPosts";
import CommentsSection  from "@/components/blog/CommentsSection";
import ArticleEngagementButtons from "@/components/blog/ArticleEngagementButtons";
import ShareWidget from "@/components/blog/ShareWidget";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticle(slug: string) {
  try {
    const data = await apiFetch<any>(`/api/v1/articles/${slug}/`);
    return mapApiArticleToBlogPost(data);
  } catch (error) {
    console.error(`Failed to fetch article ${slug}:`, error);
    return null;
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Try API first
  let post = await getArticle(slug);
  
  // Fallback to mocked data
  if (!post) {
    post = getMockedBlogPost(slug) as any;
  }
  
  if (!post) notFound();

  const related = getRelatedCards(post.relatedPosts);

  return (
    <div className="relative flex flex-col w-full min-h-screen overflow-x-hidden">
      <ReadingProgress />

      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <div className="lg:hidden pt-20 max-w-md mx-auto w-full">
        <ArticleHero post={post} />
        <main className="relative z-10 px-5 pt-3 -mt-6 rounded-t-3xl min-h-screen pb-28">
          <ArticleMeta post={post} />
          <ArticleBody blocks={post.blocks} />
          <ArticleTags tags={post.tags} />
          <div className="h-px w-full bg-white/10 my-8" />
          <RelatedPosts posts={related} />
          <CommentsSection slug={post.slug} comments={post.comments} />
        </main>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP — layout article magazine
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-full">

        {/* Hero pleine largeur */}
        <ArticleHeroDesktop post={post} />

        {/* Corps : article + sidebar */}
        <div className="max-w-7xl mx-auto px-8 w-full mt-12 pb-20">
          <div className="grid grid-cols-[1fr_320px] gap-12 items-start">

            {/* ── Article principal ── */}
            <article>
              {/* Meta auteur */}
              <ArticleMetaDesktop post={post} />

              {/* Corps */}
              <ArticleBody blocks={post.blocks} />

              {/* Tags */}
              <ArticleTags tags={post.tags} />

              <div className="h-px w-full bg-white/10 my-10" />

              {/* Articles liés — grille desktop */}
              <RelatedPostsDesktop posts={related} />

              <div className="h-px w-full bg-white/10 my-10" />

              {/* Commentaires */}
              <CommentsSection slug={post.slug} comments={post.comments} />
            </article>

            {/* ── Sidebar sticky ── */}
            <aside className="sticky top-24 flex flex-col gap-5">

              {/* Auteur */}
              <AuthorCard post={post} />

              {/* Table des matières */}
              <TableOfContents blocks={post.blocks} />

              {/* Partager */}
              <ShareWidget title={post.title} slug={post.slug} />

              {/* Article lié mis en avant */}
              {related[0] && (
                <Link
                  href={`/blog/${related[0].slug}`}
                  className="group block rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div
                    className="w-full aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${related[0].image}')` }}
                  />
                  <div className="p-4" style={{ background: "rgba(18,34,60,0.7)" }}>
                    <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-1">
                      À lire aussi
                    </span>
                    <h4 className="text-[#F0EDE8] text-sm font-bold leading-snug group-hover:text-primary transition-colors">
                      {related[0].title}
                    </h4>
                  </div>
                </Link>
              )}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP (uniquement)
════════════════════════════════════════════════════ */

import type { BlogPost, BlogCard, ArticleBlock } from "@/types/blog";

// ── Hero desktop ────────────────────────────────────
function ArticleHeroDesktop({ post }: { post: BlogPost }) {
  return (
    <div className="relative w-full overflow-hidden mt-16" style={{ height: "75vh" }}>
      {/* Cover */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url('${post.coverImage}')` }}
      />

      {/* Gradients : bas + gauche */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#12100F] via-[#12100F]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#12100F]/60 via-transparent to-transparent" />

      {/* Bouton retour */}
      <div className="absolute top-6 left-8 z-20">
        <Link
          href="/blog"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/30 backdrop-blur-md text-white hover:bg-white/10 transition-colors font-bold text-sm"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Blog
        </Link>
      </div>

      {/* Contenu bas — aligné sur max-w-7xl */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-8 pb-12">
          <div className="max-w-[65%] flex flex-col gap-4">

            {/* Catégories */}
            <div className="flex gap-2 flex-wrap">
              {post.categories.map((cat, i) => (
                <span
                  key={cat}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white rounded-full ${
                    i === 0
                      ? "bg-primary shadow-lg shadow-primary/30"
                      : "bg-white/10 backdrop-blur-md border border-white/15"
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Titre */}
            <h1 className="text-4xl xl:text-5xl font-black leading-tight text-white">
              {post.title}
            </h1>

            {/* Meta inline */}
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-primary/50"
                  style={{ backgroundImage: `url('${post.author.avatar}')` }}
                />
                <span className="font-bold text-white">Par {post.author.name}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span>{post.author.publishedAt}</span>
              <span className="w-1 h-1 rounded-full bg-gray-500" />
              <span className="flex items-center gap-1 text-primary font-bold">
                <span className="material-symbols-outlined text-sm">schedule</span>
                {post.readTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ArticleMeta desktop ─────────────────────────────
function ArticleMetaDesktop({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/10 mb-3 mt-3">
      <div className="flex items-center gap-3">
        <div
          className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-primary/30"
          style={{ backgroundImage: `url('${post.author.avatar}')` }}
        />
        <div>
          <span className="text-base font-bold text-white block">Par {post.author.name}</span>
          <span className="text-sm text-[#8A8178]">{post.author.publishedAt}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-primary text-sm font-bold"
          style={{ background: "rgba(230,48,18,0.1)", border: "1px solid rgba(230,48,18,0.2)" }}
        >
          <span className="material-symbols-outlined text-sm">schedule</span>
          {post.readTime}
        </div>
        <ArticleEngagementButtons slug={post.slug} title={post.title} initialLikeCount={post.likeCount || 0} />
      </div>
    </div>
  );
}

// ── RelatedPosts desktop — grille 3 colonnes ────────
function RelatedPostsDesktop({ posts }: { posts: BlogCard[] }) {
  if (!posts.length) return null;

  return (
    <section className="mb-10">
      <h3 className="text-2xl font-black text-white mb-6">Vous aimerez aussi</h3>
      <div className="grid grid-cols-3 gap-5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all"
            style={{ background: "rgba(18,34,60,0.5)" }}
          >
            <div
              className="w-full aspect-video bg-cover bg-center transition-transform duration-500 group-hover:scale-105 overflow-hidden"
              style={{ backgroundImage: `url('${post.image}')` }}
            />
            <div className="p-4">
              <span className="text-[10px] font-black text-primary uppercase tracking-wider block mb-1">
                {post.category}
              </span>
              <h4 className="text-[#F0EDE8] text-sm font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ── Sidebar : Auteur ────────────────────────────────
function AuthorCard({ post }: { post: BlogPost }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col items-center gap-3 text-center"
      style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div
        className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-primary/40"
        style={{ backgroundImage: `url('${post.author.avatar}')` }}
      />
      <div>
        <p className="text-[#F0EDE8] font-bold text-base">{post.author.name}</p>
        <p className="text-[#8A8178] text-xs mt-0.5">Rédacteur • Art du Kivu</p>
      </div>
      <button className="w-full py-2 rounded-xl border border-primary/30 text-primary text-sm font-bold hover:bg-primary/10 transition-colors">
        Voir les articles
      </button>
    </div>
  );
}

// ── Sidebar : Table des matières ────────────────────
function TableOfContents({ blocks }: { blocks: ArticleBlock[] }) {
  const quotes = blocks.filter((b) => b.type === "quote");
  if (!quotes.length) return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-4">
        À retenir
      </p>
      <div className="flex flex-col gap-3">
        {quotes.slice(0, 2).map((q, i) => (
          <div
            key={i}
            className="flex gap-3 p-3 rounded-xl"
            style={{ background: "rgba(230,48,18,0.06)", borderLeft: "2px solid rgba(230,48,18,0.4)" }}
          >
            <p className="text-[#F0EDE8]/80 text-xs italic leading-relaxed line-clamp-3">
              "{q.content}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

