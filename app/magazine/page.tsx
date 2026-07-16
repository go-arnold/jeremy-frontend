import { heroArticle, newsArticles, youthItems, radioBanner } from "@/data/magazine";
import HeroSection from "@/components/magazine/HeroSection";
import NewsSection from "@/components/magazine/NewsSection";
import YouthSection from "@/components/magazine/YouthSection";
import RadioBannerWidget from "@/components/magazine/RadioBannerWidget";
import EditorialNoteWidget from "@/components/magazine/EditorialNoteWidget";
import HeroSectionDesktop from "@/components/magazine/HeroSectionDesktop";
import NewsSectionDesktop from "@/components/magazine/NewsSectionDesktop";
import YouthSectionDesktop from "@/components/magazine/YouthSectionDesktop";
import RadioSidebarWidget from "@/components/magazine/RadioSidebarWidget";
import NewsletterWidget from "@/components/magazine/NewsletterWidget";


export default function Page() {
  return (
    <div>
      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <main className="lg:hidden pb-24">
        <HeroSection article={heroArticle} />
        <NewsSection articles={newsArticles} />
        <YouthSection items={youthItems} />

        <section className="px-5 pb-8">
          <div className="rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary rounded-full blur-3xl opacity-20" />
            <h3 className="font-serif text-xl text-white mb-2">Restez Connecté</h3>
            <p className="text-gray-400 text-sm mb-4">
              Abonnez-vous à notre newsletter hebdomadaire.{" "}
              <br />
              <em className="text-gray-500">Subscribe to our weekly newsletter.</em>
            </p>
            <div className="flex gap-2">
              <input
                className="bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white text-sm w-full focus:ring-1 focus:ring-primary focus:border-primary outline-none placeholder:text-gray-600"
                placeholder="Email address"
                type="email"
              />
              <button className="bg-primary text-white rounded-lg px-4 flex items-center justify-center">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </section>

        <RadioBannerWidget banner={radioBanner} />
      </main>

      {/* ══════════════════════════════════════
          DESKTOP — layout éditorial magazine
      ══════════════════════════════════════ */}
      <main className="hidden lg:block mt-16 pb-16">

        {/* ── Hero desktop pleine largeur ── */}
        <HeroSectionDesktop article={heroArticle} />

        {/* ── Corps : News (large) + Sidebar (fixe) ── */}
        <div className="max-w-7xl mx-auto px-8 mt-14">
          <div className="grid grid-cols-[1fr_320px] gap-10 items-start">

            {/* ── Colonne principale ── */}
            <div className="flex flex-col gap-14">

              {/* News grille 3 colonnes */}
              <NewsSectionDesktop articles={newsArticles} />

              {/* Séparateur décoratif */}
              <div className="kivu-divider" />

              {/* Youth grille */}
              <YouthSectionDesktop items={youthItems} />
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


