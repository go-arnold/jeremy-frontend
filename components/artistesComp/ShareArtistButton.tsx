"use client";

import { shareContent } from "@/lib/share";

export default function ShareArtistButton({ name, slug }: { name: string; slug: string }) {
  const handleShare = () => {
    shareContent({ title: name, url: `/artistes/${slug}`, text: `Découvrez ${name} sur Art du Kivu` }).catch(() => {});
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
    >
      <span className="material-symbols-outlined text-xl">share</span>
    </button>
  );
}
