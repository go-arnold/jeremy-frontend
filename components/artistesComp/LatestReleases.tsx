import Link from "next/link";
import type { Release } from "@/types/artistes";

interface Props {
  releases: Release[];
}

export default function LatestReleases({ releases }: Props) {
  return (
    <section className="flex flex-col">
      <div className="flex items-center justify-between px-5 pb-4 pt-10">
        <h3 className="font-display text-xl font-bold text-white tracking-tight">
          Dernieres Sorties
        </h3>
        <Link href="#" className="text-secondary-accent text-sm font-medium">
          Voir tout
        </Link>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar pb-4 pl-5">
        <div className="flex gap-4 pr-5 min-w-max">
          {releases.map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReleaseCard({ release }: { release: Release }) {
  return (
    <div className="group relative flex w-[85vw] md:w-[380px] bg-surface-dark rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-white/10 transition-colors">
      {/* Pochette */}
      <div
        className="w-32 shrink-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${release.coverImage}')` }}
      >
        <div className="w-full h-full flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
          <span className="material-symbols-outlined text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
            play_circle
          </span>
        </div>
      </div>

      {/* Infos */}
      <div className="flex flex-col justify-center p-4 flex-1 bg-[#12223ce6]">
        <span className="text-secondary-accent text-xs font-bold tracking-wider mb-1">
          {release.year} • {release.type}
        </span>
        <h4 className="font-display text-white text-lg font-bold leading-tight mb-1 truncate">
          {release.title}
        </h4>
        <p className="text-gray-400 text-sm mb-3 truncate">
          {release.featuring ?? release.producer}
        </p>
        <div className="flex items-center gap-3">
          <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-colors">
            <span className="material-symbols-outlined text-lg">play_arrow</span>
          </button>
          <button className="size-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined text-lg">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
