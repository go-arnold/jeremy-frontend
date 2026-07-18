"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, refreshUser, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/mon-profil');
    }
  }, [isAuthenticated, authLoading, router]);

  // (PDF) Google login should land on the home page, not the profile page.
  // The Google flow sets cookies via a raw fetch (bypassing AuthProvider), so `user` state never
  // updates on its own — without refreshUser() here, the redirect to "/" lands on a page that
  // still thinks you're logged out.
  const { googleLoading, triggerGoogleLogin } = useGoogleAuth(
    async () => {
      await refreshUser();
      router.push('/');
    },
    (message) => setError(message)
  );

  const handleGoogleLogin = () => {
    setError('');
    triggerGoogleLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    try {
      // Use email as username if not provided to ensure backend compatibility
      const regData = { 
        username: username || email.split('@')[0], 
        email, 
        password1: password, 
        password2: confirmPassword 
      };
      await register(regData);
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError((err instanceof Error ? err.message : null) || "Échec de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-noise relative py-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2347]/40 via-transparent to-[#E63012]/10 pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        <div className="bg-[#12223c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl animate-fade-up">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-[#F0EDE8] mb-1 uppercase tracking-tight">
              Créer un <span className="text-primary">Compte</span>
            </h1>
            <p className="text-[#8A8178] text-xs font-medium">
              Rejoignez la communauté culturelle
            </p>
          </div>

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
                <Image src="https://www.google.com/favicon.ico" width={16} height={16} className="grayscale group-hover:grayscale-0 transition-all" alt="Google" />
              )}
              <span className="text-xs font-bold text-[#F0EDE8]">{googleLoading ? 'Connexion...' : 'Continuer avec Google'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[9px] font-black text-[#4A443E] uppercase tracking-widest">Ou s&apos;inscrire par email</span>
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
                Utilisateur
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4A443E] text-base">
                  person
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="KivuLover"
                  className="w-full h-11 pl-10 pr-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#8A8178] ml-1">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4A443E] text-base">
                  mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre@email.com"
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

            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-[#8A8178] ml-1">
                Confirmer
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4A443E] text-base">
                  lock_reset
                </span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 bg-black/30 border border-white/5 rounded-xl text-sm text-white placeholder:text-gray-600 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-11 bg-[#0D2347] hover:bg-[#122b5e] text-[#F0EDE8] font-black rounded-xl uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-white/5"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  S&apos;inscrire
                  <span className="material-symbols-outlined text-base">person_add</span>
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-[#8A8178]">
            Déjà un compte ?{" "}
            <Link href="/auth/login" className="text-primary font-black uppercase hover:underline ml-1">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
