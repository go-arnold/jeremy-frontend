"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PasswordResetConfirmRoot() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/auth/login?error=Lien%20de%20r%C3%A9initialisation%20invalide");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-noise">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}