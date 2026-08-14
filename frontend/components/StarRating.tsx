"use client";

import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
  rating: number;
  onChange?: (value: number) => void;
  size?: number;
}

// Non-interactive by default (just pass `rating`). Pass `onChange` to make
// it a clickable 1-5 star input instead.
export default function StarRating({ rating, onChange, size = 16 }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = interactive ? n <= (hovered || rating) : n <= Math.round(rating);
        return (
          <button
            key={n}
            type="button"
            disabled={!interactive}
            onClick={() => onChange?.(n)}
            onMouseEnter={() => interactive && setHovered(n)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            {filled ? (
              <FaStar size={size} className="text-gold" />
            ) : (
              <FaRegStar size={size} className="text-ink/30" />
            )}
          </button>
        );
      })}
    </div>
  );
}
