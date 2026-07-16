import type { RadioBanner } from "@/types/magazine";

export default function RadioSidebarWidget({ banner }: { banner: RadioBanner }) {
  if (!banner.isLive) return null;

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, rgba(230,48,18,0.15), rgba(18,34,60,0.8))", border: "1px solid rgba(230,48,18,0.2)" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
        </span>
        <span className="text-primary text-xs font-black uppercase tracking-widest">En Direct</span>
      </div>
      <p className="text-[#F0EDE8] font-bold text-base mb-1">{banner.label}</p>
      <p className="text-[#8A8178] text-xs mb-4">Kivu Radio • Live</p>
      <div className="flex gap-2 items-end mb-3 h-6">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className="w-1 bg-primary rounded-full animate-[bar-bounce_0.8s_ease-in-out_infinite]"
            style={{ height: `${[8, 14, 10, 18, 12, 16, 9][i - 1]}px`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
      <a href="/radio-en-direct" className="flex items-center gap-2 bg-primary hover:bg-[#B8240C] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all w-full justify-center">
        <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>radio</span>
        Écouter maintenant
      </a>
    </div>
  );
}