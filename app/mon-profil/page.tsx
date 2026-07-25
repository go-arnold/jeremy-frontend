"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  userProfile as mockedProfile,
  profileStats as mockedProfileStats,
  favoriteArtists as mockedFavoriteArtists,
  listenHistory as mockedListenHistory,
  badges as mockedBadges,
} from "@/data/monProfil";
import { apiFetch } from "@/lib/api-client";
import {
  mapApiArtistToArtiste,
  mapApiBadgeToBadge,
  mapApiMediaRankingToListenHistoryItem,
  mapApiSavedItemToSavedEntry,
} from "@/lib/mappers";
import { fetchActivity } from "@/lib/services/profile";
import { shareContent } from "@/lib/share";
import ProfileHeader    from "@/components/monProfil/ProfileHeader";
import ProfileStats     from "@/components/monProfil/ProfileStats";
import ProfileTabs, { type ProfileTabId } from "@/components/monProfil/ProfileTabs";
import FavoriteArtists  from "@/components/monProfil/FavoriteArtists";
import ListenHistory    from "@/components/monProfil/ListenHistory";
import Accomplishments  from "@/components/monProfil/Accomplishments";
import SavedItems from "@/components/monProfil/SavedItems";
import ActivityFeed from "@/components/monProfil/ActivityFeed";
import EditProfileModal from "@/components/monProfil/EditProfileModal";
import Avatar from "@/components/ui/Avatar";
import type { ActivityEntry } from "@/types/monProfil";
import type { ApiArtistList, ApiMediaRankingItem, ApiSavedItem, ApiBadge } from "@/lib/api-types";

interface ApiEarnedBadge {
  badge: { slug?: string };
}

function formatSecondsAsHours(totalSeconds: number): string {
  const hours = totalSeconds / 3600;
  return hours >= 1 ? `${hours.toFixed(0)}h` : `${Math.round(totalSeconds / 60)}m`;
}

export default function MonProfilPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const [favoriteArtists, setFavoriteArtists] = useState(mockedFavoriteArtists);
  const [listenHistory, setListenHistory] = useState(mockedListenHistory);
  const [badges, setBadges] = useState(mockedBadges);
  const [savedItems, setSavedItems] = useState<ReturnType<typeof mapApiSavedItemToSavedEntry>[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTabId>("apercu");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) return;

    apiFetch<ApiArtistList[]>(`/api/v1/users/${user.id}/favorites/`)
      .then((data) => setFavoriteArtists(data.map((a) => {
        const artiste = mapApiArtistToArtiste(a);
        return { id: artiste.id, name: artiste.name, avatar: artiste.image };
      })))
      .catch((error) => console.error("Failed to fetch favorite artists:", error));

    apiFetch<ApiMediaRankingItem[]>(`/api/v1/gamification/media-ranking/`)
      .then((data) => setListenHistory(data.map(mapApiMediaRankingToListenHistoryItem)))
      .catch((error) => console.error("Failed to fetch media ranking:", error));

    apiFetch<ApiSavedItem[]>(`/api/v1/users/${user.id}/saved/`)
      .then((data) => setSavedItems(data.map(mapApiSavedItemToSavedEntry)))
      .catch((error) => console.error("Failed to fetch saved items:", error));

    fetchActivity(user.id)
      .then(setActivity)
      .catch((error) => console.error("Failed to fetch activity:", error));

    Promise.all([
      apiFetch<ApiBadge[]>(`/api/v1/gamification/badges/`),
      apiFetch<ApiEarnedBadge[]>(`/api/v1/gamification/users/${user.id}/badges/`),
    ])
      .then(([catalog, earned]) => {
        const earnedSlugs = new Set(earned.map((e) => e.badge.slug));
        const sorted = [...catalog].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setBadges(sorted.map((b, i) => mapApiBadgeToBadge(b, earnedSlugs.has(b.slug), i)));
      })
      .catch((error) => console.error("Failed to fetch badges:", error));
  }, [user?.id]);

  // Derived directly from favoriteArtists/badges/listenHistory during render instead of an
  // effect that copies them into a separate `profileStats` state — avoids the extra render pass
  // (react-hooks/set-state-in-effect) since this value has no state of its own.
  const profileStats = useMemo(
    () =>
      mockedProfileStats.map((stat) => {
        if (stat.id === "artistes") return { ...stat, value: String(favoriteArtists.length) };
        if (stat.id === "badges") return { ...stat, value: String(badges.filter((b) => b.unlocked).length) };
        if (stat.id === "ecoute") {
          const totalSeconds = listenHistory.reduce((sum, item) => sum + (item.totalSeconds || 0), 0);
          return totalSeconds > 0 ? { ...stat, value: formatSecondsAsHours(totalSeconds) } : stat;
        }
        return stat;
      }),
    [favoriteArtists, badges, listenHistory]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  // Map real user data to profile structure
  const profile = {
    ...mockedProfile,
    displayName: user?.username || user?.email?.split('@')[0] || "Utilisateur",
    handle: user?.handle || `@${user?.username || 'user'}`,
    avatar: user?.avatar_url || mockedProfile.avatar,
    coverImage: user?.cover_image_url || mockedProfile.coverImage,
    bio: user?.bio || mockedProfile.bio,
    isOnline: user?.is_online !== undefined ? user.is_online : mockedProfile.isOnline,
  };

  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  const handleShareProfile = () => {
    shareContent({ title: profile.displayName, url: "/mon-profil", text: `Découvrez le profil de ${profile.displayName} sur Art du Kivu` }).catch(() => {});
  };

  return (
    <div className="text-white font-display min-h-screen flex flex-col relative w-full overflow-hidden">
      {/* ══════════════════════════════════════
          MOBILE — layout original inchangé
      ══════════════════════════════════════ */}
      <main className="lg:hidden flex-1 px-5 overflow-y-auto w-full flex flex-col gap-6 pb-20">
        {/* (PDF) "Paramètres" et le titre "Mon profil" retirés — seule la déconnexion reste. */}
        <header className="relative z-20 flex items-center justify-end py-4">
          <button
            onClick={logout}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 transition-all text-white"
            title="Déconnexion"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </header>
        <ProfileHeader profile={profile} onEdit={() => setIsEditOpen(true)} onShare={handleShareProfile} />
        <ProfileStats stats={profileStats} />
        <ProfileTabs active={activeTab} onChange={setActiveTab} />
        {activeTab === "apercu" ? (
          <>
            <FavoriteArtists artists={favoriteArtists} />
            <div className="grid grid-cols-1 gap-6">
              <ListenHistory items={listenHistory} />
              <Accomplishments badges={badges} totalUnlocked={unlockedBadges} />
              <SavedItems items={savedItems} />
            </div>
          </>
        ) : (
          <ActivityFeed items={activity} />
        )}
        <div className="h-4" />
      </main>

      {/* ══════════════════════════════════════
          DESKTOP — layout profil
      ══════════════════════════════════════ */}
      <div className="hidden lg:flex flex-col w-full">

        {/* ── Cover banner ── */}
        <ProfileCoverBanner coverUrl={profile.coverImage} onLogout={logout} />

        {/* ── Corps ── */}
        <div className="max-w-[1800px] mx-auto px-8 w-full pb-16">
          <div className="grid grid-cols-[280px_1fr] gap-10 -mt-16 relative z-10">

            {/* ── Sidebar gauche ── */}
            <aside className="flex flex-col gap-5">

              {/* Avatar flottant sur la cover */}
              <ProfileSidebarCard profile={profile} onEdit={() => setIsEditOpen(true)} onShare={handleShareProfile} />

              {/* Stats */}
              <ProfileStatsDesktop stats={profileStats} />

              {/* Accomplissements sidebar */}
              <AccomplishmentsDesktop badges={badges} totalUnlocked={unlockedBadges} />

              {/* Signets */}
              <SavedItems items={savedItems} />
            </aside>

            {/* ── Colonne principale ── */}
            <div className="flex flex-col gap-8 pt-20">

              {/* Tabs */}
              <ProfileTabs active={activeTab} onChange={setActiveTab} />

              {activeTab === "apercu" ? (
                <>
                  {/* Artistes favoris */}
                  <FavoriteArtistsDesktop artists={favoriteArtists} />

                  {/* Historique + Accomplissements côte à côte */}
                  <div className="grid grid-cols-2 gap-6">
                    <ListenHistoryDesktop items={listenHistory} />
                    <AccomplishmentsDesktop badges={badges} totalUnlocked={unlockedBadges} />
                  </div>
                </>
              ) : (
                <ActivityFeed items={activity} />
              )}
            </div>

          </div>
        </div>
      </div>

      <EditProfileModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        currentUsername={user?.username || ""}
        currentBio={user?.bio || ""}
        currentAvatar={profile.avatar}
        currentCover={profile.coverImage}
      />
    </div>
  );
}


import type { UserProfile, ProfileStat, FavoriteArtist, ListenHistoryItem, Badge } from "@/types/monProfil";

/* ════════════════════════════════════════════════════
   VARIANTES DESKTOP
════════════════════════════════════════════════════ */

// ... (Sub-components updated to handle actions) ...

// (PDF) "Paramètres" et le titre "Mon profil" retirés — seule la déconnexion reste.
function ProfileCoverBanner({ coverUrl, onLogout }: { coverUrl?: string; onLogout: () => void }) {
  return (
    <div className="relative w-full h-56 overflow-hidden">
      {coverUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${coverUrl}')` }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0D2347 0%, #1a1035 40%, rgba(230,48,18,0.2) 100%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#12100F]" />

      <div className="absolute top-0 left-0 right-0 flex items-center justify-end px-8 pt-4 max-w-[1800px] mx-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:bg-[#B8240C] transition-all text-sm font-black uppercase tracking-wider shadow-lg"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Déconnexion
        </button>
      </div>
    </div>
  );
}

// ── Sidebar card profil ─────────────────────────────
function ProfileSidebarCard({ profile, onEdit, onShare }: { profile: UserProfile; onEdit: () => void; onShare: () => void }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col items-center gap-4"
      style={{ background: "rgba(18,34,60,0.8)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Avatar avec anneau gradient */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-transparent">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#12100F]">
            <Avatar
              src={profile.avatar}
              alt={profile.displayName}
              size="custom"
              className="w-full h-full"
            />
          </div>
        </div>
        {profile.isOnline && (
          <div className="absolute bottom-2 right-2 w-4 h-4 bg-primary rounded-full border-2 border-[#12100F]" />
        )}
      </div>

      {/* Nom */}
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-tight text-[#F0EDE8]">{profile.displayName}</h1>
        <p className="text-primary font-medium text-sm">{profile.handle}</p>
        <p className="text-[#8A8178] text-xs mt-1 leading-relaxed">{profile.bio}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <button
          onClick={onEdit}
          className="flex-1 h-10 bg-primary hover:bg-[#B8240C] text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          Éditer
        </button>
        <button
          onClick={onShare}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-[#8A8178] hover:text-white hover:bg-white/5 transition-colors border border-white/10"
        >
          <span className="material-symbols-outlined text-lg">share</span>
        </button>
      </div>
    </div>
  );
}

// ── Stats desktop ────────────────────────────────────
function ProfileStatsDesktop({ stats }: { stats: ProfileStat[] }) {
  return (
    <div
      className="rounded-2xl p-5 grid grid-cols-2 gap-3"
      style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      {stats.map((stat) => (
        <div
          key={stat.id}
          className="flex flex-col items-center justify-center text-center gap-1 p-3 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <span className="text-2xl font-bold text-white">{stat.value}</span>
          <span className="text-[10px] uppercase tracking-wider text-[#8A8178] font-semibold">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Accomplissements sidebar ─────────────────────────
function AccomplishmentsDesktop({ badges, totalUnlocked }: { badges: Badge[]; totalUnlocked: number }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.6)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-[#F0EDE8]">Badges</h3>
        <span className="text-xs text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg">
          {totalUnlocked} / {badges.length}
        </span>
      </div>
      {/* Barre de progression */}
      <div className="h-1.5 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${(totalUnlocked / badges.length) * 100}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {badges.map((badge) =>
          badge.unlocked ? (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-white/5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <div
                className={`relative w-10 h-10 rounded-full bg-[#111317] flex items-center justify-center ${badge.color}`}
                style={{ boxShadow: `0 0 10px ${badge.glowColor}` }}
              >
                {badge.iconUrl ? (
                  <Image src={badge.iconUrl} alt={badge.label} width={20} height={20} className="object-contain" />
                ) : (
                  <span className="material-symbols-outlined text-base">{badge.icon}</span>
                )}
              </div>
              <span className="text-[9px] font-bold text-center leading-tight text-[#8A8178]">
                {badge.label}
              </span>
            </div>
          ) : (
            <div
              key={badge.id}
              className="flex flex-col items-center justify-center p-2 rounded-xl border border-dashed border-white/10 opacity-40"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">lock</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ── FavoriteArtists desktop ──────────────────────────
function FavoriteArtistsDesktop({ artists }: { artists: FavoriteArtist[] }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-black text-[#F0EDE8] uppercase tracking-wider">Artistes Favoris</h3>
        <Link href="/artistes" className="text-xs font-bold text-primary hover:text-[#F0EDE8] transition-colors">
          Voir tout
        </Link>
      </div>

      {/* Grille 6+ colonnes sur desktop */}
      <div className="grid grid-cols-6 gap-4">
        {artists.map((artist) => (
          <Link key={artist.id} href={`/artistes/${artist.id}`} className="flex flex-col items-center gap-2 cursor-pointer group">
            <Avatar
              src={artist.avatar}
              alt={artist.name}
              size="custom"
              className="w-16 h-16 border-2 border-transparent group-hover:border-primary transition-all"
            />
            <span className="text-xs font-medium text-center text-[#8A8178] group-hover:text-[#F0EDE8] transition-colors truncate w-full text-center">
              {artist.name}
            </span>
          </Link>
        ))}
        {/* (PDF) "+" redirige vers la page Artistes */}
        <Link href="/artistes" className="flex flex-col items-center gap-2 cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20 group-hover:border-primary transition-all">
            <span className="material-symbols-outlined text-white/40 group-hover:text-primary">add</span>
          </div>
          <span className="text-xs font-medium text-[#4A443E] group-hover:text-primary transition-colors">Ajouter</span>
        </Link>
      </div>
    </div>
  );
}

// ── ListenHistory desktop ────────────────────────────
function ListenHistoryDesktop({ items }: { items: ListenHistoryItem[] }) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(18,34,60,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <h3 className="text-base font-black text-[#F0EDE8] uppercase tracking-wider flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary text-lg">history</span>
        Historique
      </h3>
      <div className="flex flex-col gap-2">
        {items.map((item) => {
          const isPlaying = item.status === "playing";
          return (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div
                className={`w-11 h-11 rounded-lg ${item.accentColor} flex items-center justify-center ${item.iconColor} relative overflow-hidden shrink-0`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay"
                  style={{ backgroundImage: `url('${item.coverImage}')` }}
                />
                <span className="material-symbols-outlined relative z-10 text-sm">{item.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{item.title}</p>
                {isPlaying ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${item.progressPercent}%` }} />
                    </div>
                    <span className="text-[10px] text-[#8A8178]">{item.timeRemaining}</span>
                  </div>
                ) : (
                  <p className="text-xs text-[#8A8178] truncate">{item.subtitle}</p>
                )}
              </div>
              <div className={`w-7 h-7 flex items-center justify-center rounded-full shrink-0 ${isPlaying ? "bg-primary text-white" : "border border-white/10 text-white"}`}>
                <span className="material-symbols-outlined text-sm">{isPlaying ? "pause" : "play_arrow"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
