import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import {
  getProvinceByCode,
  generateCityMetadata,
  getRelatedCities,
} from "@/domain/seo/province-city-seo";
import { generateCityCollectionJsonLd } from "@/domain/seo/schema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { MosqueCard } from "@/components/finder/MosqueCard";
import { toMosqueCardItem } from "@/domain/mosque/card-model";
import { defaultScheduleRepository } from "@/domain/schedule/repository";
import {
  SUPPORTED_CITY_SLUGS,
  getCityConfigBySlug,
} from "@/domain/city/city-config";

interface CityPageProps {
  params: Promise<{ city: string }>;
}

const repo = new CanonicalMosqueRepository();

export function generateStaticParams() {
  return SUPPORTED_CITY_SLUGS.map((slug) => ({
    city: slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps) {
  const { city } = await params;
  const config = getCityConfigBySlug(city);
  if (!config) {
    return { title: "City Not Found" };
  }
  const mosques = await repo.getMosquesByCity(config.slug);
  return generateCityMetadata(config.slug, mosques.length);
}

export default async function CityLandingPage({ params }: CityPageProps) {
  const { city } = await params;
  const config = getCityConfigBySlug(city);

  if (!config) {
    notFound();
  }

  const mosques = await repo.getMosquesByCity(config.slug);
  const provConfig = getProvinceByCode(config.province);

  // Schedules
  const verifiedIqamahList = await defaultScheduleRepository.getAllVerifiedIqamah();
  const verifiedJummahList = await defaultScheduleRepository.getAllVerifiedJummah();
  const verifiedIqamahIds = new Set(verifiedIqamahList.map((i) => i.mosqueId));
  const verifiedJummahIds = new Set(verifiedJummahList.map((j) => j.mosqueId));

  // Compute factual facilities statistics
  const withWheelchair = mosques.filter((m) => m.facilities.wheelchairAccessible).length;
  const withWomenSection = mosques.filter((m) => m.facilities.womenPrayerSection).length;
  const withPhone = mosques.filter((m) => Boolean(m.phone)).length;

  const relatedCities = getRelatedCities(config.slug, 4);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Provinces", item: "/provinces" },
    ...(provConfig ? [{ name: provConfig.name, item: `/provinces/${provConfig.slug}` }] : []),
    { name: config.name, item: `/cities/${config.slug}` },
  ];

  const collectionSchema = generateCityCollectionJsonLd({
    cityName: config.name,
    provinceName: config.provinceFullName,
    citySlug: config.slug,
    totalMosques: mosques.length,
    mosques: mosques.map((m) => ({ name: m.name, slug: m.slug })),
  });

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="primary">
              {config.name}, {config.province}
            </Badge>
            {provConfig && (
              <Link href={`/provinces/${provConfig.slug}`}>
                <Badge variant="secondary" className="hover:bg-stone-200 transition">
                  {provConfig.name}
                </Badge>
              </Link>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Mosques in {config.name}, {config.province}
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
            Find <strong>{mosques.length} verified mosques, Islamic centers, and musallas</strong> across{" "}
            <strong>{config.name}</strong> ({config.provinceFullName}). Browse addresses, wheelchair accessibility,
            women&apos;s prayer facilities, calculated daily prayer times, and driving directions.
          </p>

          {/* Quick Links / CTAs */}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={config.canonicalPrayerRoute}
              className="inline-flex items-center rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 transition"
            >
              Daily Prayer Times in {config.name} →
            </Link>
            <Link
              href="/mosque-near-me"
              className="inline-flex items-center rounded-md bg-stone-100 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 transition"
            >
              Find Closest Mosque by GPS →
            </Link>
          </div>
        </div>

        {/* Factual Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{mosques.length}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Verified Facilities</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{withWheelchair}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Wheelchair Accessible</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{withWomenSection}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Women&apos;s Facilities</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{withPhone}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Direct Phone Contact</div>
          </div>
        </div>

        {/* Mosques Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            All Verified Locations in {config.name} ({mosques.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mosques.map((m) => (
              <MosqueCard
                key={m.id}
                mosque={toMosqueCardItem(m)}
                hasVerifiedIqamah={verifiedIqamahIds.has(m.id)}
                hasVerifiedJummah={verifiedJummahIds.has(m.id)}
              />
            ))}
          </div>
        </div>

        {/* Related / Sibling Canadian Cities */}
        {relatedCities.length > 0 && (
          <div className="rounded-xl bg-stone-50 p-6 border border-stone-200">
            <h2 className="text-base font-semibold text-stone-900 mb-3">
              Explore Nearby & Sibling Canadian Cities
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cities/${c.slug}`}
                  className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-emerald-600 hover:text-emerald-700 transition"
                >
                  {c.name}, {c.province}
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
