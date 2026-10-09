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

