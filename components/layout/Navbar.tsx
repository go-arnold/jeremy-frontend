"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

const mainLinks = [
  { href: "/",           icon: "home",          label: "Accueil" },
  { href: "/blog",       icon: "article",       label: "Blog" },
  { href: "/communaute", icon: "groups",        label: "Communauté" },
  { href: "/evenements", icon: "event",         label: "Événements" },
  { href: "/podcasts",   icon: "podcasts",      label: "Podcasts" },
];

const secondaryLinks = [
  { href: "/magazine",   icon: "article",         label: "Magazine" },
  { href: "/sorties-premieres", icon: "new_releases",   label: "Sorties" },
];

const allLinks = [...mainLinks, ...secondaryLinks];

// ── Item sidebar desktop ──────────────────────────
function SidebarItem({ href, icon, label, active }: {
  href: string; icon: string; label: string; active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
        active
          ? "bg-[#E63012]/15 text-[#E63012]"
          : "text-[#F0EDE8]/50 hover:text-[#F0EDE8] hover:bg-white/5"
      }`}
    >
      <span
        className="material-symbols-outlined transition-all duration-200"
        style={{
          fontSize: "20px",
          fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
        }}
      >
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#E63012] shrink-0" />}
    </Link>
  );
}

// ── Item bottom bar mobile ────────────────────────
function BottomItem({ href, icon, label, active, iconOnly = false, small = false }: {
  href: string; icon: string; label: string; active: boolean; iconOnly?: boolean; small?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-0.5 px-1 transition-colors duration-200 ${small ? "flex-shrink-0" : ""}`}
      style={{ color: active ? "#E63012" : "rgba(240, 237, 232, 0.50)" }}
      title={iconOnly ? label : undefined}
    >
      <span
        className={`flex items-center justify-center rounded-full transition-all duration-200 ${small ? "w-6 h-6" : "h-7 w-7"}`}
        style={{
          background: active ? "rgba(230, 48, 18, 0.15)" : "transparent",
        }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: small ? "18px" : "22px",
            color: active ? "#E63012" : "rgba(240, 237, 232, 0.60)",
            fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {icon}
        </span>
      </span>
      {!iconOnly && <span className={`font-bold uppercase tracking-wider ${small ? "text-[7px]" : "text-[9px]"}`}>{label}</span>}
    </Link>
  );
}

// ── Drawer menu mobile ────────────────
function DrawerMenu({ open, onClose, pathname, links }: {
  open: boolean; onClose: () => void; pathname: string; links: any[];
}) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl pb-10 pt-4 px-4 flex flex-col gap-2"
        style={{
          background: "rgba(13,23,47,0.98)",
          border: "1px solid rgba(230,48,18,0.15)",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />

        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              pathname === link.href
                ? "bg-[#E63012]/15 text-[#E63012]"
                : "text-[#F0EDE8]/60 hover:text-[#F0EDE8] hover:bg-white/5"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: "22px",
                fontVariationSettings: pathname === link.href ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {link.icon}
            </span>
            {link.label}
          </Link>
        ))}
      </div>
    </>
  );
}

// ── Composant principal ───────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  // While the initial auth check is in flight, don't show either state — avoids a
  // flash of "SE CONNECTER" for already-authenticated users on every page load.
  const authLink = loading
    ? null
    : isAuthenticated
      ? { href: "/mon-profil", icon: "account_circle", label: "Mon Profil" }
      : { href: "/auth/login", icon: "login", label: "SE CONNECTER" };

  const allSecondaryLinks = authLink ? [...secondaryLinks, authLink] : secondaryLinks;
  const allLinksForDrawer = [...mainLinks, ...allSecondaryLinks];

  return (
    <>
      {/* ══════════════════════════════════════
          MOBILE — bottom bar
      ══════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className="flex items-center justify-around px-0.5 py-2"
          style={{
            background: "rgba(13,23,47,0.96)",
            backdropFilter: "blur(16px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {/* Accueil */}
          <BottomItem
            href="/"
            icon="home"
            label="Accueil"
            active={pathname === "/"}
            small={true}
          />

          {/* 4 liens du milieu : Blog, Communauté, Événements, Podcasts */}
          {mainLinks.filter(l => l.href !== "/").map((l) => (
            <BottomItem key={l.href} {...l} active={pathname === l.href} small={true} />
          ))}

          {/* Menu hamburger — ouvre le drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-0.5 px-1 transition-colors duration-200"
            style={{ color: "rgba(240,237,232,0.5)" }}
            title="Plus d'options"
          >
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full transition-all duration-200"
              style={{ background: "transparent" }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "rgba(240,237,232,0.60)" }}>
                menu
              </span>
            </span>
            <span className="text-[7px] font-bold uppercase tracking-wider">Plus</span>
          </button>
        </div>
      </nav>

      {/* Drawer mobile */}
      <DrawerMenu
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
        links={allLinksForDrawer}
      />

      {/* ══════════════════════════════════════
          DESKTOP — sidebar gauche fixe
      ══════════════════════════════════════ */}
      <aside
        className="hidden lg:flex fixed top-16 left-0 bottom-0 z-40 w-56 flex-col pt-4 pb-8"
        style={{
          background: "rgba(13,23,47,0.92)",
          backdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Navigation principale */}
        <div className="flex flex-col gap-0.5 px-3 flex-1">
          {mainLinks.map((link) => (
            <SidebarItem
              key={link.href}
              {...link}
              active={pathname === link.href}
            />
          ))}
        </div>

        {/* Liens secondaires */}
        <div className="px-3">
          <div
            className="h-px w-full my-3"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <div className="flex flex-col gap-0.5">
            {allSecondaryLinks.map((link) => (
              <SidebarItem
                key={link.href}
                {...link}
                active={pathname === link.href}
              />
            ))}
          </div>
        </div>

        {/* Live badge */}
        <div className="px-3 mt-4">
          <Link
            href="/live-music"
            className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-white/5"
            style={{
              border: "1px solid rgba(0,168,150,0.25)",
              background: "rgba(0,168,150,0.05)",
            }}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]" />
            </span>
            <div>
              <p className="text-[10px] font-black text-[#00A896] uppercase tracking-wider">En Direct</p>
              <p className="text-[10px] text-[#F0EDE8]/40 truncate">Kivu Morning Flow</p>
            </div>
          </Link>
        </div>
        </aside>
    </>
  );
}
