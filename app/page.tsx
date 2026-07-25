import HeroSection     from "@/components/home/HeroSection";
import NewsCarousel    from "@/components/home/NewsCarousel";
import ContentCarousel from "@/components/home/ContentCarousel";
import HitsList        from "@/components/home/HitsList";
import Top10Card       from "@/components/home/Top10Card";
import MagazineGrid    from "@/components/home/MagazineGrid";
import { apiFetch } from "@/lib/api-client";
import {
  mapApiBannerToHero,
  mapApiALaUneToNewsCards,
  mapApiHitToTrack,
  mapApiMagazineArticle,
  mapApiContentAUneToContentCard,
  type ApiMagazineArticle,
} from "@/lib/mappers";
import type { ApiHeroBanner, ApiALaUne, ApiHit, ApiContentAUneItem } from "@/lib/api-types";

interface ApiHomeData {
  banner?: ApiHeroBanner;
  a_la_une?: ApiALaUne;
  hits_du_mois?: ApiHit[];
  hits_du_mois_period?: string;
  contenus_a_la_une?: ApiContentAUneItem[];
  magazine?: {
    hero?: ApiMagazineArticle;
    articles?: ApiMagazineArticle[];
  };
}

import {
  heroData as mockedHero,
  newsCards as mockedNews,
  contentCards as mockedContent,
  hitsOfMonth as mockedHits,
  top10 as mockedTop10,
  magazineArticles as mockedMagazine,
} from "@/data/home";

// ISR — refetches at most every 60s instead of freezing at build time forever (this page had no
// revalidation window at all before, so content added via the backend admin never showed up in
// production without a full redeploy).
export const revalidate = 60;

async function getHomeData() {
  try {
    // According to YAML, /api/v1/home/ returns aggregated payload.
    // No explicit cacheTime override — uses apiFetch's own default (60s), matching this page's
    // `revalidate = 60` above. The previous 15-minute override here defeated the point of ISR:
    // the page would "revalidate" every 60s but keep serving this same in-memory response for
    // up to 15 minutes regardless.
    const data = await apiFetch<ApiHomeData>("/api/v1/home/");
    return data;
  } catch (error) {
    console.error("Failed to fetch home data:", error);
    return null;
  }
}

export default async function HomePage() {
  const homeData = await getHomeData();

  // API returns: { banner, a_la_une, hits_du_mois, magazine: { hero, articles } }
  // Map each field using the correct mapper, fall back to mocked data gracefully
  const heroData = mapApiBannerToHero(homeData?.banner, mockedHero);

  // a_la_une → news cards carousel (artist of month, podcast, event)
  const newsCards = homeData?.a_la_une
    ? mapApiALaUneToNewsCards(homeData.a_la_une)
    : mockedNews;
  const displayNews = newsCards.length > 0 ? newsCards : mockedNews;

  // hits_du_mois → HitsList + Top10Card
  const hitsRaw: ApiHit[] = homeData?.hits_du_mois || [];
  const hitsOfMonth = hitsRaw.length > 0
    ? hitsRaw.map((h, i) => mapApiHitToTrack(h, i))
    : mockedHits;
  const top10 = hitsRaw.length > 0
    ? hitsRaw.slice(0, 10).map((h, i) => mapApiHitToTrack(h, i))
    : mockedTop10;

  // magazine → MagazineGrid
  const magArticlesRaw: ApiMagazineArticle[] = [
    ...(homeData?.magazine?.hero ? [homeData.magazine.hero] : []),
    ...(homeData?.magazine?.articles || []),
  ];
  const magazineArticles = magArticlesRaw.length > 0
    ? magArticlesRaw.map(mapApiMagazineArticle)
    : mockedMagazine;

  // contenus_a_la_une → ContentCarousel
  const contentAUneRaw: ApiContentAUneItem[] = homeData?.contenus_a_la_une || [];
  const contentCards = contentAUneRaw.length > 0
    ? contentAUneRaw.map(mapApiContentAUneToContentCard)
    : mockedContent;

  const hitsPeriod = homeData?.hits_du_mois_period || "JUIN 2026";

  return (
    
    <div className="flex flex-col w-full">

      {/* ─── Hero pleine largeur ─── */}
      <HeroSection data={heroData} />

      {/*
        Sections internes : centrées avec max-w-[1600px] sur desktop
        Chaque composant gère son propre lg:max-w-[1600px] lg:mx-auto lg:px-8
      */}


      <NewsCarousel cards={displayNews} />

      <ContentCarousel cards={contentCards} />

      {/* ── Hits + Top 10 côte à côte sur desktop ── */}
      <div className="
        mt-10 px-4
        lg:px-8 lg:max-w-[1600px] lg:mx-auto lg:w-full
        lg:grid lg:grid-cols-[1fr_360px] lg:gap-10 lg:items-start
      ">
        <section>
          <HitsList
            tracks={hitsOfMonth}
            title="Hits du Mois"
            subtitle="Goma Vibes"
            seeAllHref="/top-morceaux"
          />
        </section>

        {/* Top10 collé en sticky sur desktop */}
        <aside className="hidden lg:block">
          <Top10Card
            tracks={top10}
            period={hitsPeriod}
            seeAllHref="/top-artistes"
          />
        </aside>
      </div>

      {/* Top10 mobile uniquement */}
      <div className="lg:hidden">
        <Top10Card
          tracks={top10}
          period={hitsPeriod}
          seeAllHref="/top-artistes"
        />
      </div>

      <MagazineGrid articles={magazineArticles} />

      {/* Espace bas de page */}
      <div className="h-10" />
    </div>
  );
}
