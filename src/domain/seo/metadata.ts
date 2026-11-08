import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export interface PageMetadataProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  ogImage?: string;
}

export function constructMetadata({
  title,
  description = siteConfig.description,
  canonicalPath = "/",
  noIndex = false,
  noFollow = false,
  ogImage = siteConfig.ogImage,
}: PageMetadataProps = {}): Metadata {
  const brandSuffix = ` | ${siteConfig.name}`;
  let cleanTitle = title;
  if (cleanTitle && cleanTitle.endsWith(brandSuffix)) {
    cleanTitle = cleanTitle.slice(0, -brandSuffix.length);
  }

  const fullTitle = cleanTitle
    ? `${cleanTitle}${brandSuffix}`
    : `${siteConfig.name} | Canadian Mosque Discovery & Prayer Times`;

  const canonicalUrl = `${siteConfig.url}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const fullOgImage = ogImage.startsWith("http") ? ogImage : `${siteConfig.url}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`;

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
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: cleanTitle || siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [fullOgImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: !noFollow,
          googleBot: {
            index: false,
            follow: !noFollow,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
          },
        },
  };
}
