import type { NowPlaying } from "@/types/liveMusic";

export default function NowPlayingHeroDesktop({ track }: { track: NowPlaying }) {
  return (
    <div className="flex flex-col items-center gap-6">

      {/* Badge live */}
      <div className="flex items-center gap-2 bg-black/40 border border-primary/30 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-[0_0_15px_rgba(230,48,18,0.2)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <span className="text-primary text-[11px] font-bold tracking-widest uppercase">En direct</span>
      </div>

      {/* Cover art — plus grand sur desktop */}
      <div className="relative w-full aspect-square group">
        {/* Couches décoratives */}
        <div className="absolute inset-0 border border-white/10 rounded-[2rem] rotate-6 scale-95 transition-transform duration-700 group-hover:rotate-12 bg-[#181012]" />
        <div className="absolute inset-0 border border-primary/20 rounded-[2rem] -rotate-3 scale-95 transition-transform duration-700 group-hover:-rotate-6 bg-[#181012]" />

        {/* Image principale */}
        <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10"
          style={{ boxShadow: "0 0 40px rgba(230,48,18,0.15), 0 25px 60px rgba(0,0,0,0.6)" }}
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
            style={{ backgroundImage: `url('${track.coverImage}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Waveform */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center items-end gap-1.5 h-12 px-8">
            {[
              { dur: "0.8s", delay: "0s" },
              { dur: "1.1s", delay: "0.1s" },
              { dur: "1.3s", delay: "0.2s" },
              { dur: "0.9s", delay: "0.3s" },
              { dur: "1.2s", delay: "0.4s" },
              { dur: "0.8s", delay: "0.5s" },
            ].map((bar, i) => (
              <div
                key={i}
                className="w-1.5 bg-primary rounded-t-sm animate-[bar-bounce_0.8s_ease-in-out_infinite]"
                style={{ animationDuration: bar.dur, animationDelay: bar.delay }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Infos titre */}
      <div className="text-center w-full">
        <h2 className="text-2xl font-extrabold text-white mb-1 leading-tight tracking-tight">
          {track.title}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-[#8A8178] font-medium">avec</span>
          <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded-md">
            {track.djName}
          </span>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center gap-4 w-full">
        <button className="text-[#8A8178] hover:text-white transition-colors p-2 active:scale-90">
          <span className="material-symbols-outlined text-[28px] font-light">skip_previous</span>
        </button>
        <button className="text-[#8A8178] hover:text-white transition-colors p-2 active:scale-90">
          <span className="material-symbols-outlined text-[32px] font-light">replay_10</span>
        </button>
        <button className="relative flex items-center justify-center w-20 h-20 rounded-full bg-primary text-white hover:scale-105 active:scale-95 transition-all duration-300 group"
          style={{ boxShadow: "0 0 30px rgba(230,48,18,0.4)" }}
        >
          <div className="absolute inset-0 rounded-full border border-white/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
          <span className="material-symbols-outlined text-[48px] ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
        </button>
        <button className="text-[#8A8178] hover:text-white transition-colors p-2 active:scale-90">
          <span className="material-symbols-outlined text-[32px] font-light">forward_30</span>
        </button>
        <button className="text-[#8A8178] hover:text-white transition-colors p-2 active:scale-90">
          <span className="material-symbols-outlined text-[28px] font-light">skip_next</span>
        </button>
      </div>

      {/* Barre de volume desktop */}
      <div className="flex items-center gap-3 w-full px-2">
        <span className="material-symbols-outlined text-[#8A8178] text-sm">volume_down</span>
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-primary rounded-full" />
        </div>
        <span className="material-symbols-outlined text-[#8A8178] text-sm">volume_up</span>
      </div>

      {/* Actions secondaires */}
      <div className="flex gap-3 w-full justify-center">
        {[
          { icon: "share", label: "Partager" },
          { icon: "bookmark_border", label: "Sauvegarder" },
          { icon: "notifications", label: "Alertes" },
        ].map((action) => (
          <button
            key={action.icon}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-[#8A8178] hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">{action.icon}</span>
            <span className="text-[10px] font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}