"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchFavoriteArtists, toggleFavoriteArtist } from "@/lib/services/artists";

/** Shared favorite-toggle state for an artist, used by both the small heart icon in the hero
 * header and the full "Ajouter aux favoris" CTA button, so the two stay in sync instead of each
 * keeping their own local `liked` state. */
export function useFavoriteArtist(artistId: number | null | undefined, artistSlug: string) {
  const { user, isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !artistId) return;
    fetchFavoriteArtists(user.id)
      .then((favorites) => setFavorited(favorites.some((a) => a.id === artistSlug)))
      .catch(() => {});
  }, [isAuthenticated, user?.id, artistId, artistSlug]);

  const toggle = async () => {
    if (!artistId) return;
    if (!isAuthenticated || !user?.id) {
      setAuthPromptOpen(true);
      return;
    }
    const wasFavorited = favorited;
    setFavorited(!wasFavorited);
    setLoading(true);
    try {
      const result = await toggleFavoriteArtist(user.id, artistId);
      setFavorited(result.action === "added");
    } catch {
      setFavorited(wasFavorited);
    } finally {
      setLoading(false);
    }
  };

  return {
    favorited,
    loading,
    toggle,
    authPromptOpen,
    closeAuthPrompt: () => setAuthPromptOpen(false),
  };
}
