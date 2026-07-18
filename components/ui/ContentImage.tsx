"use client";

import { useState } from "react";
import Image from "next/image";
import { isValidImageSrc } from "@/lib/image-utils";

function PhotoPlaceholder() {
  return (
    <div className="absolute inset-0 bg-[#3A4556] flex items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="w-[22%] h-[22%] min-w-8 min-h-8 text-[#6B7A8D]"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
      </svg>
    </div>
  );
}

interface ContentImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  variant?: "fill" | "responsive";
  /** Forwarded to next/image's `sizes` — override when the image occupies a known viewport
   * fraction (e.g. a full-width hero) so the browser doesn't fetch a larger source than needed. */
  sizes?: string;
  priority?: boolean;
}

export default function ContentImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  variant = "fill",
  sizes = "100vw",
  priority = false,
}: ContentImageProps) {
  const [failed, setFailed] = useState(!isValidImageSrc(src));
  // Reset `failed` when `src` changes, computed during render (React's documented pattern for
  // adjusting state from a prop change) instead of a useEffect — avoids an extra render pass and
  // the react-hooks/set-state-in-effect lint error.
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(!isValidImageSrc(src));
  }

  const wrapperClassName =
    variant === "responsive"
      ? `relative w-full aspect-[4/3] overflow-hidden ${className}`
      : `relative overflow-hidden ${className}`;

  if (failed) {
    return (
      <div className={wrapperClassName} role="img" aria-label={alt}>
        <PhotoPlaceholder />
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Image
        src={src!}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${imageClassName}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
