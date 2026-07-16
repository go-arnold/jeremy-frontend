
"use client";
import { useState } from "react";

export default function WhatsAppNotifBanner() {
  const [phone, setPhone] = useState("");
  const [sent, setSent]   = useState(false);

  function handleSend() {
    if (!phone.trim()) return;
    
    setSent(true);
  }

  return (
    <section className="mt-4 mb-8">
      <div className="relative overflow-hidden rounded-2xl bg-surface-dark p-6 border border-white/5">
        {/* Halos lumineux décoratifs */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-[50px] rounded-full pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-white">Restez informés</h3>
          <p className="text-sm text-gray-400">
            Recevez les derniers événements culturels directement sur WhatsApp.
          </p>

          {sent ? (
            <p className="text-sm text-primary font-bold mt-2">
              ✓ Vous êtes inscrit !
            </p>
          ) : (
            <div className="flex gap-2 mt-2">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="+243..."
                type="tel"
              />
              <button
                onClick={handleSend}
                className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
