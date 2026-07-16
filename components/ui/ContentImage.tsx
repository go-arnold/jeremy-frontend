"use client";

import { useEffect, useState } from "react";
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
}

export default function ContentImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  variant = "fill",
}: ContentImageProps) {
  const [failed, setFailed] = useState(!isValidImageSrc(src));

  useEffect(() => {
    setFailed(!isValidImageSrc(src));
  }, [src]);

  if (failed) {
    if (variant === "responsive") {
      return (
        <div
          className={`relative w-full aspect-[4/3] overflow-hidden ${className}`}
          role="img"
          aria-label={alt}
        >
          <PhotoPlaceholder />
        </div>
      );
    }

    return (
      <div className={`relative overflow-hidden ${className}`} role="img" aria-label={alt}>
        <PhotoPlaceholder />
      </div>
    );
  }

  if (variant === "responsive") {
    return (
      <img
        src={src!}
        alt={alt}
        className={`w-full h-auto object-cover ${className} ${imageClassName}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src!}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${imageClassName}`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
