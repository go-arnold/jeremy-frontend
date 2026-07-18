# Implementation Plan

## Résumé des correctifs à apporter

Correction de 5 problèmes majeurs : (1) Google OAuth côté client, (2) Email de reset password pointant vers le mauvais URL, (3) Waveform podcast consolidé avec navigation, (4) Soumission médias communauté (video/audio), (5) Affichage médias communauté (image/video/audio).

## 1. Google OAuth côté client

**Problème :** Le flux Google redirige vers le backend (`/api/v1/auth/google/`) qui doit gérer le callback OAuth complet. Mais le FRONTEND_INTEGRATION.md dit que le backend attend POST avec `{ access_token }` (jeton Google obtenu côté client).

**Solution :** Implémenter Google Identity Services (GIS) côté client pour obtenir le token Google, puis l'envoyer au backend via `POST /api/v1/auth/google/` avec `{ access_token: googleToken }` via le proxy.

**Fichiers modifiés :**
- `app/auth/login/LoginForm.tsx` - Remplacer redirection par GSI
- `app/auth/register/page.tsx` - Remplacer redirection par GSI
- `app/api/auth/google/route.ts` - Modifier pour utiliser POST proxy

## 2. Password Reset - Lien 404

**Problème :** L'email contient `https://art-du-kivu-api.kelor.tech/password-reset-confirm/3/dbpra9-...`. Ce lien pointe vers le backend, pas vers le frontend Next.js.

**Solution :**
- Créer `app/password-reset-confirm/[uid]/[token]/page.tsx` - route Next.js pour capturer l'URL du backend
- Cette page redirige vers `/auth/reset-password?uid=...&token=...`
- Aussi modifier `redirect_url` dans forgot-password pour qu'il corresponde

**Fichiers créés :**
- `app/password-reset-confirm/[uid]/[token]/page.tsx`

**Fichier modifié :**
- `app/auth/forgot-password/page.tsx` - Améliorer redirect_url

## 3. Podcast Waveform

**Problème :** Double waveform (un décoratif dans EpisodePlayerDesktop et un fonctionnel dans EpisodePlayer). Le waveform décoratif n'est pas synchro avec le temps réel.

**Solution :** Supprimer le waveform décoratif dupliqué dans `[slug]/page.tsx` (EpisodePlayerDesktop). Le composant EpisodePlayer gère déjà le waveform avec progression, buffering et clic pour seek.

## 4. Communauté - Soumission médias

**Problème :** Dans SubmitTalentCard (mobile), les boutons image/video/audio existent. Le FormData multipart est envoyé via `/api/proxy`. Vérifier que le proxy gère correctement le multipart.

**Solution :** Vérifié dans proxy/route.ts : le multipart est bien géré (lignes 90-94). Pas de changement nécessaire côté proxy. Vérifier que le SubmitTalent (desktop inline) fonctionne aussi.

## 5. Communauté - Affichage médias et engagement

**Problème :** Les commentaires et likes fonctionnent déjà dans TalentPostCard et ArtPostCard. L'affichage des médias doit être dynamique selon ce que le backend renvoie.

**Solution :**
- Modifier PostRenderer dans `app/communaute/page.tsx` pour gérer l'affichage image/video/texte selon le type de média
- Améliorer la gestion des commentaires déjà présents

## 6. Build check

**Final :** Exécuter `npm run build` pour vérifier l'absence d'erreurs.