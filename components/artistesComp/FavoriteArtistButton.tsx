"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchFavoriteArtists, toggleFavoriteArtist } from "@/lib/services/artists";

interface Props {
  artistId: number | null | undefined;
  /** `mapApiArtistToArtiste`'s `.id` is slug-based, not the numeric `artistId` — the favorites
   * list has to be matched by slug, while the toggle POST body needs the numeric id. */
  artistSlug: string;
}

export default function FavoriteArtistButton({ artistId, artistSlug }: Props) {
  const { user, isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.id || !artistId) return;
    fetchFavoriteArtists(user.id)
      .then((favorites) => setFavorited(favorites.some((a) => a.id === artistSlug)))
      .catch(() => {});
  }, [isAuthenticated, user?.id, artistId, artistSlug]);

  if (!artistId) return null;

  const handleClick = async () => {
    if (!isAuthenticated || !user?.id) {
      window.location.href = "/auth/login";
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

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      title={favorited ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`flex items-center justify-center size-10 rounded-full backdrop-blur-md transition-colors disabled:opacity-50 ${
        favorited ? "bg-primary text-white" : "bg-black/20 text-white hover:bg-white/10"
      }`}
    >
      <span
        className="material-symbols-outlined text-xl"
        style={{ fontVariationSettings: favorited ? "'FILL' 1" : "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
}
