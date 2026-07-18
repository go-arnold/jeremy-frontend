import type { ListenHistoryItem } from "@/types/monProfil";

function HistoryRow({ item }: { item: ListenHistoryItem }) {
  const isPlaying = item.status === "playing";

  return (
    <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
      {/* Thumbnail */}
      <div className={`w-12 h-12 rounded-lg ${item.accentColor} flex items-center justify-center ${item.iconColor} relative overflow-hidden`}>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
          style={{ backgroundImage: `url('${item.coverImage}')` }}
        />
        <span className="material-symbols-outlined relative z-10">{item.icon}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">{item.title}</p>
        {isPlaying ? (
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1 flex-1 bg-surface-dark-highlight rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-text-secondary">{item.timeRemaining}</span>
          </div>
        ) : (
          <p className="text-xs text-text-secondary truncate">{item.subtitle}</p>
        )}
      </div>

      {/* Action button */}
      {isPlaying ? (
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary text-white shadow-glow">
          <span className="material-symbols-outlined text-lg">pause</span>
        </div>
      ) : (
        <div className="h-8 w-8 flex items-center justify-center rounded-full border border-white/10">
          <span className="material-symbols-outlined text-white text-lg">play_arrow</span>
        </div>
      )}
    </div>
  );
}

export default function ListenHistory({ items }: { items: ListenHistoryItem[] }) {
  return (
    <section className="glass-card rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">history</span>
          Historique d&apos;Écoute
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <HistoryRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
