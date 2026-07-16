import type { Badge } from "@/types/monProfil";

function BadgeItem({ badge }: { badge: Badge }) {
  if (!badge.unlocked) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 flex-1 p-2 rounded-xl border border-dashed border-white/10 opacity-50">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <span className="material-symbols-outlined text-sm">lock</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 flex-1 p-2 rounded-xl bg-gradient-to-b from-surface-dark-highlight to-transparent border border-white/5">
      <div
        className={`w-10 h-10 rounded-full bg-[#111317] flex items-center justify-center ${badge.color}`}
        style={{ boxShadow: `0 0 10px ${badge.glowColor}` }}
      >
        {badge.iconUrl ? (
          <img src={badge.iconUrl} alt="" className="w-5 h-5 object-contain" />
        ) : (
          <span className="material-symbols-outlined">{badge.icon}</span>
        )}
      </div>
      <span className="text-[10px] font-bold text-center leading-tight whitespace-pre-line">
        {badge.label}
      </span>
    </div>
  );
}

export default function Accomplishments({
  badges,
  totalUnlocked,
}: {
  badges: Badge[];
  totalUnlocked: number;
}) {
  return (
    <section className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Accomplissements</h3>
        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-md">
          {totalUnlocked} Obtenus
        </span>
      </div>
      <div className="flex gap-3 justify-between">
        {badges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  );
}
