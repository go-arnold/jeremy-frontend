"use client";

import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Path to return to after a successful login — forwarded as /auth/login's ?redirect=. */
  redirectTo?: string;
  message?: string;
}

/** Shared "please sign in" prompt — used anywhere an action (favoris, like, comment...) requires
 * an authenticated user, instead of a hard redirect that gives no context. */
export default function AuthPromptModal({ open, onClose, redirectTo, message }: Props) {
  if (!open) return null;

  const loginHref = redirectTo ? `/auth/login?redirect=${encodeURIComponent(redirectTo)}` : "/auth/login";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-xs rounded-2xl p-6 flex flex-col items-center text-center gap-4 animate-fade-up"
        style={{ background: "rgba(18,34,60,0.98)", border: "1px solid rgba(230,48,18,0.2)" }}
      >
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">favorite</span>
        </div>
        <p className="text-[#F0EDE8] text-sm font-bold leading-relaxed">
          {message || "Connectez-vous ou créez un compte : ça ne prend que 2 secondes !"}
        </p>
        <div className="flex items-center gap-3 w-full mt-1">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-xl border border-white/10 text-[#8A8178] text-xs font-bold hover:bg-white/5 transition-colors"
          >
            Quitter
          </button>
          <Link
            href={loginHref}
            className="flex-1 h-10 rounded-xl bg-primary hover:bg-[#B8240C] text-white text-xs font-bold flex items-center justify-center transition-colors"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}
