import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { constructMetadata } from "@/domain/seo/metadata";
import {
  getCityConfigBySlug,
  SUPPORTED_CITY_SLUGS,
} from "@/domain/city/city-config";
import { getTodayCityPrayerTimes } from "@/services/prayer/city-prayer";
import { CityPrayerTimesClient } from "@/components/prayer/CityPrayerTimesClient";
import { WebPageSchema } from "@/components/seo/WebPageSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export function generateStaticParams() {
  return SUPPORTED_CITY_SLUGS.map((slug) => ({
    city: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityConfigBySlug(citySlug);

  if (!city) {
    return constructMetadata({ title: "City Not Found" });
  }

  return constructMetadata({
    title: `${city.name} Prayer Times Today | Fajr, Dhuhr, Asr, Maghrib & Isha`,
    description: `Today's calculated prayer times for ${city.name}, ${city.provinceFullName}. Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha times calculated using the ISNA method for ${city.name}'s coordinates.`,
    canonicalPath: `/prayer-times/${city.slug}`,
  });
}

export default async function CityPrayerTimesPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = getCityConfigBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const schedule = getTodayCityPrayerTimes(city.slug);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Prayer Times", item: "/prayer-times" },
    { name: city.name, item: `/prayer-times/${city.slug}` },
  ];

  return (
    <div className="py-12 sm:py-16">
      <WebPageSchema
        title={`${city.name} Prayer Times Today | Fajr, Dhuhr, Asr, Maghrib & Isha`}
        description={`Today's calculated prayer times for ${city.name}, ${city.provinceFullName}. Fajr, Sunrise, Dhuhr, Asr, Maghrib and Isha times calculated using the ISNA method for ${city.name}'s coordinates.`}
        url={`/prayer-times/${city.slug}`}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Container>
        <div className="max-w-2xl">
          <Badge variant="primary" className="mb-3">
            Calculated Prayer Times · {city.name}, {city.province}
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            {city.name} Prayer Times Today
          </h1>

          <div className="mt-6 prose prose-stone prose-sm">
            <p>
              These are <strong>astronomically calculated prayer times</strong> for{" "}
              {city.name}, {city.provinceFullName}, generated using the ISNA method (Fajr 15&deg;, Isha 15&deg;),
              Standard Asr, and timezone-aware handling (<code>{city.timezone}</code>). They represent the start
              times of the prayer windows based on the position of the sun.
            </p>
            <p>
              <strong>Important Difference:</strong> Calculated times are different from <em>Iqamah</em> times.
              Iqamah refers to the congregational prayer time decided by local mosque administration, which is usually
              fixed to a specific time for convenience and may be 10-30 minutes after the calculated start time. Please
              contact your local mosque for their specific Iqamah schedules.
            </p>
          </div>

          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>Disclaimer:</strong> These are <em>calculated times</em>, not official verified mosque congregation (Iqamah) times.
          </div>

          <CityPrayerTimesClient
            cityName={city.name}
            coordinates={city.representativeCoordinates}
            timezone={city.timezone}
            initialDate={schedule.date}
          />

          <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-stone-500 mb-1">Looking for a place to pray?</span>
              <Link
                href={`/mosques/${city.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Find mosques in {city.name} &rarr;
              </Link>
            </div>
            <div className="flex flex-col sm:items-end">
              <span className="text-xs text-stone-500 mb-1">Near your current location?</span>
              <Link
                href="/mosque-near-me"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                Mosque Near Me &rarr;
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
