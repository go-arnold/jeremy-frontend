"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const navLinks = [
  { href: "/artistes",  icon: "mic_external_on", label: "Artistes" },
  { href: "/web-tv",    icon: "tv",              label: "Web TV" },
  { href: "/live-music",  icon: "pause",         label: "Live Music" },
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState("");
  const [desktopQuery, setDesktopQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, loading: authLoading, logout } = useAuth();

  const goToSearch = (query: string) => {
    if (!query.trim()) return;
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16"
      style={{
        background: "rgba(18,34,60,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center h-full px-3 lg:px-6 gap-3">

        {/* ── LOGO — au bord gauche ── */}
        <div className="shrink-0">
          <Link href="/">
            <img
              src="/logoReviewed.png"
              alt="Art du Kivu"
              className="h-9 w-auto object-contain"
              style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.5))" }}
            />
          </Link>
        </div>

        {/* ── NAV LINKS desktop (entre logo et search) ── */}
        <nav className="hidden lg:flex items-center gap-1 ml-4">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active
                    ? "bg-[#E63012]/15 text-[#E63012]"
                    : "text-[#F0EDE8]/55 hover:text-[#F0EDE8] hover:bg-white/5"
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "18px",
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* ── SPACER + SEARCH centré ── */}
        <div className="flex-1 flex justify-center">
          {/* Mobile : icône search qui ouvre un input */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-hidden ${
              searchOpen ? "w-full max-w-xs opacity-100" : "w-0 opacity-0 pointer-events-none"
            }`}
          >
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                goToSearch(mobileQuery);
              }}
            >
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40 text-lg">
                search
              </span>
              <input
                autoFocus={searchOpen}
                type="text"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full h-9 pl-9 pr-8 rounded-xl text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-primary"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </form>
          </div>

          {/* Desktop variantess : barre de recherche centrée, largeur fixe */}
          <form
            className="hidden lg:flex items-center relative w-80 xl:w-96"
            onSubmit={(e) => {
              e.preventDefault();
              goToSearch(desktopQuery);
            }}
          >
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-lg">
              search
            </span>
            <input
              type="text"
              value={desktopQuery}
              onChange={(e) => setDesktopQuery(e.target.value)}
              placeholder="Artistes, sons, événements..."
              className="w-full h-9 pl-10 pr-4 rounded-full text-sm text-white placeholder:text-white/30 outline-none focus:ring-1 focus:ring-[#E63012] transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            />
          </form>
        </div>

        {/* ── ACTIONS DROITE — collées au bord droit ── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Search toggle — mobile seulement, quand pas ouvert */}
          {!searchOpen && (
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#F0EDE8]/70 hover:text-white hover:bg-white/5 transition-all"
            >
              <span className="material-symbols-outlined text-xl">search</span>
            </button>
          )}

          
          {/* Plein écran */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#F0EDE8]/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-xl">
              {isFullscreen ? "close_fullscreen" : "open_in_full"}
            </span>
          </button>
          

          {/* Notifications — desktop */}
          <button className="hidden lg:flex w-9 h-9 items-center justify-center rounded-xl text-[#F0EDE8]/60 hover:text-white hover:bg-white/5 transition-all relative">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E63012]" />
          </button>

          {/* Profil / Connexion — while the initial auth check is in flight, render a neutral
              placeholder instead of guessing "logged out", to avoid a flash of the wrong state
              for already-authenticated users on every page load. */}
          {authLoading ? (
            <div className="w-9 h-9 rounded-xl bg-white/5 animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-1">
              <Link
                href="/mon-profil"
                className="flex items-center gap-2 w-9 h-9 lg:w-auto lg:px-3 justify-center rounded-xl text-[#F0EDE8]/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <span className="material-symbols-outlined text-xl">account_circle</span>
                <span className="hidden lg:block text-sm font-bold truncate max-w-[100px]">{user?.username || 'Profil'}</span>
              </Link>
              {/* Icône distincte (rouge, "logout") de "Mon Profil" — état d'authentification
                  clairement lisible sans devoir ouvrir le profil pour se déconnecter. */}
              <button
                onClick={logout}
                title="Se déconnecter"
                className="flex items-center justify-center w-9 h-9 rounded-xl text-[#E63012]/70 hover:text-[#E63012] hover:bg-[#E63012]/10 transition-all"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center gap-2 h-9 w-9 justify-center rounded-xl bg-primary text-white hover:bg-[#B8240C] transition-all font-black text-xs uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-lg">login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
