import { MosqueClassification } from "@/domain/mosque/types";

/**
 * Standard human-readable display names for canonical place types.
 * Strictly adheres to the project classification rules:
 * A Musalla must not masquerade as a full Mosque, a Jummah-only location
 * must not be presented as a normal Mosque, etc.
 */
export const CLASSIFICATION_DISPLAY_NAMES: Record<MosqueClassification, string> = {
  MOSQUE: "Mosque",
  ISLAMIC_CENTER: "Islamic Center",
  MUSALLA: "Musalla",
  PRAYER_ROOM: "Prayer Room",
  JUMMAH_LOCATION: "Jummah Location",
  COMMUNITY_CENTER: "Community Center",
  ORGANIZATION: "Organization",
  REVIEW_REQUIRED: "Under Review",
  EXCLUDE: "Excluded",
};

/**
 * Short descriptive explanations of each canonical place type.
 */
export const CLASSIFICATION_DESCRIPTIONS: Record<MosqueClassification, string> = {
  MOSQUE: "Dedicated masjid facility offering daily congregational prayers and community services.",
  ISLAMIC_CENTER: "Multi-functional Islamic center offering daily prayers, community education, and religious programs.",
  MUSALLA: "Dedicated Muslim prayer hall, commonly established in commercial plazas or neighborhoods.",
  PRAYER_ROOM: "Designated multi-faith or Muslim prayer room inside a building or campus.",
  JUMMAH_LOCATION: "Rented hall or temporary facility hosting Friday (Jummah) congregational prayers.",
  COMMUNITY_CENTER: "Community center or association serving the local Muslim community.",
  ORGANIZATION: "Islamic organization, charity, or administrative association office.",
  REVIEW_REQUIRED: "Location pending canonical classification review.",
  EXCLUDE: "Location excluded from the public directory.",
};

/**
 * UI badge style configuration for each place type.
 */
export const CLASSIFICATION_BADGE_VARIANTS: Record<
  MosqueClassification,
  {
    bg: string;
    text: string;
    border: string;
    dot: string;
  }
> = {
  MOSQUE: {
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-200",
    dot: "bg-emerald-600",
  },
  ISLAMIC_CENTER: {
    bg: "bg-teal-50",
    text: "text-teal-800",
    border: "border-teal-200",
    dot: "bg-teal-600",
  },
  MUSALLA: {
    bg: "bg-sky-50",
    text: "text-sky-800",
    border: "border-sky-200",
    dot: "bg-sky-600",
  },
  PRAYER_ROOM: {
    bg: "bg-indigo-50",
    text: "text-indigo-800",
    border: "border-indigo-200",
    dot: "bg-indigo-600",
  },
  JUMMAH_LOCATION: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-600",
  },
  COMMUNITY_CENTER: {
    bg: "bg-stone-100",
    text: "text-stone-800",
    border: "border-stone-300",
    dot: "bg-stone-500",
  },
  ORGANIZATION: {
    bg: "bg-stone-100",
    text: "text-stone-700",
    border: "border-stone-200",
    dot: "bg-stone-400",
  },
  REVIEW_REQUIRED: {
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-200",
    dot: "bg-rose-600",
  },
  EXCLUDE: {
    bg: "bg-stone-50",
    text: "text-stone-500",
    border: "border-stone-200",
    dot: "bg-stone-300",
  },
};

export function getClassificationDisplayName(classification: MosqueClassification): string {
  return CLASSIFICATION_DISPLAY_NAMES[classification] || "Location";
}

export function getClassificationDescription(classification: MosqueClassification): string {
  return CLASSIFICATION_DESCRIPTIONS[classification] || "";
}
