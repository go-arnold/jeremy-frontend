# Art du Kivu — Frontend

Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind 4. Consomme l'API Django REST d'Art du Kivu.

## Architecture — à savoir avant de toucher au code

- **Server Components** (`page.tsx` async) appellent l'API directement via `lib/api-client.ts` (`apiFetch`).
- **Client Components** appellent aussi `apiFetch`, mais celui-ci route automatiquement vers `/api/proxy` (`app/api/proxy/route.ts`) côté navigateur — jamais l'URL réelle de l'API, jamais le token manipulé côté client.
- **Auth** : `access_token`/`refresh_token` en cookies `httpOnly`, jamais en `localStorage`/JS. Le refresh est géré côté serveur (`lib/server/refreshAccessToken.ts`), déclenché automatiquement sur 401 par `/api/proxy` et `/api/auth/me`.
- **`proxy.ts`** (racine) est la convention Next.js 16 de middleware (anciennement `middleware.ts`) — protège `/mon-profil` côté serveur. Ne pas confondre avec `app/api/proxy/route.ts` (notre proxy API interne) : coïncidence de nom, aucun rapport entre les deux fichiers.
- **`lib/api-types.ts` est la SEULE source de vérité pour les types de réponse API**, dérivée de `docs/Art_du_Kivu_API.yaml`. Ne jamais redéfinir un `interface ApiXxx` local dans un service ou une page — ça a déjà causé des incompatibilités de types silencieuses (fixé une fois, ne pas réintroduire). Toujours `import type { ApiXxx } from "@/lib/api-types"`.
- **`lib/mappers.ts`** convertit les shapes API brutes vers les types frontend (`@/types/*`). Les commentaires inline documentent les écarts réels entre le spec OpenAPI et le comportement observé en prod (ex: `playback_hls_url` sans préfixe `cf_` après une migration Cloudflare→MediaMTX) — ces commentaires priment sur le YAML s'ils divergent.
- **Pattern de page** : `page.tsx` (Server Component) fait le fetch initial avec fallback vers `data/*.ts` en cas d'échec API, puis rend un composant client `XxxPageClient.tsx` qui reçoit les données initiales en props et gère l'interactivité (filtres, pagination "voir plus").
- **Composants Mobile/Desktop** : plus de paires de fichiers dupliquées. Un seul composant par feature, soit unifié via des classes Tailwind responsive (`lg:`), soit via une prop `variant?: "mobile" | "desktop"` quand les layouts divergent réellement — jamais deux fichiers séparés pour la même feature.

## Commandes

```bash
npm run dev       # serveur de dev (Turbopack)
npm run build     # build de production — doit toujours passer sans erreur
npm run lint      # ESLint
npm test          # Vitest
```

## Problèmes connus / dette technique restante

- `LivePlayer` (`components/radio-en-direct/`) monte simultanément ses variantes mobile ET desktop (masquées en CSS), donc deux flux audio HLS tournent en parallèle. Corrigé sur `NowPlayingHero` (liveMusic) mais pas ici — nécessite de remonter le state audio au composant parent plutôt qu'une simple fusion de fichiers.
- ~130 erreurs ESLint `no-explicit-any` subsistent hors des "couches centrales" (`lib/mappers.ts`, `lib/services/*`, `providers/AuthProvider.tsx` sont propres ; le reste des composants/pages ne l'est pas encore).
- Plusieurs pages retombent silencieusement sur des données mockées (`data/*.ts`) si l'appel API échoue, sans indicateur visuel. Si un rendu semble "faux" en debug, vérifier d'abord si l'API a réellement répondu.

## Référence

`docs/Art_du_Kivu_API.yaml` = spec OpenAPI à jour du backend (source de vérité pour les shapes de réponse). `docs/archive/` contient d'anciens documents de suivi de projet, sans valeur de référence technique.

Voir aussi `CONTRIBUTING.md` pour les recettes pas-à-pas (ajouter une page, intégrer une nouvelle route API).
