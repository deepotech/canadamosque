import { siteConfig } from "@/config/site";
import { Mosque } from "../mosque/types";

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Maps canonical classification to Schema.org type.
 * Default is Mosque, or PlaceOfWorship for generic prayer halls/centers.
 */
function mapSchemaType(classification: Mosque["classification"]): string {
  switch (classification) {
    case "MOSQUE":
      return "Mosque";
    case "ISLAMIC_CENTER":
    case "COMMUNITY_CENTER":
      return "CommunityCenter";
    default:
      return "PlaceOfWorship";
  }
}

/**
 * Generates Schema.org Mosque / PlaceOfWorship structured data.
 * Adheres strictly to canonical data without fabricating ratings, reviews, or unverified hours.
 */
export function generateMosqueJsonLd(mosque: Mosque): Record<string, unknown> {
  const schemaType = mapSchemaType(mosque.classification);

  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${siteConfig.url}/mosque/${mosque.slug}#${schemaType.toLowerCase()}`,
    name: mosque.name,
    url: `${siteConfig.url}/mosque/${mosque.slug}`,
    telephone: mosque.phone || undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: mosque.address,
      addressLocality: mosque.city,
      addressRegion: mosque.province,
      postalCode: mosque.postalCode || undefined,
      addressCountry: "CA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: mosque.coordinates.latitude,
      longitude: mosque.coordinates.longitude,
    },
    ...(mosque.website ? { sameAs: [mosque.website] } : {}),
  };
}

/**
 * Generates Schema.org BreadcrumbList structured data.
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http") ? crumb.item : `${siteConfig.url}${crumb.item}`,
    })),
  };
}

/**
 * Generates Schema.org WebPage structured data.
 */
export function generateWebPageJsonLd({
  title,
  description,
  url,
}: {
  title: string;
  description: string;
  url: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}${url}#webpage`,
    url: `${siteConfig.url}${url}`,
    name: title,
    description: description,
    isPartOf: {
      "@id": `${siteConfig.url}/#website`,
    },
  };
}

/**
 * Generates Schema.org WebSite structured data.
 */
export function generateWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en-CA",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/mosques?city={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates Schema.org CollectionPage / ItemList structured data for a Province directory.
 */
export function generateProvinceCollectionJsonLd({
  provinceName,
  provinceSlug,
  totalMosques,
  featuredMosques = [],
}: {
  provinceName: string;
  provinceSlug: string;
  totalMosques: number;
  featuredMosques?: Array<{ name: string; slug: string }>;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/provinces/${provinceSlug}#collection`,
    name: `Mosques in ${provinceName}`,
    url: `${siteConfig.url}/provinces/${provinceSlug}`,
    description: `Comprehensive directory of verified mosques and Islamic centers across ${provinceName}, Canada.`,
  };

  if (featuredMosques.length > 0) {
    schema.mainEntity = {
      "@type": "ItemList",
      numberOfItems: totalMosques,
      itemListElement: featuredMosques.map((m, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: m.name,
        url: `${siteConfig.url}/mosque/${m.slug}`,
      })),
    };
  }

  return schema;
}

/**
 * Generates Schema.org CollectionPage / ItemList structured data for a City directory.
 */
export function generateCityCollectionJsonLd({
  cityName,
  provinceName,
  citySlug,
  totalMosques,
  mosques = [],
}: {
  cityName: string;
  provinceName: string;
  citySlug: string;
  totalMosques: number;
  mosques?: Array<{ name: string; slug: string }>;
}): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteConfig.url}/cities/${citySlug}#collection`,
    name: `Mosques in ${cityName}, ${provinceName}`,
    url: `${siteConfig.url}/cities/${citySlug}`,
    description: `Directory of verified mosques and Islamic centers in ${cityName}, ${provinceName}, Canada.`,
  };

  if (mosques.length > 0) {
    schema.mainEntity = {
      "@type": "ItemList",
      numberOfItems: totalMosques,
      itemListElement: mosques.map((m, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: m.name,
        url: `${siteConfig.url}/mosque/${m.slug}`,
      })),
    };
  }

  return schema;
}

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Generates Schema.org FAQPage structured data.
 */
export function generateFaqJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

