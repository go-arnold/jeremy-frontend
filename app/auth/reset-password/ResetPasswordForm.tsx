"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const uid = searchParams.get('uid');
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uid || !token) {
      setError('Lien de réinitialisation invalide ou expiré.');
    }
  }, [uid, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!uid || !token) {
      setError('Lien de réinitialisation manquant.');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/api/v1/auth/password/reset/confirm/', {
        method: 'POST',
        body: JSON.stringify({
          uid,
          token,
          new_password1: password,
          new_password2: confirmPassword,
        }),
      });
      setMessage('Votre mot de passe a été réinitialisé avec succès.');
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
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
              Nouveau <span className="text-primary">Mot de Passe</span>
            </h1>
            <p className="text-[#8A8178] text-xs font-medium">
              Définissez votre nouveau mot de passe
            </p>
          </div>

          {message && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {message}
            </div>
          )}

          {error && (
            <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-3 py-2 rounded-xl mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          {(!message && uid && token) && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-black uppercase tracking-widest text-[#8A8178] ml-1">
                  Nouveau mot de passe
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
                  Confirmer le mot de passe
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
                className="mt-2 h-11 bg-[#0D2347] hover:bg-[#122b5e] text-[#F0EDE8] font-black rounded-xl uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-white/5"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Changer le mot de passe
                    <span className="material-symbols-outlined text-base">key</span>
                  </>
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-[11px] text-[#8A8178]">
            Retour à la{" "}
            <Link href="/auth/login" className="text-primary font-black uppercase hover:underline ml-1">
              Connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
