"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="material-symbols-outlined text-6xl text-primary">error</span>
      <h1 className="text-2xl font-black uppercase tracking-tight text-[#F0EDE8]">
        Une erreur est survenue
      </h1>
      <p className="max-w-sm text-sm text-[#8A8178]">
        Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir plus tard.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#B8240C]"
      >
        Réessayer
      </button>
    </div>
  );
}
