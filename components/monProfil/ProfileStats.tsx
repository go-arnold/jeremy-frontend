import type { ProfileStat } from "@/types/monProfil";

export default function ProfileStats({ stats }: { stats: ProfileStat[] }) {
  return (
    <section className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1 group hover:border-primary/30 transition-colors"
        >
          <span className="text-2xl font-bold text-white">{stat.value}</span>
          <span className="text-[10px] uppercase tracking-wider text-text-secondary font-semibold">
            {stat.label}
          </span>
        </div>
      ))}
    </section>
  );
}
