import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export interface PageMetadataProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  canonicalPath = "/",
  noIndex = false,
}: PageMetadataProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.name} | Canadian Mosque Discovery & Prayer Times`;

  const canonicalUrl = `${siteConfig.url}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}
