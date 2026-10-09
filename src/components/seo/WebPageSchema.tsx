import React from "react";
import { generateWebPageJsonLd } from "@/domain/seo/schema";

interface Props {
  title: string;
  description: string;
  url: string;
}

export function WebPageSchema({ title, description, url }: Props) {
  const schema = generateWebPageJsonLd({ title, description, url });
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
