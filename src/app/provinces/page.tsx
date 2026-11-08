import React from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import {
  getAllProvinces,
  generateProvincesHubMetadata,
} from "@/domain/seo/province-city-seo";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { WebPageSchema } from "@/components/seo/WebPageSchema";
import { CANADIAN_CITIES } from "@/domain/city/city-config";

const repo = new CanonicalMosqueRepository();

export async function generateMetadata() {
  const allMosques = await repo.list();
  const provinces = getAllProvinces();
  return generateProvincesHubMetadata(provinces.length, allMosques.length);
}

export default async function ProvincesHubPage() {
  const allMosques = await repo.list();
  const provinces = getAllProvinces();

  // Aggregate factual counts per province
  const provinceCounts: Record<string, number> = {};
  for (const m of allMosques) {
    provinceCounts[m.province] = (provinceCounts[m.province] || 0) + 1;
  }

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Provinces", item: "/provinces" },
  ];

  return (
    <div className="py-8 sm:py-12">
      <WebPageSchema
        title={`Canadian Mosques by Province (${allMosques.length} Verified Locations)`}
        description="Browse authentic Canadian mosques, Islamic centers, and prayer facilities organized by province. View verified directories across Ontario, Quebec, Alberta, British Columbia, and Manitoba."
        url="/provinces"
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <Badge variant="primary" className="mb-3">
            National Geographic Hierarchy
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Canadian Mosques by Province
          </h1>
          <p className="mt-4 text-stone-600 leading-relaxed text-base sm:text-lg">
            Discover <strong>{allMosques.length} verified mosques and Islamic centers</strong> across{" "}
            <strong>{provinces.length} Canadian provinces</strong>. Explore local community directories,
            daily prayer calculations, verified Iqamah timings, and directions tailored to each province.
          </p>
        </div>

        {/* Province Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {provinces.map((prov) => {
            const count = provinceCounts[prov.code] || 0;
            const citiesInProv = Object.values(CANADIAN_CITIES).filter(
              (c) => c.province === prov.code
            );

            return (
              <div
                key={prov.slug}
                className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-6 shadow-sm hover:border-emerald-500 hover:shadow-md transition duration-150"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                      {prov.code}
                    </span>
                    <span className="text-sm font-medium text-stone-500">
                      {count} {count === 1 ? "Mosque" : "Mosques"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-stone-900 mb-2">
                    <Link
                      href={`/provinces/${prov.slug}`}
                      className="hover:text-emerald-700 transition"
                    >
                      {prov.name}
                      {prov.frenchName && prov.frenchName !== prov.name ? ` (${prov.frenchName})` : ""}
                    </Link>
                  </h2>

                  <p className="text-sm text-stone-600 mb-4 line-clamp-3 leading-relaxed">
                    {prov.description}
                  </p>

                  {/* Major Cities */}
                  {citiesInProv.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                        Key Metropolises
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {citiesInProv.map((c) => (
                          <Link
                            key={c.slug}
                            href={`/cities/${c.slug}`}
                            className="inline-flex items-center rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-700 hover:bg-stone-200 transition"
                          >
                            {c.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    href={`/provinces/${prov.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                  >
                    Explore {prov.name} Directory →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Informational Guidance */}
        <div className="mt-12 rounded-xl bg-stone-50 p-6 border border-stone-200">
          <h2 className="text-lg font-semibold text-stone-900 mb-2">
            Canadian Geographic Coverage & Integrity
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            All listed facilities are verified physical locations within Canadian municipal boundaries.
            Each province directory includes verified street addresses, direct phone numbers where available,
            wheelchair accessibility indications, and daily calculated prayer timings based on geographic coordinates.
            Unverified and review-required records are excluded from public search directories to preserve information integrity.
          </p>
        </div>
      </Container>
    </div>
  );
}
