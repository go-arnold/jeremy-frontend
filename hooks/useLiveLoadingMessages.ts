"use client";

import { useEffect, useState } from "react";

const MESSAGES = ["Encore un moment...", "Patientez svp", "Merci pour votre patience"];
const ROTATE_MS = 3500;

/** Cycles through a short list of French "still loading" messages while a live stream/video
 * hasn't started playing yet — shared by LivePlayer (radio), NowPlayingHero (live-music) and
 * LiveStreamPlayer (WebTV) instead of each inlining its own loading copy. Only meant to run
 * while genuinely loading/buffering — pass `false` (or an error/offline state) to stop rotating
 * and reset back to the first message. */
export function useLiveLoadingMessages(active: boolean): string {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, [active]);

  return active ? MESSAGES[index] : MESSAGES[0];
}
