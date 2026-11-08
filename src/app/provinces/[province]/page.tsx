import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import {
  PROVINCE_SLUGS,
  getProvinceBySlug,
  generateProvinceMetadata,
} from "@/domain/seo/province-city-seo";
import { generateProvinceCollectionJsonLd } from "@/domain/seo/schema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { MosqueCard } from "@/components/finder/MosqueCard";
import { toMosqueCardItem } from "@/domain/mosque/card-model";
import { defaultScheduleRepository } from "@/domain/schedule/repository";
import { CANADIAN_CITIES } from "@/domain/city/city-config";

interface ProvincePageProps {
  params: Promise<{ province: string }>;
}

const repo = new CanonicalMosqueRepository();

export function generateStaticParams() {
  return PROVINCE_SLUGS.map((slug) => ({
    province: slug,
  }));
}

export async function generateMetadata({ params }: ProvincePageProps) {
  const { province } = await params;
  const config = getProvinceBySlug(province);
  if (!config) {
    return { title: "Province Not Found" };
  }
  const mosques = await repo.getMosquesByProvince(config.code);
  return generateProvinceMetadata(config.slug, mosques.length);
}

export default async function ProvinceLandingPage({ params }: ProvincePageProps) {
  const { province } = await params;
  const config = getProvinceBySlug(province);

  if (!config) {
    notFound();
  }

  const mosques = await repo.getMosquesByProvince(config.code);

  // Schedules
  const verifiedIqamahList = await defaultScheduleRepository.getAllVerifiedIqamah();
  const verifiedJummahList = await defaultScheduleRepository.getAllVerifiedJummah();
  const verifiedIqamahIds = new Set(verifiedIqamahList.map((i) => i.mosqueId));
  const verifiedJummahIds = new Set(verifiedJummahList.map((j) => j.mosqueId));

  // Compute factual facilities statistics
  const withWheelchair = mosques.filter((m) => m.facilities.wheelchairAccessible).length;
  const withWomenSection = mosques.filter((m) => m.facilities.womenPrayerSection).length;
  const withPhone = mosques.filter((m) => Boolean(m.phone)).length;

  // Cities in this province
  const citiesInProvince = Object.values(CANADIAN_CITIES).filter(
    (c) => c.province === config.code
  );

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Provinces", item: "/provinces" },
    { name: config.name, item: `/provinces/${config.slug}` },
  ];

  const collectionSchema = generateProvinceCollectionJsonLd({
    provinceName: config.name,
    provinceSlug: config.slug,
    totalMosques: mosques.length,
    featuredMosques: mosques.slice(0, 20).map((m) => ({ name: m.name, slug: m.slug })),
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
            <Badge variant="primary">{config.code}</Badge>
            <Badge variant="secondary">Canada Province Directory</Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Mosques in {config.name}
            {config.frenchName && config.frenchName !== config.name ? ` (${config.frenchName})` : ""}
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
            Discover <strong>{mosques.length} verified mosques, Islamic centers, and musallas</strong> across{" "}
            <strong>{config.name}</strong>. Explore community facilities, daily prayer times, Jummah congregations,
            and driving directions across {citiesInProvince.map((c) => c.name).join(", ")}.
          </p>
        </div>

        {/* Factual Statistics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{mosques.length}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Verified Locations</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{withWheelchair}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Wheelchair Accessible</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{withWomenSection}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Women&apos;s Space</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-emerald-800">{withPhone}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Direct Phone Contact</div>
          </div>
        </div>

        {/* Cities Directory in this Province */}
        {citiesInProvince.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4">
              Explore {config.name} by City
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {citiesInProvince.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cities/${c.slug}`}
                  className="rounded-lg border border-stone-200 bg-white p-4 hover:border-emerald-500 hover:shadow-sm transition"
                >
                  <div className="font-semibold text-stone-900">{c.name}</div>
                  <div className="text-xs text-stone-500 mt-1">
                    View verified mosques & prayer times in {c.name} →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mosque Listings Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-stone-900 mb-6">
            Verified Mosques in {config.name} ({mosques.length})
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

        {/* Cross-linking to Other Canadian Provinces */}
        <div className="rounded-xl bg-stone-50 p-6 border border-stone-200">
          <h2 className="text-base font-semibold text-stone-900 mb-3">
            Browse Other Canadian Provinces
          </h2>
          <div className="flex flex-wrap gap-2">
            {PROVINCE_SLUGS.filter((s) => s !== config.slug).map((slug) => {
              const other = getProvinceBySlug(slug);
              if (!other) return null;
              return (
                <Link
                  key={slug}
                  href={`/provinces/${slug}`}
                  className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-emerald-600 hover:text-emerald-700 transition"
                >
                  {other.name} ({other.code})
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </div>
  );
}
