"use client";

import { useState } from "react";
import ComingSoonModal from "@/components/ui/ComingSoonModal";

interface BookingWidgetProps {
  price: string;
  date?: string;
  time?: string;
  variant?: "mobile" | "desktop";
}

// Ticket booking isn't live yet — this used to call the real register endpoint (or hard-redirect
// to login), which promised a confirmation that never actually happened server-side. Shows a
// "coming soon" prompt instead until the feature is ready.
export default function BookingWidget({ price, date, time, variant = "desktop" }: BookingWidgetProps) {
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  if (variant === "mobile") {
    return (
      <section className="px-4 mt-8">
        <button
          onClick={() => setComingSoonOpen(true)}
          className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(41,163,163,0.4)]"
        >
          <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
          Réserver un billet — {price}
        </button>

        <ComingSoonModal
          open={comingSoonOpen}
          onClose={() => setComingSoonOpen(false)}
          message="La réservation de billets arrive bientôt ! Cette fonctionnalité est en cours de développement."
        />
      </section>
    );
  }

  return (
    <div className="rounded-2xl p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(18,34,60,0.9), rgba(13,23,47,0.95))",
        border: "1px solid rgba(230,48,18,0.25)",
      }}
    >
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/15 blur-2xl rounded-full pointer-events-none" />
      <div className="relative z-10 flex flex-col gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#8A8178] mb-1">Tarif</p>
          <p className="text-2xl font-black text-[#F0EDE8]">{price}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-[#8A8178]">
            <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8A8178]">
            <span className="material-symbols-outlined text-primary text-sm">schedule</span>
            <span>{time}</span>
          </div>
        </div>
        <button
          className="w-full bg-primary hover:bg-[#B8240C] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 text-base"
          onClick={() => setComingSoonOpen(true)}
        >
          <span className="material-symbols-outlined text-lg">confirmation_number</span>
          Réserver un billet
        </button>
        <p className="text-[10px] text-[#4A443E] text-center">
          Paiement sécurisé • Annulation gratuite
        </p>
      </div>

      <ComingSoonModal
        open={comingSoonOpen}
        onClose={() => setComingSoonOpen(false)}
        message="La réservation de billets arrive bientôt ! Cette fonctionnalité est en cours de développement."
      />
    </div>
  );
}
