import React from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { DataDistinctionNotice } from "@/components/common/DataDistinctionNotice";
import { constructMetadata } from "@/domain/seo/metadata";
import { getAllCityConfigs } from "@/domain/city/city-config";
import { getFormattedTodayTorontoPrayerTimes } from "@/services/prayer/toronto";
import { WebPageSchema } from "@/components/seo/WebPageSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

export const metadata = constructMetadata({
  title: "Canadian Daily Prayer Times Engine | Accurate Local Times",
  description:
    "Accurate astronomical solar calculation engine for Canadian cities. Find daily Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha times for your city.",
  canonicalPath: "/prayer-times",
});

export default function PrayerTimesPage() {
  const { formatted, schedule } = getFormattedTodayTorontoPrayerTimes();
  const prayers = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"] as const;

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Prayer Times", item: "/prayer-times" },
  ];

  return (
    <div className="py-12 sm:py-16">
      <WebPageSchema 
        title="Canadian Daily Prayer Times Engine | Accurate Local Times"
        description="Accurate astronomical solar calculation engine for Canadian cities. Find daily Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha times for your city."
        url="/prayer-times"
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Container>
        <div className="max-w-3xl">
          {/* Hero */}
          <Badge variant="primary" className="mb-3">
            Solar Prayer Calculation Engine
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Calculated Prayer Times across Canada
          </h1>
          <p className="mt-4 text-stone-600 leading-relaxed">
            This engine computes prayer times using real astronomical solar formulas —
            accounting for solar declination, equation of time, solar altitude, latitude,
            longitude, timezone, and daylight saving time. Built specifically for Canadian latitudes.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link 
              href="/prayer-times/toronto"
              className="inline-flex justify-center items-center rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              View Toronto Prayer Times
            </Link>
            <Link 
              href="/mosque-near-me"
              className="inline-flex justify-center items-center rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50"
            >
              Find a Mosque Near Me
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <strong>These are calculated prayer times.</strong>{" "}
            Mosque Iqamah (congregation) times may be different. Contact your local mosque
            for their specific prayer schedule.
          </div>

          {/* Supported Cities Architecture */}
          <div className="mt-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4">Supported Canadian Regions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {getAllCityConfigs().map((city) => (
                <Link
                  key={city.slug}
                  href={`/prayer-times/${city.slug}`}
                  className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm hover:border-emerald-600 hover:shadow-md transition group"
                >
                  <div className="font-semibold text-stone-900 group-hover:text-emerald-700">
                    {city.name}, {city.province}
                  </div>
                  <div className="text-xs text-stone-500 mt-1">Available Now · {city.timezone.split("/")[1].replace("_", " ")}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Toronto Today — Live Demonstration */}
          <div className="mt-12 pt-10 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900">
                  Today&apos;s Prayer Times — Toronto
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  {schedule.date} · {schedule.timezone}
                </p>
              </div>
              <Link
                href="/prayer-times/toronto"
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
              >
                Full Toronto page →
              </Link>
            </div>

            {/* 3-column prayer grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {prayers.map((prayer) => (
                <div
                  key={prayer}
                  className="rounded-xl border border-stone-200 bg-white px-4 py-4 shadow-sm"
                >
                  <p className="text-xs font-medium text-stone-500 uppercase tracking-wide capitalize">
                    {prayer}
                  </p>
                  <p className="mt-1.5 text-2xl font-mono font-bold text-stone-900 tabular-nums">
                    {formatted[prayer]}
                  </p>
                </div>
              ))}
            </div>

            {/* Settings summary */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-1 rounded-full">
                Method: <strong>{schedule.settings.calculationMethod}</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-1 rounded-full">
                Fajr Angle: <strong>{schedule.settings.fajrAngle}°</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-1 rounded-full">
                Isha Angle: <strong>{schedule.settings.ishaAngle}°</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-stone-100 text-stone-600 border border-stone-200 px-2.5 py-1 rounded-full">
                Asr: <strong>{schedule.settings.asrMethod}</strong>
              </span>
            </div>
            
            <div className="mt-4 flex items-center justify-end">
              <Link href="/mosques/toronto" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Browse Toronto Mosques &rarr;
              </Link>
            </div>
          </div>

          {/* Engine Specification */}
          <div className="mt-12 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Engine Specification
            </h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-stone-700">
              <div>
                <h3 className="font-semibold text-stone-800 mb-1.5">Library</h3>
                <ul className="space-y-1 text-xs text-stone-600">
                  <li>
                    <strong>adhan-js v4.4.6</strong> by Batoul Apps
                  </li>
                  <li>Based on <em>Astronomical Algorithms</em> (Jean Meeus, 2nd ed.)</li>
                  <li>MIT License — actively maintained</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 mb-1.5">
                  Calculation Methods
                </h3>
                <ul className="space-y-1 text-xs text-stone-600">
                  <li>ISNA (Fajr 15°, Isha 15°) — Canadian pilot default</li>
                  <li>MWL (18°/17°), Egyptian (19.5°/17.5°)</li>
                  <li>Makkah (18.5°, +90 min), Karachi (18°/18°)</li>
                  <li>Custom angle configuration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 mb-1.5">Asr Methods</h3>
                <ul className="space-y-1 text-xs text-stone-600">
                  <li>Standard / Shafi / Maliki / Hanbali (shadow factor 1)</li>
                  <li>Hanafi (shadow factor 2 — later Asr)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-stone-800 mb-1.5">
                  High-Latitude Rules
                </h3>
                <ul className="space-y-1 text-xs text-stone-600">
                  <li>Angle-Based (fraction of night = angle/60)</li>
                  <li>One-Seventh of the Night (1/7)</li>
                  <li>Middle of the Night (1/2)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Data Distinction */}
          <div className="mt-8">
            <DataDistinctionNotice />
          </div>
        </div>
      </Container>
    </div>
  );
}
