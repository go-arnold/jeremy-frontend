---
name: mobile-desktop-variant
description: Use when creating a new component with different mobile/desktop layouts, or when encountering existing Foo.tsx/FooDesktop.tsx file pairs (known to exist on the artist page).
---

# Mobile/desktop component rule

1. Never create two files for one feature. Decide:
   - Layouts close enough → one JSX tree, responsive Tailwind classes (`lg:`).
   - Layouts genuinely diverge → one file, `variant?: "mobile" | "desktop"`
     prop, two internal JSX blocks, but ONE shared hook/state instance.
2. If the component owns any live audio/video/websocket state, that state
   must be lifted to a single point regardless of variant — never two
   instances of the same stream (see the live-player skill; this is the same
   bug class as LivePlayer).
3. Known existing violations to fix opportunistically when touched, not
   proactively unless asked (app/artistes/[slug]/page.tsx):
   - LatestReleases.tsx / LatestReleasesDesktop.tsx
   - PhotoGallery.tsx / PhotoGalleryDesktop.tsx
   - KivuTV.tsx / VideosDesktop.tsx
   These are real markup/class divergences, not simple duplicates — diff them
   carefully before merging, don't just delete one file.
4. Reuse shared UI instead of writing new inline versions:
   - components/ui/AuthPromptModal.tsx (login required)
   - components/ui/ShareMenu.tsx (native share + WhatsApp/FB/X/Telegram/copy fallback)
   - components/ui/ComingSoonModal.tsx (feature not ready backend-side)
   - components/ui/ContentImage.tsx (any image from the API — never a raw
     `style={{ backgroundImage: url(...) }}` div; ContentImage handles the
     http→https upgrade and broken-image fallback)
   Do not write a local variant of any of these, even a "small" one.