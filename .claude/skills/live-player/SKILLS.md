---
name: live-player
description: Use when touching LivePlayer, NowPlayingHero, KivuTV, or any component playing HLS audio/video. Covers the single-instance rule, the variant-mounted-twice bug pattern, and buffering-state copy.
---

# Live player procedure

1. Rule: one HLS instance and one <audio>/<video> element per logical stream,
   ALWAYS — even if the component internally supports a `variant` prop.
   A `variant`-aware component is still broken if it's mounted twice at the
   call site (this is the live bug in LivePlayer: it's merged into one file
   with `variant="mobile"|"desktop"`, but app/radio-en-direct/page.tsx mounts
   it twice, CSS-hiding one — so two HLS streams still run in parallel).
   Fix pattern: render the component ONCE, do the mobile/desktop visual split
   inside that single instance's JSX (see NowPlayingHero/liveMusic, which
   already lifts audio state to the parent correctly).
2. Before editing any player component, check whether it's mounted more than
   once anywhere in the page tree (grep the page file for the component name)
   — this is the actual failure mode here, not just "duplicate files."
3. Buffering/loading text: use a shared hook (create
   lib/hooks/useLiveLoadingMessages.ts if it doesn't exist yet) cycling
   ["Encore un moment...", "Patientez svp", "Merci pour votre patience"].
   Never inline loading strings in a player component directly.
4. Drive the loading state off real media events (waiting/loadstart/playing),
   not a fixed timeout.
5. Player chrome styling pulls from the design tokens in CLAUDE.md
   (primary #E63012 for controls/focus, not accent-teal — these are easy to
   confuse and CLAUDE.md explicitly warns they're different colors).
6. Show a diff before applying. Flag explicitly if a fix touches more than
   one mount site.