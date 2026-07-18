# Guide de contribution

Recettes pas-à-pas pour les tâches récurrentes sur ce projet. Voir `CLAUDE.md` pour le contexte d'architecture général.

## Ajouter une nouvelle page de listing

Modèle à suivre : `app/podcasts/page.tsx` + `app/podcasts/PodcastsPageClient.tsx` (ou `app/artistes/`, `app/blog/`, `app/web-tv/` — même pattern partout).

1. **`app/ma-feature/page.tsx`** — Server Component **async**, sans `"use client"` :
   - Fait le(s) fetch(s) initial(aux) via `apiFetch` ou une fonction de `lib/services/*`.
   - Enveloppe dans un `try/catch` avec fallback vers `data/*.ts` en cas d'échec (voir n'importe quelle page existante pour le pattern exact).
   - Rend `<MaFeaturePageClient initialXxx={...} .../>` avec les données déjà chargées en props.
2. **`app/ma-feature/MaFeaturePageClient.tsx`** — Client Component (`"use client"`) :
   - `useState` initialisé directement depuis les props (pas de `useEffect` de fetch au montage).
   - Garde toute la logique interactive existante (handlers de filtre, `loadMore`, etc.).
   - Le JSX mobile/desktop et les sous-composants peuvent être déplacés ici tels quels.
3. Si la page a des routes `[slug]`, ajoute un `generateMetadata` (voir `app/blog/[slug]/page.tsx` pour le modèle : réutilise la même fonction de fetch que la page, retombe sur un titre générique si le fetch échoue).
4. Vérifie avec `npx tsc --noEmit` puis `npm run build`.

## Intégrer une nouvelle route API backend

1. **Vérifie le contrat réel** dans `docs/Art_du_Kivu_API.yaml` (spec OpenAPI) — cherche le endpoint et son schéma de réponse. Si le comportement observé en prod diffère du spec, fais confiance à la prod et documente l'écart en commentaire (comme déjà fait plusieurs fois dans `lib/mappers.ts`).
2. **Ajoute le type de réponse** dans `lib/api-types.ts` (`interface ApiXxx { ... }`) — jamais dans le service ou la page directement.
3. **Ajoute une fonction de mapping** dans `lib/mappers.ts` si la shape backend diffère de ce que les composants attendent (`mapApiXxxToYyy(apiXxx: ApiXxx): Yyy`).
4. **Ajoute la fonction d'appel** dans `lib/services/<domaine>.ts` (crée le fichier si le domaine n'existe pas encore) :
   ```ts
   import { apiFetch, PaginatedResponse } from "@/lib/api-client";
   import { mapApiXxxToYyy } from "@/lib/mappers";
   import type { ApiXxx } from "@/lib/api-types";

   export async function fetchXxx(page = 1) {
     const data = await apiFetch<PaginatedResponse<ApiXxx>>(`/api/v1/xxx/?page=${page}`);
     return { ...data, results: data.results.map(mapApiXxxToYyy) };
   }
   ```
5. Utilise cette fonction dans un Server Component (fetch initial) ou un Client Component (interactions).

## Ajouter/adapter un composant Mobile/Desktop

Ne jamais créer deux fichiers séparés (`Foo.tsx` + `FooDesktop.tsx`). Un seul composant :
- Si les layouts sont proches → un seul arbre JSX avec classes Tailwind responsive (`lg:`).
- Si les layouts divergent vraiment → une prop `variant?: "mobile" | "desktop"`, avec deux blocs JSX internes, mais un **seul** jeu de hooks/state partagé (jamais deux instances montées en parallèle du même flux audio/vidéo/websocket — voir le bug connu sur `LivePlayer` dans `CLAUDE.md`).

## Tests

`lib/*.test.ts` avec Vitest, pour les fonctions pures (`lib/mappers.ts`, `lib/image-utils.ts`, `lib/api-client.ts`). Pas besoin de jsdom/Testing Library pour ces cas — `vitest.config.ts` est en environnement `node`. Lance avec `npm test`.

## Avant de committer

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Les mêmes vérifications tournent en CI (`.github/workflows/ci.yml`) sur chaque push/PR.
