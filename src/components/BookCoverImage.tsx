"use client";

import Image from "next/image";
import { useState } from "react";

export default function BookCoverImage({
  src,
  priority = false,
  imageClassName = "",
  sizes = "(max-width: 768px) 50vw, 200px",
}: {
  src: string;
  priority?: boolean;
  imageClassName?: string;
  sizes?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-full relative aspect-2/3">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <Image
        src={src}
        alt="book cover"
        fill
        priority={priority}
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${imageClassName}`}
      />
    </div>
  );
}
