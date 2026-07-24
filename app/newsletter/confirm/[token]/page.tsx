"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { confirmNewsletterSubscription } from "@/lib/services/newsletter";

export default function NewsletterConfirmPage() {
  const params = useParams();
  const token = params?.token as string | undefined;
  const [status, setStatus] = useState<"loading" | "success" | "error">(token ? "loading" : "error");
  const [message, setMessage] = useState(
    token ? "Confirmation de votre abonnement..." : "Lien de confirmation invalide."
  );

  useEffect(() => {
    if (!token) return;

    confirmNewsletterSubscription(token)
      .then((res) => {
        setStatus("success");
        setMessage(res.detail || "Votre abonnement à la newsletter est confirmé !");
      })
      .catch((error) => {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "La confirmation a échoué. Le lien est peut-être expiré."
        );
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-noise relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2347]/40 via-transparent to-[#E63012]/10 pointer-events-none" />

      <div className="w-full max-w-sm relative z-10 bg-[#12223c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div
          className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
            status === "success"
              ? "bg-green-500/20 text-green-500"
              : status === "error"
              ? "bg-primary/20 text-primary"
              : "bg-white/10 text-white animate-pulse"
          }`}
        >
          <span className="material-symbols-outlined text-3xl">
            {status === "success" ? "mark_email_read" : status === "error" ? "error" : "hourglass_empty"}
          </span>
        </div>

        <h1 className="text-xl font-black text-[#F0EDE8] mb-3 uppercase tracking-tight">
          Newsletter <span className="text-primary">Confirmation</span>
        </h1>

        <p className="text-[#8A8178] text-sm font-medium leading-relaxed mb-8">{message}</p>

        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center px-8 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-[#F0EDE8] hover:bg-white/10 transition-all uppercase tracking-widest"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
