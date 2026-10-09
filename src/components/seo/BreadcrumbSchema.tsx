import React from "react";
import { generateBreadcrumbJsonLd, BreadcrumbItem } from "@/domain/seo/schema";

interface Props {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: Props) {
  const schema = generateBreadcrumbJsonLd(items);
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
