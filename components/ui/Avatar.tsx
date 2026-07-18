"use client";

import { useState } from "react";
import Image from "next/image";
import { isValidImageSrc } from "@/lib/image-utils";

const sizeMap = {
  xs: "w-7 h-7",
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-28 h-28",
} as const;

type AvatarSize = keyof typeof sizeMap;

function PersonSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.5 3.1-6.5 7-6.5s7 3 7 6.5" />
    </svg>
  );
}

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: AvatarSize | "custom";
  className?: string;
}

export default function Avatar({ src, alt, size = "md", className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(!isValidImageSrc(src));
  // Reset `failed` when `src` changes, computed during render (React's documented pattern for
  // adjusting state from a prop change) instead of a useEffect — avoids an extra render pass and
  // the react-hooks/set-state-in-effect lint error.
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(!isValidImageSrc(src));
  }

  const sizeClass = size === "custom" ? "" : sizeMap[size];

  if (failed) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-[#3A4556] flex items-center justify-center overflow-hidden shrink-0 ${className}`}
        role="img"
        aria-label={alt}
      >
        <PersonSilhouette className="w-[58%] h-[58%] text-[#8A96A8]" />
      </div>
    );
  }

  return (
    <div className={`relative ${sizeClass} rounded-full overflow-hidden shrink-0 ${className}`}>
      <Image
        src={src!}
        alt={alt}
        fill
        sizes="112px"
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
