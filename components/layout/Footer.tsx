"use client";

import { useAuth } from "@/providers/AuthProvider";

export default function Footer() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <footer className="mt-10 px-4 pb-18">
        <div className="mx-auto max-w-md rounded-2xl border border-white/5  backdrop-blur-sm p-6">
            <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-primary">graphic_eq</span>
            <h3 className=" font-extrabold uppercase tracking-widest text-slate-200 dark:text-white">Art-du-Kivu</h3>
            </div>
            <p className="text-sm text-slate-200 dark:text-white">Plateforme culturelle et sonore du Kivu.</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/">Accueil</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/podcasts">Podcasts</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/artistes">Artistes</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/episode-podcast.html">Épisode podcast</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/radio-en-direct">Radio en direct</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/evenements">Événements</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/sorties-premieres">Sorties &amp; Premières</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/web-tv">Web TV</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/magazine">Magazine</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/blog">Blog</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/lecture-article.html">Lecture article</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/communaute">Communauté</a>
            <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/profil-artiste.html">Profil artiste</a>
            {!loading && (
              isAuthenticated ? (
                <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/mon-profil">Mon profil</a>
              ) : (
                <a className="text-slate-300 dark:text-slate-300 hover:text-primary" href="/auth/login">Se connecter</a>
              )
            )}
            </div>
            <p className="mt-4 text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">© 2026 Art-du-Kivu</p>
        </div>
</footer>
  );
}