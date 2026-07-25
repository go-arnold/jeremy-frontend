# Journal d'intégration — Art du Kivu Frontend

Suivi page par page de l'état d'intégration API et de retouche design.
Séparé de `CLAUDE.md` (qui reste dédié à l'architecture) — ce fichier est un
tableau de bord vivant, à mettre à jour à chaque vérification ou correction.

## Méthodologie et niveau de confiance réel

**Ce qui a été vérifié le 2026-07-25** : `NEXT_PUBLIC_API_URL` n'est pas défini
dans `.env.local` (qui ne contient que `NEXT_PUBLIC_GOOGLE_CLIENT_ID`) — l'app
retombe donc sur l'URL par défaut codée en dur dans `lib/api-client.ts` :
`https://art-du-kivu-api.kelor.tech`. Cette URL a été testée directement par
`curl` (pas via l'app) contre chaque endpoint utilisé par les 11 pages listées
ci-dessous : le backend répond, et la plupart des endpoints renvoient de
vraies données (pas des tableaux vides ou des stubs).

**Ce qui n'a PAS été vérifié** : aucune de ces pages n'a été rendue dans un
navigateur (pas de `npm run dev` + visite réelle) au cours de cette
conversation. Un `curl` réussi sur `/api/v1/xxx/` prouve que le backend
répond avec de vraies données et que l'URL/la forme de la requête sont
correctes — il ne prouve **pas** que le rendu Next.js (fetch serveur →
mapper → composants → affichage réel) fonctionne de bout en bout. Aucune
ligne ci-dessous n'est donc marquée ✅ "confirmé réel" au sens strict — c'est
un ⚠️ plus précis et plus fort que "jamais testé", pas un ✅.

**Légende** :
- ✅ confirmé réel — l'app a été rendue dans un navigateur et le rendu avec
  données réelles a été constaté visuellement (aucune ligne n'y est
  actuellement, voir ci-dessus).
- ⚠️ backend confirmé (curl), rendu jamais vérifié — l'endpoint réel répond
  avec de vraies données, mais le rendu Next.js n'a jamais été observé.
- ⚠️ backend confirmé mais données vides — l'endpoint répond (200) mais le
  jeu de données de cet environnement est vide pour ce champ précis (pas un
  bug frontend, juste un backend peu peuplé).
- ❌ mock only — aucun appel réel n'existe, la page ne lit que `data/*.ts`.

## Tableau

| Page | Intégration API | Style (design skill) | Dernière vérif |
|---|---|---|---|
| `app/page.tsx` (Home) | ⚠️ backend confirmé (curl) — `GET /home/` → 200, payload réel (`banner`, `a_la_une`, `hits_du_mois`, `magazine`). Rendu Next.js jamais vérifié en navigateur. | non touché | 2026-07-25 (curl backend uniquement) |
| `app/artistes/page.tsx` | ⚠️ backend confirmé (curl) — `GET /artists/?page_size=15` → 200, 2 résultats réels. `GET /artists/genres/` → 200 mais **tableau vide** (aucun genre seedé) : le filtre par genre n'a rien à afficher sur cet environnement. Rendu jamais vérifié en navigateur. | retouché (passe mobile type-scale, session antérieure) | 2026-07-25 (curl backend) |
| `app/blog/page.tsx` | ⚠️ backend confirmé (curl) — `GET /articles/?page_size=15` → 200, 1 article réel. Rendu jamais vérifié en navigateur. | non touché (design) — mais service repointé vers `fetchArticles` et 6 divs `backgroundImage` remplacés par `ContentImage` sur la page détail cette session | 2026-07-25 (curl backend) |
| `app/communaute/page.tsx` | ⚠️ backend confirmé (curl) — posts (5 réels), défis (2 réels), sondages (1 réel), tous 200. Rendu jamais vérifié en navigateur. | retouché (passe mobile type-scale + carrousel défis, session antérieure) | 2026-07-25 (curl backend) |
| `app/evenements/page.tsx` | ⚠️ backend confirmé (curl) — `GET /events/?page_size=15` → 200, 3 réels. `GET /events/featured/` → 200, objet réel (corrigé cette session — remplace l'heuristique client `events.find(isFeatured)`). `GET /events/cities/` → 200 mais **tableau vide** : filtre ville sans options actuellement. Rendu jamais vérifié en navigateur. | retouché (passe mobile type-scale + carrousel "Prochainement", session antérieure) | 2026-07-25 (curl backend) |
| `app/podcasts/page.tsx` | ⚠️ backend confirmé (curl) — `GET /podcasts/episodes/?page_size=15` → 200, 4 réels. `GET /podcasts/categories/` → 200, catégories réelles. Rendu jamais vérifié en navigateur. | retouché (passe mobile type-scale + carrousel "Récents", session antérieure) | 2026-07-25 (curl backend) |
| `app/live-music/page.tsx` | ⚠️ backend confirmé mais données vides — `GET /live_music/sessions/current/` → 404 "aucune session live" (attendu, géré par `EmptyState`). `GET /live_music/programme/` → 200 mais `count:0` (aucune séance programmée sur cet environnement) : impossible de vérifier visuellement un rendu avec données non vides tant que le backend n'a rien à seeder. Rendu jamais vérifié en navigateur. | non touché (design) — mais bug double-mount audio (deux flux HLS parallèles) corrigé cette session via `NowPlayingHeroProvider` | 2026-07-25 (curl backend) |
| `app/radio-en-direct/page.tsx` | ⚠️ backend confirmé (curl) — `GET /radio/program/` → 200, 4 réels. `GET /radio/current/` → 404 "aucune radio en direct" (attendu, géré par `EmptyState`). Rendu jamais vérifié en navigateur. | non touché (design) — mais bug double-mount audio corrigé cette session via `LivePlayerProvider` | 2026-07-25 (curl backend) |
| `app/emissions/page.tsx` | ⚠️ backend confirmé (curl) — `GET /emissions/` → 200, 3 réels. `GET /emissions/live/` → 404 "aucune émission en direct" (attendu, géré). Rendu jamais vérifié en navigateur. | non touché | 2026-07-25 (curl backend) |
| `app/sorties-premieres/page.tsx` | ⚠️ backend confirmé mais données vides — `GET /releases/?...` → 200, 1 réel. `GET /releases/featured/` → 404 "aucune sortie à la une" (attendu, géré). `GET /releases/calendar/` → 200 mais **tableau vide** (aucune date seedée). Rendu jamais vérifié en navigateur. | non touché | 2026-07-25 (curl backend) |
| `app/web-tv/page.tsx` | ⚠️ backend confirmé (curl) — `GET /webtv/videos/?page_size=15` → 200, 15 réels (le domaine le mieux peuplé). `GET /webtv/videos/premiers/` → 200, réel. `GET /webtv/videos/live/` → 404 "aucune vidéo en direct" (attendu, géré). Rendu jamais vérifié en navigateur. | non touché (design) — mais les 5 pages catégories clones (`concerts`, `documentaires`, `freestyles`, `interviews`, `studio-sessions`) alignées sur ce pattern (mapper + `ContentImage`) cette session | 2026-07-25 (curl backend) |

## Prochaine étape suggérée

Pour passer une ligne de ⚠️ à ✅ sur une page donnée : lancer `npm run dev`,
visiter la page dans un navigateur, et confirmer visuellement que les
données affichées correspondent aux données réelles vues via `curl`
ci-dessus (pas les fallbacks `data/*.ts`). À faire page par page, pas toutes
en une fois.
