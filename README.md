# Art du Kivu — Frontend

Plateforme culturelle et sonore du Kivu : radio en direct, web-TV, podcasts, blog/magazine, événements, communauté et profil utilisateur gamifié. Frontend Next.js consommant l'API REST Django d'Art du Kivu.

> Pour le contexte d'architecture et les conventions du projet, voir [`CLAUDE.md`](./CLAUDE.md). Pour les recettes pas-à-pas (ajouter une page, intégrer une API), voir [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Stack

- [Next.js 16](https://nextjs.org) (App Router, React Server Components)
- [React 19](https://react.dev)
- TypeScript (mode `strict`)
- [Tailwind CSS 4](https://tailwindcss.com)
- `hls.js` pour la lecture des flux live (radio, web-TV, live music)

## Prérequis

- Node.js 20+
- Un accès à l'API backend Art du Kivu (voir variables d'environnement ci-dessous)

## Variables d'environnement

Créer un fichier `.env.local` à la racine (non commité — voir `.gitignore`) :

| Variable | Requis | Description | Défaut si absent |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Non | URL de base de l'API backend Django | `https://art-du-kivu-api.kelor.tech` |
| `NEXT_PUBLIC_WS_BASE_URL` | Non | URL de base WebSocket pour les salons live (chat radio/live music/web-TV) | `wss://art-du-kivu-api.kelor.tech` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Oui (pour la connexion Google) | Client ID OAuth Google utilisé par le flux de connexion via Google Identity Services | — |
| `NEXT_PUBLIC_SITE_URL` | Non | URL publique du site, utilisée pour les métadonnées SEO/Open Graph, `robots.ts` et `sitemap.ts` | `https://artdukivu.com` |
| `NEXT_PUBLIC_APP_URL` | Non | URL de base utilisée pour construire les liens de réinitialisation de mot de passe envoyés par email | `http://localhost:3000` |

Les tokens d'authentification (`access_token`, `refresh_token`) sont gérés exclusivement via des cookies `httpOnly` posés par les routes serveur (`app/api/auth/*`) — ils ne transitent jamais côté client.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Sert le build de production |
| `npm run lint` | ESLint (`eslint-config-next` core-web-vitals + typescript) |
| `npm test` | Tests (Vitest) |

## Architecture

```
app/                  Routes App Router (pages, layouts, route handlers /api/*)
  api/auth/           Connexion, inscription, refresh token, OAuth Google — tokens en cookies httpOnly
  api/proxy/          Proxy interne vers l'API backend (attache le Bearer token depuis les cookies)
  api/media/          Signature d'upload Cloudinary
components/           Composants React, organisés par feature (blog/, evenements/, webTv/, ...)
  ui/                 Primitives génériques réutilisées (ContentImage, Avatar, EngagementBar, ...)
data/                 Données de secours (fallback) affichées si l'appel API échoue
hooks/                Hooks partagés (streaming audio/live, engagement, heartbeat de consommation)
lib/
  api-client.ts       Client HTTP central (apiFetch), extraction d'erreurs, cache serveur
  services/           Appels API groupés par domaine (articles, artistes, événements, ...)
  mappers.ts          Fonctions de mapping shape-backend → shape-frontend (avec le raisonnement documenté par champ)
providers/            Contextes React globaux (AuthProvider)
types/                Types TypeScript partagés par domaine
proxy.ts               Protection serveur des routes authentifiées (ex: /mon-profil) — convention Next.js 16 (anciennement middleware.ts)
docs/                 Spécification OpenAPI de référence et archives de documents de suivi de projet
```

## Notes d'architecture

- **Auth** : tokens en cookies `httpOnly`/`secure`/`sameSite=lax`, jamais exposés au JS client. Le refresh est géré côté serveur (`lib/server/refreshAccessToken.ts`) et déclenché automatiquement sur 401 par `/api/proxy` et `/api/auth/me`.
- **Fetching** : les Server Components appellent l'API directement via `lib/api-client.ts` ; le code client passe systématiquement par `/api/proxy` pour ne jamais exposer l'URL/API réelle ni manipuler le token directement.
- **Fallback** : plusieurs pages retombent sur des données statiques (`data/*.ts`) si l'appel API échoue, pour éviter un écran vide en cas d'incident backend — ce mode dégradé n'est aujourd'hui pas signalé visuellement à l'utilisateur, à garder en tête en debug.
