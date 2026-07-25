# Backend Gaps — suivi des demandes au backend

Journal cumulatif des manques côté API découverts en auditant le frontend page
par page — champs qui n'existent pas, endpoints qu'il faudrait ajouter, ou
comportements ambigus à clarifier avec l'équipe backend. Un ajout par gap
trouvé, jamais retiré une fois résolu (juste marqué 🟢) — sert d'historique.

Distinct de `INTEGRATION_LOG.md` (qui suit l'état d'intégration API
page par page) et de `CLAUDE.md` (architecture frontend). Ici : uniquement
ce qui manque ou est ambigu **côté backend**.

## Légende statut

- 🔴 signalé — envoyé au backend, pas encore de réponse/action
- 🟡 en discussion — réponse reçue, en cours de clarification ou d'implémentation
- 🟢 résolu — le backend a ajouté/corrigé, confirmé côté frontend

## Gaps

| Date | Page / Feature | Ce qui manque | Ce qu'il faut côté backend | Statut |
|---|---|---|---|---|
| 2026-07-25 | Accueil (`/`) — section "Contenus à la Une" | Aucun champ n'existe pour cette section ; 100% statique côté frontend (`data/home.ts`, jamais remplacé par un appel API) | Champ `contenus_a_la_une` dans l'agrégat `/api/v1/home/` — liste hétérogène `{type, id, slug, title, description, image_url}` | 🔴 signalé |
| 2026-07-25 | Accueil (`/`) — `banner.title_highlight` | Le frontend lit `apiBanner.title_highlight` mais ce champ n'existe ni dans la vraie réponse ni dans l'exemple du spec OpenAPI | Confirmer si le champ est prévu (mot du titre à mettre en couleur) ou si le frontend doit simplement le retirer | 🔴 signalé |
| 2026-07-25 | Accueil (`/`) — libellé de période Top 10 | `period="JUIN 2026"` en dur côté frontend, ne suit aucune donnée réelle | Champ `hits_du_mois_period` (ex. `"2026-07"` ou `"Juillet 2026"`) à côté de `hits_du_mois` dans `/api/v1/home/` | 🔴 signalé |
| 2026-07-25 | Communauté — participer à un défi | `POST /community/challenges/{slug}/join/` attendait le schéma de *création* d'un défi, pas une réponse (média+titre+description) | Nouvel endpoint `POST /community/challenges/{slug}/participate/` (média+titre+description, réponse `CommunityPost`) | 🟢 résolu — confirmé en direct (401 sur `participate/`, le frontend l'appelle déjà dans `ChallengeResponseForm.tsx`) |
| 2026-07-25 | Communauté — relier une participation à son défi | `CommunityPost.post_type` n'avait que `talent\|art\|news`, aucun champ ne reliait un post à un défi | `post_type` += `challenge_response` ; champ `challenge` sur `CommunityPost` | 🟢 résolu — confirmé en direct (`challenge_response` dans l'enum, champ `challenge` présent, `?post_type=challenge_response` renvoie `count: 0` correctement au lieu de la liste complète) |
| 2026-07-25 | Communauté — indicateur "déjà participé" à un défi | `Challenge` n'exposait aucune info sur la participation de l'utilisateur courant | Champ `has_participated: boolean` sur `Challenge` | 🟢 résolu — confirmé en direct (`has_participated: false` présent sur chaque défi réel) |
| 2026-07-25 | Communauté — résultat de défi épinglé | Rien ne permettait à un admin de publier un résultat de défi épinglé au-dessus des participations | `CommunityPost.is_pinned_result: boolean` + route admin `POST /community/challenges/{slug}/publish_result/` | 🟢 résolu — confirmé en direct (`is_pinned_result` présent sur `CommunityPost`, route `publish_result/` répond 401 donc existe) |
| 2026-07-25 | Communauté — filtre `?challenge={slug}` sur `/community/posts/` | Nécessaire pour paginer les participations d'un défi précis (alternative retenue à une route dédiée) | Confirmer que `GET /community/posts/?challenge={slug}` filtre réellement — **pas encore vérifiable** : aucune vraie participation n'existe encore sur l'environnement de test pour tester ce filtre en conditions réelles | 🟡 en discussion — à retester dès qu'une vraie participation existe |
| 2026-07-25 | Communauté — forme réelle du champ `challenge` sur `CommunityPost` | Le champ peut être un objet `{id, slug, title}` ou un simple slug (string) selon la doc de proposition — la forme réelle n'a pas pu être confirmée (aucune participation réelle à inspecter) | Confirmer quelle forme est réellement envoyée une fois qu'une participation existe, pour que le frontend arrête de deviner | 🟡 en discussion — le frontend gère maintenant les deux formes en attendant (défensif, pas une confirmation) |
| 2026-07-25 | Communauté — sondages : pas d'indicateur "déjà voté" | Contrairement aux défis (`has_participated`), rien n'indique côté API si l'utilisateur courant a déjà voté à un sondage — un utilisateur qui revient revoit l'interface de vote vierge, clique, puis reçoit une erreur | Champ du type `has_voted: boolean` (ou `user_vote_option_id`) sur `Poll`, même logique que `has_participated` pour les défis | 🔴 signalé |

Le détail technique complet des demandes Communauté/Défis (formes de payload
proposées, exemples) reste dans `docs/COMMUNAUTE_BACKEND_REQUIREMENTS.md` —
ce tableau-ci n'en garde que le suivi de statut à jour.

## Constats de données (pas des gaps API — juste noté pour contexte)

Champs qui existent bien côté backend mais sont vides sur l'environnement de
test actuel — pas une action pour le backend, juste à garder en tête en
débuggant :
- Accueil : `banner` (title/subtitle/cta vides, image_url `null`),
  `a_la_une.artist_of_month` (`null`), `magazine` (`hero: null`,
  `articles: []`).
- Événements : `events/cities/` renvoie `[]` (aucune ville seedée).
- Artistes : `artists/genres/` renvoie `[]` (aucun genre seedé).
- Live-music : `live_music/programme/` renvoie `count: 0`.
