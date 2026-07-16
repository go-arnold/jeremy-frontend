"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  no_code: 'Connexion Google annulée.',
  no_token: 'Impossible de récupérer le token Google. Réessayez.',
  server_error: 'Erreur serveur lors de la connexion Google.',
  access_denied: 'Accès refusé. Veuillez autoriser la connexion Google.',
  google_auth_failed: 'Échec de l\'authentification Google.',
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const oauthError = searchParams.get('error');
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(
    oauthError ? (GOOGLE_ERROR_MESSAGES[oauthError] || decodeURIComponent(oauthError)) : ''
  );
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/mon-profil');
    }
  }, [isAuthenticated, authLoading, router]);

  const { googleLoading, triggerGoogleLogin } = useGoogleAuth(
    () => router.push('/mon-profil'),
    (message) => setError(message)
  );

  const handleGoogleLogin = () => {
    setError('');
    triggerGoogleLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ 
        username: identifier, 
        email: identifier.includes('@') ? identifier : undefined, 
        password 
      });
      router.push('/mon-profil');
    } catch (err: any) {
      setError(err.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-noise relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2347]/40 via-transparent to-[#E63012]/10 pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#12223c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-up">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-[#F0EDE8] mb-1 uppercase tracking-tight">
              Bon <span className="text-primary">Retour</span>
            </h1>
            <p className="text-[#8A8178] text-xs font-medium">
              Connectez-vous pour accéder à votre univers
            </p>
          </div>

          {registered === 'true' && !error && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">verified</span>
              Compte créé ! Connectez-vous maintenant.
            </div>
          )}

          <div className="flex flex-col gap-3 mb-6">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all group active:scale-95 shadow-lg shadow-black/20 disabled:opacity-50"
            >
              {googleLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" alt="Google" />
              )}
              <span className="text-xs font-bold text-[#F0EDE8]">{googleLoading ? 'Connexion...' : 'Continuer avec Google'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black text-[#4A443E] uppercase tracking-widest">Ou vos identifiants</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {error && (
            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#8A8178] ml-1">
                Email ou Pseudo
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4A443E] text-base">
                  person
                </span>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="votre@email.com ou pseudo"
                  className="w-full h-11 pl-10 pr-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#8A8178] ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4A443E] text-base">
                  lock
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" className="text-[10px] font-bold text-[#8A8178] hover:text-primary transition-colors">
                Oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 h-11 bg-[#0D2347] hover:bg-[#122b5e] text-[#F0EDE8] font-black rounded-xl uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-white/5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Se Connecter
                  <span className="material-symbols-outlined text-base">login</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-[#8A8178]">
            Pas encore de compte ?{" "}
            <Link href="/auth/register" className="text-primary font-black uppercase hover:underline ml-1">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}