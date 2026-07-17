"use client";

import { useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { registerForEvent } from "@/lib/services/events";

interface Props {
  slug: string;
  price: string;
}

export default function BookingButton({ slug, price }: Props) {
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
    } catch (err: any) {
      setMessage(err.message || "Échec de l'inscription.");
      setStatus("error");
    }
  }

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
