"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { apiFetch } from "@/lib/api-client";
import { fetchFavoriteArtists, toggleFavoriteArtist } from "@/lib/services/artists";

interface MatchedArtist {
  id: number;
  slug: string;
}

interface ApiSearchResult {
  id: number;
  slug: string;
  title?: string;
}

/** Podcast `guests` is free-form text (JSONField, no FK to Artist) — this fuzzy-matches the
 * guest's name against the real search index to find out whether they're an actual artist on
 * the platform, and only then shows a real follow/favorite toggle (hidden otherwise, rather
 * than showing a "Suivre" button that has nothing real to attach to). */
export default function GuestFollowButton({ guestName, className }: { guestName: string; className?: string }) {
  const { user, isAuthenticated } = useAuth();
  const [matched, setMatched] = useState<MatchedArtist | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!guestName || guestName === "Invité") return;
    apiFetch<{ results?: ApiSearchResult[] }>(`/api/v1/search/?q=${encodeURIComponent(guestName)}&type=artists`)
      .then((data) => {
        const exact = data.results?.find((r) => r.title?.toLowerCase() === guestName.toLowerCase());
        if (exact) setMatched({ id: exact.id, slug: exact.slug });
      })
      .catch(() => {});
  }, [guestName]);

  useEffect(() => {
    if (!matched || !isAuthenticated || !user?.id) return;
    fetchFavoriteArtists(user.id)
      .then((favorites) => setFavorited(favorites.some((a) => a.id === matched.slug)))
      .catch(() => {});
  }, [matched, isAuthenticated, user?.id]);

  if (!matched) return null;

  const handleClick = async () => {
    if (!isAuthenticated || !user?.id) {
      window.location.href = "/auth/login";
      return;
    }
    const wasFavorited = favorited;
    setFavorited(!wasFavorited);
    setLoading(true);
    try {
      const result = await toggleFavoriteArtist(user.id, matched.id);
      setFavorited(result.action === "added");
    } catch {
      setFavorited(wasFavorited);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ||
        "shrink-0 text-primary text-[10px] font-bold border border-primary/25 px-2 py-1 rounded-full hover:bg-primary/10 transition disabled:opacity-50"
      }
    >
      {favorited ? "Suivi" : "Suivre"}
    </button>
  );
}
