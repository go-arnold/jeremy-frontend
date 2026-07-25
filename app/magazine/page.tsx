import { heroArticle as mockedHero, newsArticles as mockedNews, youthItems, radioBanner } from "@/data/magazine";
import { apiFetch, PaginatedResponse } from "@/lib/api-client";
import { mapApiArticleToMagazineHero, mapApiArticleToNewsArticle, type ApiMagazineArticle } from "@/lib/mappers";
import HeroSection from "@/components/magazine/HeroSection";
import NewsSection from "@/components/magazine/NewsSection";
import YouthSection from "@/components/magazine/YouthSection";
import RadioBannerWidget from "@/components/magazine/RadioBannerWidget";
import EditorialNoteWidget from "@/components/magazine/EditorialNoteWidget";
import RadioSidebarWidget from "@/components/magazine/RadioSidebarWidget";
import NewsletterWidget from "@/components/magazine/NewsletterWidget";

export const dynamic = "force-dynamic";

async function getMagazineArticles() {
  try {
    const data = await apiFetch<PaginatedResponse<ApiMagazineArticle>>("/api/v1/articles/?page_size=10");
    if (data.results.length === 0) return null;
    // Featured article (if any) leads as the hero; the rest fill the News grid. Falls back to
    // the first article when nothing is explicitly featured, same convention as Home/Events.
    const featuredIndex = data.results.findIndex((a) => a.is_featured);
    const heroSource = data.results[featuredIndex >= 0 ? featuredIndex : 0];
    const rest = data.results.filter((_, i) => i !== (featuredIndex >= 0 ? featuredIndex : 0));
    return {
      hero: mapApiArticleToMagazineHero(heroSource),
      news: rest.map((a, i) => mapApiArticleToNewsArticle(a, i)),
    };
  } catch (error) {
    console.error("Failed to fetch magazine articles:", error);
    return null;
  }
}

export default async function Page() {
  const real = await getMagazineArticles();
  const heroArticle = real?.hero || mockedHero;
  const newsArticles = real?.news && real.news.length > 0 ? real.news : mockedNews;
  // `youthItems` mixes articles AND podcast episodes under an editorial "Jeunesse" framing that
  // has no equivalent category in the backend (real categories: Culture, Société, Mode,
  // Musique, Arts Visuels, Littérature, Danse) — left as curated static content rather than
  // inventing a fake category mapping, same call as Home's `contentCards` section.

  return (
    <div>
      <HeroSection article={heroArticle} />

      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <main className="lg:hidden pb-24">
        <NewsSection articles={newsArticles} />
        <YouthSection items={youthItems} />

        <section className="px-5 pb-8">
          <div className="rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary rounded-full blur-3xl opacity-20" />
            <NewsletterWidget />
          </div>
        </section>

        <RadioBannerWidget banner={radioBanner} />
      </main>

      {/* ══════════════════════════════════════
          DESKTOP — layout éditorial magazine
      ══════════════════════════════════════ */}
      <main className="hidden lg:block mt-16 pb-16">

        {/* ── Corps : News (large) + Sidebar (fixe) ── */}
        <div className="max-w-[1600px] mx-auto px-8 mt-14">
          <div className="grid grid-cols-[1fr_320px] gap-10 items-start">

            {/* ── Colonne principale ── */}
            <div className="flex flex-col gap-14">

              {/* News grille 3 colonnes */}
              <NewsSection articles={newsArticles} variant="desktop" />

              {/* Séparateur décoratif */}
              <div className="kivu-divider" />

              {/* Youth grille */}
              <YouthSection items={youthItems} />
            </div>

            {/* ── Sidebar sticky ── */}
            <aside className="sticky top-24 flex flex-col gap-6">

              {/* Radio live */}
              <RadioSidebarWidget banner={radioBanner} />

              {/* Newsletter */}
              <NewsletterWidget />

              {/* Article à la une mini */}
              <EditorialNoteWidget />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
