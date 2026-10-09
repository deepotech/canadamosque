import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { Container } from "@/components/common/Container";
import { MosqueTypeBadge } from "@/components/mosque/MosqueTypeBadge";
import { MosqueFacilitiesCard } from "@/components/mosque/MosqueFacilitiesCard";
import { MosqueOpeningHoursCard } from "@/components/mosque/MosqueOpeningHoursCard";
import { MosquePrayerTimesCard } from "@/components/mosque/MosquePrayerTimesCard";
import { MosqueLocationMap } from "@/components/map/MosqueLocationMap";
import { MosqueScheduleSection } from "@/components/schedule/MosqueScheduleSection";
import { NearbyMosquesSection } from "@/components/mosque/NearbyMosquesSection";
import { defaultScheduleRepository } from "@/domain/schedule/repository";
import { DataDistinctionNotice } from "@/components/common/DataDistinctionNotice";
import { constructMetadata } from "@/domain/seo/metadata";
import {
  generateMosqueJsonLd,
  generateBreadcrumbJsonLd,
} from "@/domain/seo/schema";
import { getClassificationDisplayName } from "@/domain/mosque/classification-display";
import { getCityConfigByName } from "@/domain/city/city-config";
import { getAreaBySlug } from "@/domain/geo/area-slugs";
import { defaultPrayerTimeEngine } from "@/domain/prayer/engine";
import { calculateEstimatedIqamah } from "@/domain/estimated-iqamah/engine";
import { DEFAULT_ESTIMATED_IQAMAH_CONFIG } from "@/domain/estimated-iqamah/defaults";

interface ProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const repo = new CanonicalMosqueRepository();

/**
 * Canonical Toronto borough slugs that map to /mosques/[borough] area pages.
 * These are Toronto's historical districts, each with their own area page.
 */
const TORONTO_BOROUGH_AREA_MAP: Record<string, string> = {
  scarborough: "scarborough",
  "north york": "north-york",
  etobicoke: "etobicoke",
  "east york": "east-york",
  york: "york",
};

/**
 * Pre-generate static routes for all 331 published canonical mosques across Canada.
 */
export async function generateStaticParams() {
  const publishedList = await repo.list();
  return publishedList.map((m) => ({
    slug: m.slug,
  }));
}

/**
 * Generates unique canonical SEO metadata for each published mosque.
 * Derived exclusively from real canonical data — no fabrication.
 */
export async function generateMetadata({
  params,
}: ProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const mosque = await repo.getBySlug(slug);

  if (!mosque) {
    return constructMetadata({
      title: "Location Not Found",
      description: "The requested Canadian mosque or prayer location could not be found.",
      canonicalPath: `/mosque/${slug}`,
      noIndex: true,
    });
  }

  const typeName = getClassificationDisplayName(mosque.classification);
  const cityCfg = getCityConfigByName(mosque.city);
  const provinceFull = cityCfg?.provinceFullName || mosque.province;

  const title = `${mosque.name} in ${mosque.city}, ${mosque.province} | Address & Prayer Times`;
  const description = `Find ${mosque.name} (${typeName}) in ${mosque.city}, ${provinceFull}. View the address, map location, facilities, calculated prayer times, and directions to this Canadian mosque.`;

  return constructMetadata({
    title,
    description,
    canonicalPath: `/mosque/${mosque.slug}`,
  });
}

export default async function MosqueProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const mosque = await repo.getBySlug(slug);

  if (!mosque) {
    notFound();
  }

  const nearbyMosques = await repo.getNearbyPublishedMosques(mosque, 6);

  const iqamah = await defaultScheduleRepository.getCurrentIqamahByMosqueId(mosque.id);
  const jummah = await defaultScheduleRepository.getCurrentJummahByMosqueId(mosque.id);

  // Compute estimated Iqamah for today if no verified schedule exists.
  // The estimate is NEVER stored and NEVER treated as verified data.
  // It uses the mosque's real coordinates and timezone for accuracy.
  const todayLocal = new Intl.DateTimeFormat("en-CA", {
    timeZone: mosque.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("/")
    .reverse()
    .join("-");

  const prayerScheduleForEstimate = defaultPrayerTimeEngine.calculatePrayerTimes({
    latitude: mosque.coordinates.latitude,
    longitude: mosque.coordinates.longitude,
    date: todayLocal,
    timezone: mosque.timezone,
    calculationMethod: "ISNA",
    asrMethod: "STANDARD",
    highLatitudeRule: "ANGLE_BASED",
  });

  const estimatedIqamah = calculateEstimatedIqamah(
    prayerScheduleForEstimate,
    DEFAULT_ESTIMATED_IQAMAH_CONFIG
  );

  const typeName = getClassificationDisplayName(mosque.classification);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mosque.coordinates.latitude},${mosque.coordinates.longitude}`;

  // City routing — uses canonical city config with known-municipalities matching
  const cityConfig = getCityConfigByName(mosque.city);
  const cityBrowseUrl = cityConfig?.canonicalMosqueRoute || "/mosques";
  const cityPrayerUrl = cityConfig?.canonicalPrayerRoute || "/prayer-times";
  const cityDisplayName = cityConfig?.name || mosque.city;

  // Determine if this mosque is in a Toronto borough (has its own area page)
  const mosqueCityLower = mosque.city.toLowerCase();
  const torontoBoroughSlug = TORONTO_BOROUGH_AREA_MAP[mosqueCityLower];
  const isTorontoBorough = Boolean(torontoBoroughSlug);

  // Determine city browse label
  let cityBrowseLabel: string;
  if (isTorontoBorough) {
    cityBrowseLabel = `Browse Toronto-area mosques`;
  } else if (cityConfig) {
    cityBrowseLabel = `Browse ${cityConfig.name} mosques`;
  } else {
    cityBrowseLabel = "Browse all mosques";
  }

  // Build breadcrumb — include city for metropolises, or Toronto for boroughs
  const breadcrumbCityName = isTorontoBorough ? "Toronto" : cityDisplayName;
  const breadcrumbCityUrl = isTorontoBorough ? "/mosques/toronto" : cityBrowseUrl;

  const jsonLdMosque = generateMosqueJsonLd(mosque);
  const jsonLdBreadcrumb = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Mosques", item: "/mosques" },
    { name: breadcrumbCityName, item: breadcrumbCityUrl },
    { name: mosque.name, item: `/mosque/${mosque.slug}` },
  ]);

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMosque) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <div className="py-8 sm:py-12">
        <Container>
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs text-stone-500 flex-wrap">
              <li>
                <Link href="/" className="hover:text-emerald-700 transition">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/mosques" className="hover:text-emerald-700 transition">
                  Mosques
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={breadcrumbCityUrl} className="hover:text-emerald-700 transition">
                  {breadcrumbCityName}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="font-medium text-stone-800 truncate max-w-[200px] sm:max-w-none">
                {mosque.name}
              </li>
            </ol>
          </nav>

          {/* Profile Header */}
          <header className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MosqueTypeBadge classification={mosque.classification} />
                  <span className="text-xs text-stone-500">
                    {mosque.city}, {mosque.province}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  {mosque.name}
                </h1>
                <p className="mt-2 text-sm text-stone-600 flex items-start gap-1.5 max-w-2xl">
                  <span aria-hidden="true">📍</span>
                  <span>{mosque.address}</span>
                </p>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto pt-2 sm:pt-0">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Get directions to ${mosque.name}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition flex-1 sm:flex-initial"
                >
                  <span>↗ Get Directions</span>
                </a>

                {mosque.phone && (
                  <a
                    href={`tel:${mosque.phone}`}
                    aria-label={`Call ${mosque.name}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition flex-1 sm:flex-initial"
                  >
                    <span>📞 {mosque.phone}</span>
                  </a>
                )}

                {mosque.website && (
                  <a
                    href={mosque.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${mosque.name} website`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition flex-1 sm:flex-initial"
                  >
                    <span>🌐 Website</span>
                  </a>
                )}
              </div>
            </div>
          </header>

          {/* Main Grid Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Prayer Times, Opening Hours, Facilities */}
            <div className="lg:col-span-2 space-y-8">
              {/* Calculated Prayer Times Section */}
              <MosquePrayerTimesCard
                coordinates={mosque.coordinates}
                timezone={mosque.timezone}
              />

              {/* Mosque Congregation Schedules: Iqamah & Jummah */}
              <MosqueScheduleSection iqamah={iqamah} jummah={jummah} estimatedIqamah={estimatedIqamah} />

              {/* Opening Hours */}
              <MosqueOpeningHoursCard
                openingHours={mosque.openingHours}
                timezone={mosque.timezone}
              />

              {/* Facilities */}
              <MosqueFacilitiesCard facilities={mosque.facilities} />

              {/* Data Provenance & Trust */}
              <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-5 text-xs text-stone-600 leading-relaxed">
                <h3 className="font-semibold text-stone-800 mb-1.5">
                  Data Provenance &amp; Audit Transparency
                </h3>
                <p>
                  Information on this profile is derived from our canonical {mosque.city} ({mosque.province}){" "}
                  mosque dataset (Record ID:{" "}
                  <code className="font-mono text-stone-700 bg-white px-1 py-0.5 rounded border border-stone-200">
                    {mosque.id}
                  </code>
                  ). Classification as a <strong>{typeName}</strong> was determined during canonical
                  ingestion based on name indicators and facility characteristics.
                </p>
                {mosque.sourceMetadata.lastIngestedAt && (
                  <p className="mt-2 text-stone-500">
                    Last catalog ingested: {mosque.sourceMetadata.lastIngestedAt.split("T")[0]}
                  </p>
                )}
              </div>
            </div>

            {/* Right 1 Col: Location Map & Information */}
            <div className="space-y-6">
              {/* Interactive Map */}
              <div>
                <h2 className="text-sm font-semibold text-stone-900 mb-2">
                  Location &amp; Map
                </h2>
                <MosqueLocationMap
                  coordinates={mosque.coordinates}
                  name={mosque.name}
                  address={mosque.address}
                />
              </div>

              {/* Contact Summary Box */}
              <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm space-y-3 text-xs">
                <h3 className="font-semibold text-stone-900">
                  Quick Details
                </h3>
                <div>
                  <span className="block text-stone-400">Place Type</span>
                  <span className="font-medium text-stone-800">{typeName}</span>
                </div>
                <div>
                  <span className="block text-stone-400">Municipality</span>
                  <span className="font-medium text-stone-800">
                    {mosque.city}, {mosque.province}
                  </span>
                </div>
                {mosque.postalCode && (
                  <div>
                    <span className="block text-stone-400">Postal Code</span>
                    <span className="font-mono font-medium text-stone-800">
                      {mosque.postalCode}
                    </span>
                  </div>
                )}
                <div>
                  <span className="block text-stone-400">Geographic Coordinates</span>
                  <span className="font-mono text-stone-600">
                    {mosque.coordinates.latitude.toFixed(5)}, {mosque.coordinates.longitude.toFixed(5)}
                  </span>
                </div>
              </div>

              {/* Explore More Links */}
              <div className="pt-4 mt-6 border-t border-stone-200">
                <h3 className="text-sm font-semibold text-stone-900 mb-3">Explore More</h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link href="/mosque-near-me" className="text-emerald-700 hover:text-emerald-800 transition">
                      Find nearby mosques
                    </Link>
                  </li>
                  <li>
                    <Link href={cityPrayerUrl} className="text-emerald-700 hover:text-emerald-800 transition">
                      {cityDisplayName} prayer times today
                    </Link>
                  </li>
                  <li>
                    <Link href={cityBrowseUrl} className="text-emerald-700 hover:text-emerald-800 transition">
                      {cityBrowseLabel}
                    </Link>
                  </li>
                  {/* Area page link for Toronto boroughs */}
                  {isTorontoBorough && torontoBoroughSlug && getAreaBySlug(torontoBoroughSlug) && (
                    <li>
                      <Link
                        href={`/mosques/${torontoBoroughSlug}`}
                        className="text-emerald-700 hover:text-emerald-800 transition"
                      >
                        Browse {mosque.city} mosques
                      </Link>
                    </li>
                  )}
                  <li className="pt-2">
                    <Link
                      href="/mosques"
                      className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition"
                    >
                      ← Back to All Mosques
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Nearby Mosques Internal Linking Section */}
          <NearbyMosquesSection
            currentMosque={mosque}
            nearbyMosques={nearbyMosques}
          />

          {/* Philosophy Banner */}
          <div className="mt-12">
            <DataDistinctionNotice />
          </div>
        </Container>
      </div>
    </>
  );
}
