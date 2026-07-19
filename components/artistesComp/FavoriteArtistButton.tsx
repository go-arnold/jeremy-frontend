"use client";

import { useFavoriteArtist } from "@/hooks/useFavoriteArtist";
import AuthPromptModal from "@/components/ui/AuthPromptModal";

interface Props {
  artistId: number | null | undefined;
  /** `mapApiArtistToArtiste`'s `.id` is slug-based, not the numeric `artistId` — the favorites
   * list has to be matched by slug, while the toggle POST body needs the numeric id. */
  artistSlug: string;
}

export default function FavoriteArtistButton({ artistId, artistSlug }: Props) {
  const { favorited, loading, toggle, authPromptOpen, closeAuthPrompt } = useFavoriteArtist(artistId, artistSlug);

  if (!artistId) return null;

  return (
    <>
      <button
        onClick={toggle}
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

      <AuthPromptModal
        open={authPromptOpen}
        onClose={closeAuthPrompt}
        redirectTo={`/artistes/${artistSlug}`}
        message="Connectez-vous ou créez un compte pour ajouter cet artiste à vos favoris — ça ne prend que 2 secondes !"
      />
    </>
  );
}
