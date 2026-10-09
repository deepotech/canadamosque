import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { DataDistinctionNotice } from "@/components/common/DataDistinctionNotice";
import { constructMetadata } from "@/domain/seo/metadata";
import { generateFaqJsonLd, FaqItem } from "@/domain/seo/schema";
import { siteConfig } from "@/config/site";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { CANADIAN_CITIES } from "@/domain/city/city-config";
import { filterMosquesByArea } from "@/domain/geo/area-slugs";

export const metadata: Metadata = constructMetadata({
  title: "Mosque Near Me in Canada | Find Mosques & Prayer Times",
  description:
    "Find a mosque near you in Canada. Browse mosques by city, explore verified addresses, facilities, directions, and view daily calculated prayer times across 9 Canadian metropolises.",
  canonicalPath: "/",
});

const homepageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${siteConfig.url}/#webpage`,
  url: siteConfig.url,
  name: "Mosque Near Me in Canada | Find Mosques & Prayer Times",
  description:
    "Find a mosque near you in Canada. Browse mosques by city, explore verified addresses, facilities, directions, and view daily calculated prayer times across 9 Canadian metropolises.",
  isPartOf: { "@id": `${siteConfig.url}/#website` },
};

const HOMEPAGE_FAQS: FaqItem[] = [


  {
    question: "How do I find a mosque near me in Canada?",
    answer:
      "Click the 'Find Mosques Near Me' button to let your browser calculate distances to the nearest Canadian mosques using your device location. All calculations happen entirely on your device, and your coordinates are never sent to or stored on our servers.",
  },
  {
    question: "Which Canadian cities are currently covered?",
    answer:
      "Canada Mosque Near Me covers 9 major metropolitan regions: Toronto, Montreal, Calgary, Edmonton, Ottawa, Mississauga, Winnipeg, Brampton, and Vancouver, comprising 331 cataloged mosques, Islamic centers, and musallas.",
  },
  {
    question: "Does this site store or track my location?",
    answer:
      "No. We prioritize your privacy. Geolocation coordinates are processed client-side in your web browser via the Haversine formula to sort nearby locations. Coordinates are never logged, stored in databases, saved in cookies, or sent over network requests.",
  },
  {
    question: "Are daily prayer times calculated or provided by mosques?",
    answer:
      "Daily prayer times on our platform are astronomically calculated solar times using the ISNA calculation method, specifically tuned for Canadian latitudes and daylight saving shifts. These represent the canonical prayer windows rather than specific congregational Iqamah times.",
  },
  {
    question: "How are Friday Jummah prayer schedules verified?",
    answer:
      "Jummah prayer schedules are strictly published only when directly corroborated with venue announcements or mosque administrations. We uphold a zero-fabrication standard: unverified times are clearly acknowledged rather than estimated.",
  },
  {
    question: "Can I browse mosques by city without enabling location services?",
    answer:
      "Yes. You can explore complete directories for any supported city directly through our city directory links, where you can filter by facilities, parking, wheelchair accessibility, and place type.",
  },
];

export default async function HomePage() {
  const repo = new CanonicalMosqueRepository();
  const allMosques = await repo.list();

  // Compute actual published counts dynamically from canonical repository
  const cityCardData = Object.values(CANADIAN_CITIES).map((city) => {
    const matched = filterMosquesByArea(allMosques, city.slug);
    return {
      slug: city.slug,
      name: city.name,
      province: city.province,
      count: matched.length,
      mosqueRoute: city.canonicalMosqueRoute,
      prayerRoute: city.canonicalPrayerRoute,
    };
  });

  const faqJsonLd = generateFaqJsonLd(HOMEPAGE_FAQS);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />


      <div className="flex flex-col">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900/5 via-transparent to-transparent pt-12 pb-16 sm:pt-20 sm:pb-24">
          <Container>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <Badge variant="primary" className="text-xs uppercase tracking-wider font-semibold">
                  🇨🇦 Canada Mosque Discovery Utility
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  9 Metropolises · {allMosques.length} Mosques Listed
                </Badge>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-5xl">
                Find a Mosque Near Me in Canada
              </h1>

              <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                Discover authentic mosques, Islamic centers, and prayer halls across Canada. Locate places of worship near you, browse by metropolitan city, and check daily solar prayer times calculated for Canadian latitudes.
              </p>

              {/* Primary Call to Actions */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/mosque-near-me"
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl bg-emerald-700 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-emerald-800 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                >
                  📍 Find Mosques Near Me
                </Link>
                <Link
                  href="/mosques"
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl border border-stone-300 bg-white px-8 py-3.5 text-base font-semibold text-stone-700 shadow-sm hover:bg-stone-50 transition"
                >
                  🕌 Browse Mosques Directory
                </Link>
                <Link
                  href="/prayer-times"
                  className="w-full sm:w-auto inline-flex justify-center items-center rounded-xl px-5 py-3.5 text-sm font-semibold text-emerald-800 hover:text-emerald-950 hover:underline transition"
                >
                  🕐 View Prayer Times →
                </Link>
              </div>

              {/* Quick Jump Pills */}
              <div className="mt-10 pt-6 border-t border-stone-200/60 max-w-xl mx-auto">
                <p className="text-xs font-medium text-stone-500 mb-3 uppercase tracking-wider">
                  Jump to Canadian Metropolises
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {cityCardData.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.mosqueRoute}
                      className="rounded-lg border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
                    >
                      {c.name}, {c.province}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 2. "Mosques in Canada" Overview Section */}
        <section className="border-t border-stone-200 bg-white py-14 sm:py-16">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="primary" className="mb-2">
                  National Directory
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Find Mosques in Canada
                </h2>
                <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
                  Canada Mosque Near Me serves Muslim residents, travelers, and newcomers across Canada by providing an accurate, geolocated index of {allMosques.length} community mosques and prayer rooms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-stone-600 leading-relaxed">
                <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6 space-y-2">
                  <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                    <span>🧭</span> Nearby Location Search
                  </h3>
                  <p>
                    Use browser-level geolocation to discover places of worship ordered by real geographic distance. Whether you need Fajr on the road or a place for Maghrib, find your closest community center with turn-by-turn directions.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6 space-y-2">
                  <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                    <span>🏢</span> Verified Mosque Facilities
                  </h3>
                  <p>
                    Each individual profile documents real amenities including dedicated women&apos;s prayer sections, on-site wudu facilities, wheelchair accessibility, and on-premises vehicle parking.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6 space-y-2">
                  <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                    <span>🏙️</span> City &amp; Area Directories
                  </h3>
                  <p>
                    Browse comprehensive directories for nine major Canadian metropolitan regions. Search by neighborhood or municipality, filter by venue classification, and find local community prayer spaces.
                  </p>
                </div>

                <div className="rounded-xl border border-stone-200 bg-stone-50/50 p-6 space-y-2">
                  <h3 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                    <span>☀️</span> Astronomical Prayer Engine
                  </h3>
                  <p>
                    Access daily solar prayer schedules tailored precisely for Canadian coordinates using the North American ISNA calculation standard, including adjustments for higher latitudes and daylight saving shifts.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 3. Major Canadian Cities Discovery Cards */}
        <section className="border-t border-stone-200 bg-stone-50/60 py-16">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <Badge variant="secondary" className="mb-2">
                Regional Hubs
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Mosques in Major Canadian Cities
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Browse canonical mosque directories and daily calculated prayer schedules for supported Canadian metropolises.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {cityCardData.map((city) => (
                <div
                  key={city.slug}
                  className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs hover:border-emerald-600/40 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                        {city.province}
                      </span>
                      <span className="text-xs font-medium text-stone-500">
                        {city.count} {city.count === 1 ? "mosque" : "mosques"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">
                      <Link href={city.mosqueRoute} className="hover:text-emerald-800 transition">
                        {city.name} Mosques
                      </Link>
                    </h3>
                    <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      Explore verified mosques, Islamic centers, musallas, and prayer timings in {city.name}, {city.province}.
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <Link
                      href={city.mosqueRoute}
                      className="font-semibold text-emerald-700 hover:text-emerald-900 transition"
                    >
                      Browse {city.name} →
                    </Link>
                    <Link
                      href={city.prayerRoute}
                      className="text-stone-500 hover:text-stone-700 transition"
                    >
                      Prayer Times
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/mosques"
                className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
              >
                <span>View all {allMosques.length} Canadian mosques in directory</span>
                <span>→</span>
              </Link>
            </div>
          </Container>
        </section>

        {/* 4. Dedicated Near Me Section */}
        <section className="border-t border-stone-200 bg-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-emerald-900/5 via-white to-stone-50 p-8 sm:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-2 space-y-4">
                  <Badge variant="primary" className="text-xs">
                    Client-Side Geolocation
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                    Find a Mosque Near You
                  </h2>
                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                    Looking for the nearest place to pray right now? Use our browser-only discovery tool. Your device calculates distance locally using the Haversine formula against verified Canadian coordinates.
                  </p>
                  <div className="rounded-xl bg-white border border-stone-200/80 p-4 text-xs text-stone-600 space-y-1.5 shadow-2xs">
                    <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <span>🔒</span> Complete Privacy Guarantee
                    </div>
                    <p>
                      Your precise coordinates are never transmitted across the network, never logged, and never stored in cookies or databases. If location permissions are denied, you can browse any city manually.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center items-start md:items-center">
                  <Link
                    href="/mosque-near-me"
                    className="w-full text-center rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
                  >
                    📍 Find a Mosque Near Me
                  </Link>
                  <Link
                    href="/mosques"
                    className="w-full text-center rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50 transition"
                  >
                    Browse by City Instead
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 5. Prayer Times Section */}
        <section className="border-t border-stone-200 bg-stone-50/50 py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <Badge variant="primary" className="mb-2">
                Astronomical Engine
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Prayer Times for Canadian Cities
              </h2>
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
                We calculate daily Fajr, Sunrise, Dhuhr, Asr, Maghrib, and Isha times using authentic solar algorithms adapted for Canadian latitudes.
              </p>
            </div>

            <div className="max-w-4xl mx-auto rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-2xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs text-stone-600 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">
                    Solar Position Standard
                  </h3>
                  <p>
                    Calculated using standard ISNA parameters (15° Fajr and Isha angles) with angle-based rules for high-latitude Canadian summer nights.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">
                    Timezone &amp; Daylight Saving
                  </h3>
                  <p>
                    Automatic adjustments across Eastern, Central, Mountain, and Pacific Canadian time zones with local DST transitions.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-stone-900 text-sm mb-1">
                    Calculated vs. Iqamah
                  </h3>
                  <p>
                    These represent astronomical prayer windows, not mosque-specific Iqamah congregation times. Contact individual mosques for congregational schedules.
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-6">
                <p className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-3 text-center sm:text-left">
                  City Prayer Timetables
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {cityCardData.map((c) => (
                    <Link
                      key={c.slug}
                      href={c.prayerRoute}
                      className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-emerald-600 hover:text-emerald-800 transition"
                    >
                      {c.name} Prayer Times
                    </Link>
                  ))}
                  <Link
                    href="/prayer-times"
                    className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition"
                  >
                    View All Prayer Times →
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 6. Jummah Section */}
        <section className="border-t border-stone-200 bg-white py-16">
          <Container>
            <div className="max-w-4xl mx-auto rounded-2xl border border-stone-200 bg-stone-50/50 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <Badge variant="primary">
                    Friday Congregations
                  </Badge>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-900">
                    Jummah Prayer at Canadian Mosques
                  </h2>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    Many Canadian mosques host multiple Friday (Jummah) prayer shifts to accommodate congregants safely. In keeping with our strict zero-fabrication standard, Jummah shift times are only published when directly corroborated with venue administrations.
                  </p>
                  <p className="text-xs text-amber-900 bg-amber-50 border border-amber-200/80 px-3 py-2 rounded-lg">
                    Notice: Never guess Jummah times from Dhuhr schedules. Open a mosque profile to check contact details and confirm current shift announcements directly.
                  </p>
                </div>

                <div className="flex flex-col gap-2.5 w-full sm:w-auto shrink-0">
                  <Link
                    href="/jummah"
                    className="text-center rounded-xl bg-emerald-700 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
                  >
                    Jummah Directory →
                  </Link>
                  <Link
                    href="/jummah/toronto"
                    className="text-center rounded-xl border border-stone-300 bg-white px-6 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
                  >
                    Toronto Jummah Pilot
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* 7. How It Works (3 Steps) */}
        <section className="border-t border-stone-200 bg-stone-50/70 py-16">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                How It Works
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Three straightforward steps to locate authentic places of worship across Canada.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-sm">
                  1
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  Select Discovery Mode
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Use the browser-based Near Me utility to locate the nearest mosque automatically, or pick your Canadian city from the regional index.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-sm">
                  2
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  Browse &amp; Filter Options
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Filter Canadian locations by facility amenities: dedicated women&apos;s halls, wudu areas, wheelchair accessibility, or vehicle parking.
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center space-y-3 shadow-2xs">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center mx-auto text-sm">
                  3
                </div>
                <h3 className="text-base font-semibold text-stone-900">
                  View Profile &amp; Directions
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Open dedicated mosque profiles for exact physical addresses, Google Maps directions, contact information, and calculated prayer times.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* 8. Frequently Asked Questions (FAQ) */}
        <section className="border-t border-stone-200 bg-white py-16">
          <Container>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <Badge variant="secondary" className="mb-2">
                  Common Questions
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-2 text-sm text-stone-600">
                  Helpful information about finding mosques and checking prayer times in Canada.
                </p>
              </div>

              <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-stone-50/30">
                {HOMEPAGE_FAQS.map((faq, index) => (
                  <div key={index} className="p-6">
                    <h3 className="text-base font-semibold text-stone-900 mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* 9. Data Integrity Distinction Notice */}
        <section className="border-t border-stone-200 py-12 bg-stone-50/80">
          <Container>
            <div className="max-w-3xl mx-auto">
              <DataDistinctionNotice />
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
