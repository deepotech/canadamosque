/**
 * Ingestion Boundary Contract
 * 
 * Defines the shape of raw scraped/sourced records (such as toronto.json).
 * This raw schema must NEVER be returned directly by public API endpoints or rendered directly
 * in public pages without passing through the validation, classification, and normalization pipeline.
 */

export interface RawGooglePlaceRecord {
  additionalInfo?: Record<string, Array<Record<string, unknown>>> | null;
  address?: string | null;
  categories?: string[] | null;
  categoryName?: string | null;
  cid?: string | null;
  city?: string | null;
  description?: string | null;
  countryCode?: string | null;
  imageCategories?: string[] | null;
  imageUrl?: string | null;
  imageUrls?: string[] | null;
  imagesCount?: number | null;
  language?: string | null;
  locatedIn?: string | null;
  location?: {
    lat: number;
    lng: number;
  } | null;
  neighborhood?: string | null;
  openingHours?: Array<{
    day: string;
    hours: string;
  }> | null;
  ownerDescription?: string | null;
  phone?: string | null;
  placeId?: string | null;
  placesTags?: string[] | null;
  plusCode?: string | null;
  reviews?: unknown[] | null;
  reviewsCount?: number | null;
  reviewsDistribution?: Record<string, number> | null;
  reviewsTags?: unknown[] | null;
  state?: string | null;
  street?: string | null;
  subTitle?: string | null;
  title?: string | null;
  totalScore?: number | null;
  rating?: number | null;
  url?: string | null;
  website?: string | null;
}

export interface IngestionPipelineResult<T> {
  success: boolean;
  totalProcessed: number;
  validEntities: T[];
  reviewRequired: Array<{ record: unknown; reasons: string[] }>;
  rejected: Array<{ record: unknown; error: string }>;
}
