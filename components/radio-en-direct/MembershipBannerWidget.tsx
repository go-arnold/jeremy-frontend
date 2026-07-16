import type { MembershipBanner } from "@/types/radio";

interface Props {
  banner: MembershipBanner;
}

export default function MembershipBannerWidget({ banner }: Props) {
  return (
    <section className="px-4 mt-4 lg:px-0 lg:mt-0">
      {/* ── Mobile ── */}
      <div className="lg:hidden bg-primary rounded-2xl p-5 flex items-center justify-between overflow-hidden relative">
        <div className="absolute -right-4 -top-4 opacity-20">
          <span className="material-symbols-outlined !text-[120px] text-white">campaign</span>
        </div>
        <div className="relative z-10 space-y-1">
          <h4 className="text-white font-extrabold text-lg leading-tight uppercase">{banner.title}</h4>
          <p className="text-white/80 text-xs">{banner.subtitle}</p>
          <button className="mt-2 bg-white text-primary px-4 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
            {banner.ctaLabel}
          </button>
        </div>
      </div>

      {/* ── Desktop : bannière panoramique ── */}
      <div className="hidden lg:flex items-center justify-between rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(135deg, #070727 0%, #2e130f 50%, #0D2347 100%)",
          padding: "2rem 3rem",
        }}
      >
        {/* Déco fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <span className="material-symbols-outlined absolute -right-6 -top-6 opacity-10 text-white"
            style={{ fontSize: "200px" }}>campaign</span>
          <div className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)" }} />
        </div>

        {/* Gauche : texte */}
        <div className="relative z-10 flex flex-col gap-2 max-w-lg">
          <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Membres exclusifs</span>
          <h4 className="text-white font-black text-2xl xl:text-3xl leading-tight uppercase">
            {banner.title}
          </h4>
          <p className="text-white/75 text-sm leading-relaxed">{banner.subtitle}</p>
        </div>

        {/* Droite : CTA */}
        <div className="relative z-10 shrink-0 flex items-center gap-4">
          <div className="text-right">
            <p className="text-white/50 text-xs font-medium">Accès anticipé</p>
            <p className="text-white font-black text-lg">Rejoindre maintenant</p>
          </div>
          <button className="bg-white text-[#E63012] px-6 py-3 rounded-xl font-extrabold uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-transform text-sm whitespace-nowrap">
            {banner.ctaLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
