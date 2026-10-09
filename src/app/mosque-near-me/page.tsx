import React from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { constructMetadata } from "@/domain/seo/metadata";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { MosqueNearMeFinder } from "@/components/near-me/MosqueNearMeFinder";
import { WebPageSchema } from "@/components/seo/WebPageSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata = constructMetadata({
  title: "Mosque Near Me | Find Mosques & Masjids in Canada",
  description: "Find mosques, masjids, Islamic centers and musallas near your current location in Canada. View addresses, opening hours, prayer times, and get directions.",
  canonicalPath: "/mosque-near-me",
});

export default async function MosqueNearMePage() {
  const repo = new CanonicalMosqueRepository();
  const allMosques = await repo.list();

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Mosque Near Me", item: "/mosque-near-me" },
  ];

  return (
    <div className="py-12 sm:py-16">
      <WebPageSchema 
        title="Mosque Near Me | Find Mosques & Masjids in Canada"
        description="Find mosques, masjids, Islamic centers and musallas near your current location in Canada. View addresses, opening hours, prayer times, and get directions."
        url="/mosque-near-me"
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Container>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <Badge variant="primary" className="mb-3">
              Location-Based Discovery
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Find a Mosque Near Me
            </h1>
            <p className="mt-4 text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Use your device&apos;s location to instantly find the closest verified mosques, Islamic centers, and musallas. Get precise directions, check verified facilities, and find where to pray next.
            </p>
          </div>

          <MosqueNearMeFinder allMosques={allMosques} />

          <div className="mt-16 pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              href="/prayer-times"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View Daily Prayer Times &rarr;
            </Link>
            <span className="hidden sm:inline text-stone-300">|</span>
            <Link
              href="/mosques"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              Browse National Directory &rarr;
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
