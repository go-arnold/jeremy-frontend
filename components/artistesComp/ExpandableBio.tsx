"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  text: string;
  className?: string;
  /** Number of lines shown before truncating with a "Lire plus" toggle. */
  clampLines?: number;
}

/** Collapsible bio text — clamped to `clampLines` by default, with a "Lire plus"/"Lire moins"
 * toggle. Whether the toggle is needed at all is determined by actually measuring the rendered
 * text (scrollHeight vs clientHeight) rather than a character-count guess, since how many lines
 * a given string wraps to depends on the container width and font size, not just its length. */
export default function ExpandableBio({ text, className = "", clampLines = 2 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [canTruncate, setCanTruncate] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setCanTruncate(el.scrollHeight - el.clientHeight > 1);
  }, [text, clampLines]);

  if (!text) return null;

  return (
    <div>
      <p
        ref={ref}
        className={className}
        style={
          !expanded
            ? { display: "-webkit-box", WebkitLineClamp: clampLines, WebkitBoxOrient: "vertical", overflow: "hidden" }
            : undefined
        }
      >
        {text}
      </p>
      {canTruncate && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-primary text-xs font-bold hover:underline"
        >
          {expanded ? "Lire moins" : "Lire plus"}
        </button>
      )}
    </div>
  );
}
