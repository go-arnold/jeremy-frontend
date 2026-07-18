import Link from "next/link";
import type { DocVideo } from "@/types/webtv";

interface Props {
  concerts: DocVideo[];
  /** The parent page already splits its whole layout into a mobile `<main>` and a desktop
   * `<main>` (each individually shown/hidden via `lg:`), so rendering both variants unguarded
   * here would mount every concert card's `<Link>`/thumbnail div twice per page load. Pass the
   * variant the call site actually needs; omit it only when nothing else already gates visibility. */
  variant?: "mobile" | "desktop";
}

export default function ConcertsSection({ concerts, variant }: Props) {
  return (
    <>
      {/* ─── Mobile ─── */}
      {variant !== "desktop" && (
      <section className={`flex flex-col gap-4 px-4 pb-4 ${variant === "mobile" ? "" : "lg:hidden"}`}>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">music_note</span>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Concerts</h2>
          </div>
          <a className="text-primary text-sm font-bold" href="/concerts">
            Voir tout
          </a>
        </div>

        <div className="flex flex-col gap-4">
          {concerts.map((concert) => (
            <Link
              key={concert.id}
              href={concert.href || "#"}
              className="flex flex-col md:flex-row gap-0 rounded-lg overflow-hidden dark:bg-surface-dark shadow-sm ring-1 ring-black/5 dark:ring-white/5 group"
            >
              {/* Thumbnail */}
              <div className="relative w-full md:w-48 aspect-video md:aspect-auto shrink-0 overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  data-alt={concert.imageAlt}
                  style={{ backgroundImage: `url('${concert.imageUrl}')` }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <span
                    className="material-symbols-outlined text-white/90 group-hover:text-primary transition-colors drop-shadow-md"
                    style={{ fontSize: "32px" }}
                  >
                    play_circle
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                  {concert.duration}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col justify-center p-3 gap-1">
                <h3 className="text-slate-900 dark:text-white font-bold text-base leading-snug group-hover:text-primary transition-colors">
                  {concert.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed line-clamp-2">
                  {concert.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {concert.tag}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 text-[10px]">{concert.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}

      {/* ─── Desktop ─── */}
      {variant !== "mobile" && (
      <section className={`flex-col gap-4 ${variant === "desktop" ? "flex" : "hidden lg:flex"}`}>
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">music_note</span>
          <h2 className="text-white text-xl font-bold tracking-tight">Concerts</h2>
          <div className="kivu-divider flex-1" />
          <a className="text-primary text-xs font-bold hover:text-[#F0EDE8] transition-colors" href="/concerts">
            Voir tout
          </a>
        </div>

        {/* Grille 3 colonnes */}
        <div className="grid grid-cols-3 gap-5">
          {concerts.map((concert) => (
            <Link
              key={concert.id}
              href={concert.href || "#"}
              className="flex flex-col rounded-xl overflow-hidden bg-surface-dark ring-1 ring-white/5 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${concert.imageUrl}')` }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <span className="material-symbols-outlined text-white text-3xl" style={{ marginLeft: "3px" }}>
                      play_arrow
                    </span>
                  </div>
                </div>
                {/* Duration + tag */}
                <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                  {concert.duration}
                </div>
                <div className="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {concert.tag}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-2 p-4 flex-1">
                <h3 className="text-white font-bold text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
                  {concert.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1">
                  {concert.description}
                </p>
                <span className="text-gray-500 text-xs mt-auto">{concert.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      )}
    </>
  );
}
