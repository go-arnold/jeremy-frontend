"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PasswordResetConfirmRedirect() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const uid = params?.uid as string;
    const token = params?.token as string;
    if (uid && token) {
      router.replace(`/auth/reset-password?uid=${encodeURIComponent(uid)}&token=${encodeURIComponent(token)}`);
    } else {
      router.replace("/auth/login?error=Lien%20de%20r%C3%A9initialisation%20invalide");
    }
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-noise">
      <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}