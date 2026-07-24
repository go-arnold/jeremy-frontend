---
name: design-consistency
description: Use when styling any new or existing component, page, or player. Ensures colors, type sizes, and utility classes match the established Art du Kivu design system instead of inventing new values.
---

# Design consistency check

1. Colors come from app/globals.css `@theme` tokens only — primary (#E63012,
   CTAs/focus), primary-dark (#B8240C hover), navy/navy-mid, background-dark/
   surface/surface-raised, accent-teal/accent-gold/accent-yellow, text-primary/
   text-muted/text-faint. Never invent a new hex value. Double-check primary
   vs accent-teal specifically — they've been confused in code/comments before.
2. Mobile text sizing: moderate, never imposing. Section titles text-base/
   text-lg (never text-xl+ on mobile), metadata text-[10px]/text-xs. This was
   established this session across Artistes/Communauté/Événements/Podcasts —
   match it on any new page.
3. Reuse existing utility classes before writing new CSS: .kivu-texture,
   .glass-nav, .card-glow, .live-dot, .kivu-divider, .animate-fade-up,
   .no-scrollbar (prefer this over the redundant .hide-scrollbar).
   CAUTION: .glass-nav is currently defined twice in globals.css (~line 60
   navy, ~line 154 red) — the red one wins the cascade. If a page suddenly
   renders .glass-nav in red, that's this known bug, not a new one — ask
   before "fixing" it, don't guess which definition is correct.
4. Auto-scrolling carousels: reuse the established pattern (setInterval +
   scrollIntoView smooth, snap-x snap-mandatory container, dot indicators —
   see Communauté défis, Événements "Prochainement", Podcasts "Récents").
   Don't introduce a carousel library.
5. Font: Epilogue via <link> in app/layout.tsx, not next/font — the
   no-page-custom-font ESLint warning there is known and non-blocking, don't
   "fix" it by switching to next/font without being asked.