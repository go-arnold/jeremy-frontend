"use client";
import { useState } from "react";

interface Props {
  bookingLabel?: string;
}

export default function ArtisteDetailCTA({ bookingLabel = "Book Artist" }: Props) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="flex items-center gap-4 mt-4">
      <button className="flex-1 bg-primary hover:bg-primary-dark active:scale-95 transition-all duration-200 text-white font-display font-bold text-base h-12 rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(163,78,41,0.4)]">
        {bookingLabel}
      </button>
      <button
        onClick={() => setLiked((l) => !l)}
        className={`size-12 flex items-center justify-center rounded-xl border transition-colors ${
          liked
            ? "bg-primary/20 border-primary text-primary"
            : "bg-surface-dark border-white/10 text-white hover:bg-white/5"
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
      </button>
    </div>
  );
}
