"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { apiFetch } from '@/lib/api-client';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const key = searchParams.get('key');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Vérification de votre compte...');
  const router = useRouter();

  useEffect(() => {
    if (!key) {
      setStatus('error');
      setMessage('Clé de vérification manquante.');
      return;
    }

    async function verify() {
      try {
        await apiFetch('/api/v1/auth/verify-email/', {
          method: 'POST',
          body: JSON.stringify({ key }),
        });

        setStatus('success');
        setMessage('Votre compte a été vérifié avec succès !');
        setTimeout(() => router.push('/auth/login'), 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'La vérification a échoué. La clé est peut-être expirée.');
      }
    }

    verify();
  }, [key, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-noise relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D2347]/40 via-transparent to-[#E63012]/10 pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10 bg-[#12223c]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl">
        <div className={`w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center ${
          status === 'success' ? 'bg-green-500/20 text-green-500' : 
          status === 'error' ? 'bg-primary/20 text-primary' : 
          'bg-white/10 text-white animate-pulse'
        }`}>
          <span className="material-symbols-outlined text-3xl">
            {status === 'success' ? 'verified' : status === 'error' ? 'error' : 'hourglass_empty'}
          </span>
        </div>

        <h1 className="text-xl font-black text-[#F0EDE8] mb-3 uppercase tracking-tight">
          Vérification <span className="text-primary">Email</span>
        </h1>
        
        <p className="text-[#8A8178] text-sm font-medium leading-relaxed mb-8">
          {message}
        </p>

        {status === 'success' && (
          <p className="text-[10px] text-[#8A8178] mb-4">Redirection vers la connexion dans 3 secondes...</p>
        )}

        <Link 
          href="/auth/login" 
          className="inline-flex h-12 items-center justify-center px-8 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-[#F0EDE8] hover:bg-white/10 transition-all uppercase tracking-widest"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
