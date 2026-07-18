"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { registerForEvent } from "@/lib/services/events";

interface BookingWidgetProps {
  slug: string;
  price: string;
  date?: string;
  time?: string;
  variant?: "mobile" | "desktop";
}

export default function BookingWidget({ slug, price, date, time, variant = "desktop" }: BookingWidgetProps) {
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleBooking() {
    if (!isAuthenticated) {
      window.location.href = "/auth/login";
      return;
    }
    setStatus("loading");
    try {
      const res = await registerForEvent(slug);
      setMessage(res.detail);
      setStatus("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Échec de l'inscription.");
      setStatus("error");
    }
  }

  if (variant === "mobile") {
    return (
      <section className="px-4 mt-8">
        {status === "done" ? (
          <p className="text-center text-primary font-bold text-sm py-3">{message}</p>
        ) : (
          <>
            <button
              onClick={handleBooking}
              disabled={status === "loading"}
              className="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_14px_rgba(41,163,163,0.4)] disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              {status === "loading" ? "Inscription..." : `Réserver un billet — ${price}`}
            </button>
            {status === "error" && <p className="text-center text-primary text-xs font-bold mt-2">{message}</p>}
          </>
        )}
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
          <p className="text-3xl font-black text-[#F0EDE8]">{price}</p>
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
        {status === "done" ? (
          <p className="text-center text-primary font-bold text-sm py-2">{message}</p>
        ) : (
          <>
            <button
              className="w-full bg-primary hover:bg-[#B8240C] text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-primary/20 text-base disabled:opacity-50"
              onClick={handleBooking}
              disabled={status === "loading"}
            >
              <span className="material-symbols-outlined text-lg">confirmation_number</span>
              {status === "loading" ? "Inscription..." : "Réserver un billet"}
            </button>
            {status === "error" && <p className="text-center text-primary text-xs font-bold">{message}</p>}
          </>
        )}
        <p className="text-[10px] text-[#4A443E] text-center">
          Paiement sécurisé • Annulation gratuite
        </p>
      </div>
    </div>
  );
}
