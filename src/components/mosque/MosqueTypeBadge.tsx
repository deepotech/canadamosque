import React from "react";
import { MosqueClassification } from "@/domain/mosque/types";
import {
  CLASSIFICATION_BADGE_VARIANTS,
  getClassificationDisplayName,
} from "@/domain/mosque/classification-display";

interface MosqueTypeBadgeProps {
  classification: MosqueClassification;
  showDot?: boolean;
  className?: string;
}

export function MosqueTypeBadge({
  classification,
  showDot = true,
  className = "",
}: MosqueTypeBadgeProps) {
  const variant = CLASSIFICATION_BADGE_VARIANTS[classification] || {
    bg: "bg-stone-100",
    text: "text-stone-800",
    border: "border-stone-200",
    dot: "bg-stone-500",
  };

  const displayName = getClassificationDisplayName(classification);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variant.bg} ${variant.text} ${variant.border} ${className}`}
      aria-label={`Place type: ${displayName}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${variant.dot}`}
          aria-hidden="true"
        />
      )}
      <span>{displayName}</span>
    </span>
  );
}
