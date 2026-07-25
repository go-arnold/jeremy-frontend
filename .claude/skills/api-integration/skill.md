---
name: api-integration
description: Use when adding a new API route integration, replacing mock/static data with a real endpoint, or touching lib/api-types.ts, lib/mappers.ts, or lib/services/*. Covers the type → mapper → service → page pattern for Art du Kivu.
---

# API integration procedure

Follow CONTRIBUTING.md "Intégrer une nouvelle route API backend" exactly, in order:

1. Check the real contract in docs/Art_du_Kivu_API.yaml first. Never guess a
   field name or shape.
2. Add/extend the response type in lib/api-types.ts ONLY. Before adding a new
   `ApiXxx`, grep for it — if it already exists there, extend it, don't shadow
   it. Never define `interface ApiXxx` in a service, page, or types/*.ts file.
   This project has already had this exact bug twice (see CLAUDE.md "Problèmes
   connus" — ApiActivityEntry, ApiBadge, ApiChallenge, ApiPoll history).
3. If prod behavior diverges from the OpenAPI spec, trust prod, and add an
   inline comment in lib/mappers.ts explaining the divergence — follow the
   existing style (see the playback_hls_url / cf_ prefix and cover_url /
   image_url comments already in that file). The comment, not the YAML, is
   the source of truth going forward.
4. Add the mapping function in lib/mappers.ts: `mapApiXxxToYyy(apiXxx: ApiXxx): Yyy`.
5. Add the fetch function in lib/services/<domaine>.ts (create the file if the
   domain doesn't exist yet — 19 domains currently: analytics, articles,
   artists, auth, community, emissions, events, gamification, health, home,
   live_music, media, newsletter, podcasts, radio, releases, search, users, webtv):
```ts
   import { apiFetch, PaginatedResponse } from "@/lib/api-client";
   import { mapApiXxxToYyy } from "@/lib/mappers";
   import type { ApiXxx } from "@/lib/api-types";
   export async function fetchXxx(page = 1) {
     const data = await apiFetch<PaginatedResponse<ApiXxx>>(`/api/v1/xxx/?page=${page}`);
     return { ...data, results: data.results.map(mapApiXxxToYyy) };
   }
```
6. If this is a listing page: use ONE type per resource across all display
   variants (hero/compact/full list) — see EventGridItem and PodcastListItem
   as the reference pattern. Do not create a separate interface per card
   variant.
7. Server Component (page.tsx) calls the service function, wraps in try/catch
   with data/*.ts fallback, but the fallback must be visibly flagged (known
   gap — ~20 files currently fall back silently; don't add a 21st silent one).
8. Client Component receives data as props, `useState` initialized from props,
   no fetch-on-mount `useEffect`.
9. Before finishing: `npx tsc --noEmit`, `npm run lint` (must stay at 0
   no-explicit-any), `npm run build`.
10. Show the diff before applying.