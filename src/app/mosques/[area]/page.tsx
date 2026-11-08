import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { constructMetadata } from "@/domain/seo/metadata";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { defaultScheduleRepository } from "@/domain/schedule/repository";
import {
  getAreaBySlug,
  getSupportedAreaSlugs,
  filterMosquesByArea,
} from "@/domain/geo/area-slugs";
import { MosqueCard } from "@/components/finder/MosqueCard";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { getProvinceByCode } from "@/domain/seo/province-city-seo";

// Generate static params for all supported area slugs across Canada
export function generateStaticParams() {
  const slugs = getSupportedAreaSlugs();
  return slugs.map((slug) => ({
    area: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const areaDef = getAreaBySlug(area);

  if (!areaDef) {
    return constructMetadata({ title: "Not Found" });
  }

  const titleBase = areaDef.isMetropolis
    ? `${areaDef.name} Mosques | Find a Mosque Near You in ${areaDef.name}, ${areaDef.province}`
    : `Mosques in ${areaDef.name} | ${areaDef.name} Mosque Directory`;

  const description = areaDef.isMetropolis
    ? `Find mosques, Islamic centers, and musallas in ${areaDef.name}, ${areaDef.provinceFullName}. Browse verified addresses, directions, facilities, and calculated prayer times. Find a mosque near you in ${areaDef.name}.`
    : `Find mosques and prayer locations in ${areaDef.name}, ${areaDef.provinceFullName}. View verified addresses, directions, and facilities near you.`;

  return constructMetadata({
    title: titleBase,
    description,
    canonicalPath: areaDef.isMetropolis ? `/cities/${areaDef.slug}` : `/mosques/${areaDef.slug}`,
  });
}

export default async function AreaMosquesPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const areaDef = getAreaBySlug(area);

  if (!areaDef) {
    notFound();
  }

  const repo = new CanonicalMosqueRepository();
  const allMosques = await repo.list();

  // Deterministically filter mosques belonging to this area / metropolis
  const areaMosques = filterMosquesByArea(allMosques, areaDef.slug);

  // Schedules (zero fabrication)
  const verifiedIqamahList = await defaultScheduleRepository.getAllVerifiedIqamah();
  const verifiedJummahList = await defaultScheduleRepository.getAllVerifiedJummah();

  const verifiedIqamahMosqueIds = new Set(verifiedIqamahList.map((i) => i.mosqueId));
  const verifiedJummahMosqueIds = new Set(verifiedJummahList.map((j) => j.mosqueId));

  // For Toronto boroughs, breadcrumb includes parent Toronto city
  const isTorontoBorough = !areaDef.isMetropolis && areaDef.province === "ON";

  const breadcrumbs = isTorontoBorough
    ? [
        { name: "Home", item: "/" },
        { name: "Mosques", item: "/mosques" },
        { name: "Toronto", item: "/cities/toronto" },
        { name: areaDef.name, item: `/mosques/${areaDef.slug}` },
      ]
    : [
        { name: "Home", item: "/" },
        { name: "Provinces", item: "/provinces" },
        ...(areaDef.province
          ? [
              {
                name: areaDef.provinceFullName,
                item: `/provinces/${areaDef.province === "ON" ? "ontario" : areaDef.province === "QC" ? "quebec" : areaDef.province === "AB" ? "alberta" : areaDef.province === "BC" ? "british-columbia" : "manitoba"}`,
              },
            ]
          : []),
        { name: `${areaDef.name}, ${areaDef.province}`, item: `/cities/${areaDef.slug}` },
      ];

  const prayerRoute = areaDef.isMetropolis
    ? `/prayer-times/${areaDef.slug}`
    : `/prayer-times/toronto`;

  const provConfig = getProvinceByCode(areaDef.province);

  return (
    <div className="py-8 sm:py-12">
      <BreadcrumbSchema items={breadcrumbs} />
      <Container>
        {/* Canonical Notice for Metropolises */}
        {areaDef.isMetropolis && (
          <div className="mb-6 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-2">
            <span>
              ℹ️ Viewing regional area directory. For the primary canonical city guide, see:
            </span>
            <Link
              href={`/cities/${areaDef.slug}`}
              className="font-semibold underline hover:text-emerald-950 transition"
            >
              Explore Mosques in {areaDef.name} ({areaDef.province}) →
            </Link>
          </div>
        )}

        {/* Page Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="primary">
              {areaDef.name}, {areaDef.province}
            </Badge>
            {provConfig ? (
              <Link href={`/provinces/${provConfig.slug}`}>
                <Badge variant="secondary" className="hover:bg-stone-200 transition">
                  {areaDef.provinceFullName}
                </Badge>
              </Link>
            ) : (
              <Badge variant="secondary">
                {areaDef.provinceFullName}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Mosques &amp; Prayer Locations in {areaDef.name}
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
            Discover <strong>{areaMosques.length} verified locations</strong> in {areaDef.name},{" "}
            {areaDef.provinceFullName}. View verified addresses, facilities, directions, and find the
            closest place to pray.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href={prayerRoute}
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              View {areaDef.isMetropolis ? areaDef.name : "Toronto"} Prayer Times Today &rarr;
            </Link>
            <Link
              href="/mosque-near-me"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              Find a Mosque Near Me &rarr;
            </Link>
            {isTorontoBorough && (
              <Link
                href="/mosques/toronto"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                Browse all Toronto mosques &rarr;
              </Link>
            )}
          </div>
        </div>

        {areaMosques.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200">
            <p className="text-stone-600">No verified locations found in {areaDef.name} yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areaMosques.map((mosque) => (
              <MosqueCard
                key={mosque.id}
                mosque={mosque}
                hasVerifiedIqamah={verifiedIqamahMosqueIds.has(mosque.id)}
                hasVerifiedJummah={verifiedJummahMosqueIds.has(mosque.id)}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
