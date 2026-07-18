import Link from "next/link";
import type { StudioSession } from "@/types/webtv";

interface Props {
  sessions: StudioSession[];
  /** Set when the page already renders separate mobile/desktop trees (e.g. two full `<main>`
   * blocks gated by lg:hidden) — rendering both internal variants unconditionally in that case
   * would quadruple this list in the DOM. Omit to auto-select via lg:hidden/hidden:lg like any
   * other standalone responsive component. */
  variant?: "mobile" | "desktop";
}

export default function StudioSessionsSection({ sessions, variant }: Props) {
  const showMobile = variant !== "desktop";
  const showDesktop = variant !== "mobile";

  return (
    <section className="flex flex-col gap-4">
      {/* ── En-tête : carrousel horizontal (mobile) ── */}
      {showMobile && (
      <div className={`flex items-center justify-between px-4 ${variant ? "" : "lg:hidden"}`}>
        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
          Studio Sessions
        </h2>
        <a className="text-primary text-sm font-bold" href="/studio-sessions">
          Voir tout
        </a>
      </div>
      )}

      {/* ── En-tête : grille 2 colonnes (desktop) ── */}
      {showDesktop && (
      <div className={`items-center justify-between ${variant ? "flex" : "hidden lg:flex"}`}>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Studio Sessions</span>
          <div className="kivu-divider w-8" />
        </div>
        <a className="text-primary text-xs font-bold hover:text-[#F0EDE8] transition-colors" href="/studio-sessions">
          Voir tout
        </a>
      </div>
      )}

      {/* ── Mobile : carrousel horizontal ── */}
      {showMobile && (
      <div className={`flex overflow-x-auto gap-4 px-4 pb-4 no-scrollbar snap-x snap-mandatory ${variant ? "" : "lg:hidden"}`}>
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={session.href || "#"}
            className="snap-start shrink-0 w-64 flex flex-col px-3 gap-3 group cursor-pointer"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-surface-dark ring-1 ring-white/5">
              <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {session.duration}
              </div>

              <div
                className="w-full h-full bg-cover bg-center group-hover:opacity-80 transition-opacity"
                data-alt={session.imageAlt}
                style={{ backgroundImage: `url('${session.imageUrl}')` }}
              />

              {/* Play — toujours visible (pas seulement au survol, inutile sur mobile) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <span
                  className="material-symbols-outlined text-white drop-shadow-lg"
                  style={{ fontSize: "40px" }}
                >
                  play_circle
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0.5">
              <h4 className="text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">
                {session.title}
              </h4>
              <p className="text-gray-400 text-xs">
                {session.author} • {session.publishedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
      )}

      {/* ── Desktop : grille 2×N ── */}
      {showDesktop && (
      <div className={`grid grid-cols-2 gap-4 ${variant ? "" : "hidden lg:grid"}`}>
        {sessions.map((session) => (
          <Link key={session.id} href={session.href || "#"} className="flex flex-col gap-2 group cursor-pointer">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-surface-dark ring-1 ring-white/5">
              <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                {session.duration}
              </div>
              <div
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url('${session.imageUrl}')` }}
              />
              {/* Play — toujours visible */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined text-2xl" style={{ marginLeft: "2px" }}>play_arrow</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-white text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {session.title}
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                {session.author} • {session.publishedAt}
              </p>
            </div>
          </Link>
        ))}
      </div>
      )}
    </section>
  );
}
