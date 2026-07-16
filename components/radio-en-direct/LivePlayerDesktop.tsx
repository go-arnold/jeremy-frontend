import type { LiveShow } from "@/types/radio";

 export default function LivePlayerDesktop({ show }: { show: LiveShow }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl group"
      style={{ minHeight: "600px" }}>

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url('${show.imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#12223c] via-[#12223c]/60 to-transparent" />
      {/* Gradient latéral gauche pour le texte */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#12223c]/80 via-transparent to-transparent" />

      {/* Top badges */}
      <div className="absolute top-6 left-6 z-10 flex gap-3 items-center">
        <div className="flex h-9 items-center gap-2 rounded-xl bg-[#E63012] px-4 shadow-lg shadow-[#E63012]/30">
          <span className="flex h-2 w-2 rounded-full bg-white animate-pulse" />
          <p className="text-[11px] font-black tracking-widest uppercase text-white">EN DIRECT</p>
        </div>
        <div className="flex h-9 items-center gap-2 px-3 rounded-xl bg-black/30 backdrop-blur-sm border border-white/10">
          <span className="material-symbols-outlined text-white text-sm">group</span>
          <p className="text-white text-sm font-bold">{show.listenerCount}</p>
        </div>
      </div>

      {/* Contenu bas */}
      <div className="absolute bottom-0 left-0 right-0 p-8 space-y-6">
        {/* Info émission */}
        <div>
          <p className="text-[#E63012] text-xs font-bold uppercase tracking-widest mb-2">On Air Now</p>
          <h2 className="text-white text-4xl xl:text-5xl font-black leading-tight tracking-tight">
            {show.title}
          </h2>
          <p className="text-[#F0EDE8]/70 text-xl font-medium mt-1">{show.host}</p>
        </div>

        {/* Contrôles player */}
        <div className="flex items-center gap-6">
          {/* Bouton play */}
          <button className="flex shrink-0 items-center justify-center rounded-full w-20 h-20 bg-[#E63012] text-white shadow-xl shadow-[#E63012]/30 hover:scale-105 active:scale-95 transition-transform">
            <span
              className="material-symbols-outlined !text-5xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {show.isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>

          {/* Barre de progression + waveform */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-white text-xs font-bold tracking-widest uppercase">Flux en direct</p>
              {/* Waveform animée */}
              <div className="flex gap-1 items-end h-5">
                {[0.1, 0.2, 0.3, 0.4, 0.5, 0.15, 0.35].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#E63012] rounded-full animate-bounce"
                    style={{
                      height: `${[12, 18, 10, 20, 14, 16, 8][i]}px`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Progress bar */}
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-[#E63012] w-3/4 rounded-full relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
              </div>
            </div>
            {/* Volume */}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-white/40 text-sm">volume_down</span>
              <div className="flex-1 h-1 bg-white/20 rounded-full">
                <div className="h-full bg-white/60 w-2/3 rounded-full" />
              </div>
              <span className="material-symbols-outlined text-white/40 text-sm">volume_up</span>
            </div>
          </div>

          {/* Actions secondaires */}
          <div className="flex flex-col gap-3">
            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white">
              <span className="material-symbols-outlined text-lg">share</span>
            </button>
            <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white/70 hover:text-white">
              <span className="material-symbols-outlined text-lg">bookmark</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}