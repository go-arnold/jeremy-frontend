"use client";

interface Props {
  open: boolean;
  onClose: () => void;
  message?: string;
}

/** Compact "this isn't built yet" prompt — same shell/sizing as AuthPromptModal, but for actions
 * that exist in the UI before the backend feature is ready (e.g. ticket booking), not an auth
 * gate. A construction icon instead of the auth prompt's message, single dismiss button instead
 * of Quitter/Se connecter. */
export default function ComingSoonModal({ open, onClose, message }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-xs rounded-2xl p-6 flex flex-col items-center text-center gap-4 animate-fade-up"
        style={{ background: "rgba(18,34,60,0.98)", border: "1px solid rgba(230,48,18,0.2)" }}
      >
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-2xl">construction</span>
        </div>
        <p className="text-[#F0EDE8] text-sm font-bold leading-relaxed">
          {message || "Cette fonctionnalité est en cours de développement. Revenez très bientôt !"}
        </p>
        <button
          onClick={onClose}
          className="w-full h-10 rounded-xl bg-primary hover:bg-[#B8240C] text-white text-xs font-bold transition-colors"
        >
          D&apos;accord
        </button>
      </div>
    </div>
  );
}
