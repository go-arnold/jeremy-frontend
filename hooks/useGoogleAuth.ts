"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Google Identity Services (GSI) popup flow, shared by login and register.
 *
 * Sends the JWT Google returns as BOTH `access_token` and `id_token`: dj-rest-auth's
 * `SocialLoginSerializer.validate()` requires `access_token` (or `code`) to be non-blank just
 * to pass validation, but only takes the fast, no-network-roundtrip verification path
 * (`GoogleOAuth2Adapter._decode_id_token`) when `id_token` is *also* present — sending the JWT
 * as `access_token` alone makes allauth treat it as an opaque OAuth token and call Google's
 * userinfo endpoint with it, which Google rejects (it's a signed JWT, not an opaque token).
 */
export function useGoogleAuth(onSuccess: () => void, onError: (message: string) => void) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const gsiInitializedRef = useRef(false);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onErrorRef.current = onError;

  const handleGoogleCredentialResponse = useCallback(async (response: CredentialResponse) => {
    if (!response?.credential) {
      onErrorRef.current("Aucun identifiant reçu de Google.");
      setGoogleLoading(false);
      return;
    }

    setGoogleLoading(true);

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: response.credential, id_token: response.credential }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.detail || data.message || "google_auth_failed");
      }

      onSuccessRef.current();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Échec de la connexion Google.";
      onErrorRef.current(message);
    } finally {
      setGoogleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (gsiInitializedRef.current) return;

    if (window.google?.accounts?.id) {
      gsiInitializedRef.current = true;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID!,
        callback: handleGoogleCredentialResponse,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      gsiInitializedRef.current = true;
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID!,
          callback: handleGoogleCredentialResponse,
        });
      }
    };
    document.head.appendChild(script);
  }, [handleGoogleCredentialResponse]);

  const triggerGoogleLogin = useCallback(() => {
    const gsi = window.google?.accounts?.id;
    if (gsi) {
      setGoogleLoading(true);
      gsi.prompt((notification: PromptMomentNotification) => {
        if (notification.isNotDisplayed()) {
          setGoogleLoading(false);
        }
      });
    } else {
      onErrorRef.current("Google Identity Services non chargé. Réessayez.");
    }
  }, []);

  return { googleLoading, triggerGoogleLogin };
}
