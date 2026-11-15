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

/**
 * Verified factual city descriptions and local context.
 * Strictly adheres to verified data boundaries — no invented facts.
 */
const CITY_DESCRIPTIONS: Record<
  string,
  {
    intro: (count: number) => string;
    subtext: string;
    localAreasLabel: string;
    localAreas: string[];
  }
> = {
  mississauga: {
    intro: (count) =>
      `Mississauga is home to an active Muslim community within Peel Region west of Toronto. This verified directory documents ${count} community mosques, Islamic centers, and musallas located across Streetsville, Malton, Cooksville, and Meadowvale.`,
    subtext:
      "Browse verified street addresses, on-site parking availability, wheelchair accessibility indicators, and daily solar prayer times calculated specifically for Mississauga coordinates.",
    localAreasLabel: "Peel Region & Mississauga Neighborhoods",
    localAreas: ["Streetsville", "Malton", "Cooksville", "Meadowvale", "Port Credit", "Dixie"],
  },
  toronto: {
    intro: (count) =>
      `As Canada's largest metropolitan center, Toronto features a comprehensive network of Muslim places of worship across its central core and historical boroughs. This directory catalogs ${count} verified mosques, Islamic centers, and musallas spanning Toronto Core, Scarborough, North York, Etobicoke, East York, and York.`,
    subtext:
      "Discover facility accessibility, verified Friday Jummah schedules, direct phone contacts, and daily prayer times calculated for Toronto coordinates.",
    localAreasLabel: "Toronto Metropolitan Boroughs & Districts",
    localAreas: ["Downtown Toronto", "Scarborough", "North York", "Etobicoke", "East York", "York"],
  },
  montreal: {
    intro: (count) =>
      `Montreal features a vibrant, multilingual Muslim community with places of worship situated across the island. This directory catalogs ${count} verified mosques, centres islamiques, and musallas across neighborhoods including Downtown, Saint-Laurent, Saint-Léonard, and Côte-des-Neiges.`,
    subtext:
      "Retrouvez des adresses vérifiées, les équipements accessibles (fauteuil roulant, stationnement), et les horaires de prières solaires adaptés aux coordonnées montréalaises.",
    localAreasLabel: "Quartiers & Arrondissements de Montréal",
    localAreas: ["Downtown / Centre-Ville", "Saint-Laurent", "Saint-Léonard", "Côte-des-Neiges", "Ahuntsic", "Verdun", "LaSalle"],
  },
  calgary: {
    intro: (count) =>
      `Calgary's Muslim community is served by ${count} verified mosques, Islamic centers, and musallas located across the city's Northeast, Northwest, Downtown, and surrounding quadrants.`,
    subtext:
      "Browse verified locations, on-premises facilities, and daily solar prayer times calculated precisely for Alberta's Mountain Time Zone.",
    localAreasLabel: "Calgary Quadrants & Neighborhoods",
    localAreas: ["Downtown Calgary", "Northeast Calgary", "Northwest Calgary", "Beltline", "Forest Lawn"],
  },
  edmonton: {
    intro: (count) =>
      `As Alberta's provincial capital, Edmonton is home to historical and contemporary Muslim congregations. This directory covers ${count} verified mosques and prayer halls across Downtown Edmonton, Mill Woods, Strathcona, and surrounding districts.`,
    subtext:
      "Access verified addresses, direct phone contacts, wheelchair accessibility data, and daily prayer schedules tuned for northern latitudes.",
    localAreasLabel: "Edmonton Districts & Communities",
    localAreas: ["Downtown Edmonton", "Mill Woods", "Strathcona", "Castledowns", "North Edmonton"],
  },
  vancouver: {
    intro: (count) =>
      `Greater Vancouver is served by ${count} verified mosques, musallas, and Islamic community centers located across Downtown Vancouver, Kitsilano, Strathcona, and surrounding areas.`,
    subtext:
      "Access verified addresses, facility features, Pacific Time Zone solar prayer calculations, and turn-by-turn driving directions.",
    localAreasLabel: "Metro Vancouver Areas",
    localAreas: ["Downtown Vancouver", "Kitsilano", "Strathcona", "West End", "Mount Pleasant"],
  },
  brampton: {
    intro: (count) =>
      `Located in Peel Region adjacent to Mississauga, Brampton has a rapidly growing Muslim community. This directory includes ${count} verified mosques, masjids, and prayer facilities across Brampton, Bramalea, Castlemore, and Springdale.`,
    subtext:
      "View verified street addresses, on-site parking availability, accessibility information, and driving directions across Peel Region.",
    localAreasLabel: "Brampton Communities & Districts",
    localAreas: ["Brampton Central", "Bramalea", "Castlemore", "Springdale", "Mount Pleasant"],
  },
  ottawa: {
    intro: (count) =>
      `Canada's federal capital is served by ${count} verified mosques, Islamic community organizations, and musallas across Central Ottawa, Nepean, Gloucester, Kanata, and Orléans.`,
    subtext:
      "View verified facility addresses, direct telephone contacts, and daily solar prayer times calculated for the National Capital Region.",
    localAreasLabel: "National Capital Region Districts",
    localAreas: ["Central Ottawa", "Nepean", "Gloucester", "Kanata", "Orléans", "Vanier"],
  },
  winnipeg: {
    intro: (count) =>
      `Winnipeg's Muslim community is supported by ${count} verified mosques, Islamic centers, and campus musallas across Central Winnipeg, St. Vital, and Transcona.`,
    subtext:
      "Explore verified addresses, wheelchair accessibility data, driving directions, and Central Time Zone solar prayer calculations.",
    localAreasLabel: "Winnipeg Neighborhoods & Communities",
    localAreas: ["Central Winnipeg", "St. Vital", "Transcona", "Fort Garry", "St. Boniface"],
  },
};

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
  const withParking = mosques.filter((m) => m.facilities.parkingAvailable).length;
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

  const cityDetail = CITY_DESCRIPTIONS[config.slug] || {
    intro: (count: number) =>
      `Find ${count} verified mosques, Islamic centers, and musallas across ${config.name} (${config.provinceFullName}).`,
    subtext:
      "Browse verified addresses, wheelchair accessibility, calculated daily prayer times, and driving directions.",
    localAreasLabel: `${config.name} Local Areas`,
    localAreas: config.knownMunicipalities,
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <Container>
        {/* Page Header */}
        <header className="max-w-3xl mb-8">
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
            <Badge variant="outline" className="text-stone-500">
              🇨🇦 Canada Directory
            </Badge>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Mosques in {config.name}, {config.province}
          </h1>

          <p className="mt-3 text-stone-700 leading-relaxed text-sm sm:text-base">
            {cityDetail.intro(mosques.length)}
          </p>
          <p className="mt-2 text-stone-600 leading-relaxed text-sm">
            {cityDetail.subtext}
          </p>

          {/* Quick Links / CTAs */}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={config.canonicalPrayerRoute}
              className="min-h-[44px] inline-flex items-center rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 transition shadow-2xs"
            >
              Daily Prayer Times in {config.name} →
            </Link>
            {config.slug === "toronto" ? (
              <Link
                href="/jummah/toronto"
                className="min-h-[44px] inline-flex items-center rounded-xl bg-teal-50 px-4 py-2.5 text-xs font-semibold text-teal-800 ring-1 ring-inset ring-teal-600/20 hover:bg-teal-100 transition shadow-2xs"
              >
                Verified Jummah Schedules in Toronto →
              </Link>
            ) : (
              <Link
                href="/jummah"
                className="min-h-[44px] inline-flex items-center rounded-xl bg-stone-50 px-4 py-2.5 text-xs font-semibold text-stone-700 ring-1 ring-inset ring-stone-200 hover:bg-stone-100 transition shadow-2xs"
              >
                Friday Jummah Guidance →
              </Link>
            )}
            <Link
              href="/mosque-near-me"
              className="min-h-[44px] inline-flex items-center rounded-xl bg-stone-100 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-200 transition"
            >
              📍 Find Closest by GPS →
            </Link>
          </div>
        </header>

        {/* Factual Statistics Bar */}
        <section aria-label="City Mosque Statistics" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-emerald-800">{mosques.length}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Verified Facilities</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-emerald-800">{withWheelchair}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Wheelchair Accessible</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-emerald-800">{withParking}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">On-Site Parking</div>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-4 text-center shadow-xs">
            <div className="text-2xl font-bold text-emerald-800">{withPhone}</div>
            <div className="text-xs text-stone-500 font-medium mt-1">Direct Phone Contact</div>
          </div>
        </section>

        {/* Local Navigation Block: Toronto Boroughs */}
        {config.slug === "toronto" && (
          <nav aria-label="Toronto Borough Directories" className="mb-10 rounded-2xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h2 className="text-base font-bold text-stone-900">
                Explore Toronto Borough Directories
              </h2>
              <span className="text-xs text-stone-500">
                Dedicated area hubs within Greater Toronto
              </span>
            </div>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Toronto&apos;s verified prayer locations are distributed across the city center and its historical boroughs. Explore individual borough directories:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Link
                href="/mosques/scarborough"
                className="min-h-[44px] flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-3 text-center shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <span className="font-semibold text-xs text-stone-900">Scarborough</span>
                <span className="text-[11px] text-stone-500 mt-0.5">33 Mosques</span>
              </Link>
              <Link
                href="/mosques/north-york"
                className="min-h-[44px] flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-3 text-center shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <span className="font-semibold text-xs text-stone-900">North York</span>
                <span className="text-[11px] text-stone-500 mt-0.5">19 Mosques</span>
              </Link>
              <Link
                href="/mosques/toronto"
                className="min-h-[44px] flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-3 text-center shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <span className="font-semibold text-xs text-stone-900">Toronto Core</span>
                <span className="text-[11px] text-stone-500 mt-0.5">22 Mosques</span>
              </Link>
              <Link
                href="/mosques/etobicoke"
                className="min-h-[44px] flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-3 text-center shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <span className="font-semibold text-xs text-stone-900">Etobicoke</span>
                <span className="text-[11px] text-stone-500 mt-0.5">7 Mosques</span>
              </Link>
              <Link
                href="/mosques/east-york"
                className="min-h-[44px] flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-3 text-center shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <span className="font-semibold text-xs text-stone-900">East York</span>
                <span className="text-[11px] text-stone-500 mt-0.5">7 Mosques</span>
              </Link>
              <Link
                href="/mosques/york"
                className="min-h-[44px] flex flex-col justify-center rounded-xl border border-stone-200 bg-white p-3 text-center shadow-2xs hover:border-emerald-600 hover:text-emerald-800 transition"
              >
                <span className="font-semibold text-xs text-stone-900">York</span>
                <span className="text-[11px] text-stone-500 mt-0.5">8 Mosques</span>
              </Link>
            </div>
          </nav>
        )}

        {/* Local Navigation Block: Peel Region (Mississauga & Brampton) */}
        {(config.slug === "mississauga" || config.slug === "brampton") && (
          <nav aria-label="Peel Region Connections" className="mb-10 rounded-2xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <h2 className="text-base font-bold text-stone-900 mb-2">
              Peel Region &amp; Greater Toronto Area Connections
            </h2>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {config.slug === "mississauga"
                ? "Mississauga forms a major part of Peel Region alongside Brampton, situated directly west of Toronto. Browse connected regional directories:"
                : "Brampton is situated directly north of Mississauga in Peel Region, minutes from northwestern Toronto. Browse connected regional directories:"}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {config.slug === "mississauga" && (
                <Link
                  href="/cities/brampton"
                  className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
                >
                  Brampton Mosques (24 Locations) →
                </Link>
              )}
              {config.slug === "brampton" && (
                <Link
                  href="/cities/mississauga"
                  className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
                >
                  Mississauga Mosques (31 Locations) →
                </Link>
              )}
              <Link
                href="/cities/toronto"
                className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
              >
                Toronto Mosques (96 Locations) →
              </Link>
              <Link
                href="/provinces/ontario"
                className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
              >
                All Ontario Mosques →
              </Link>
            </div>
          </nav>
        )}

        {/* Local Navigation Block: Alberta Metropolises (Calgary & Edmonton) */}
        {(config.slug === "calgary" || config.slug === "edmonton") && (
          <nav aria-label="Alberta Metropolises" className="mb-10 rounded-2xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <h2 className="text-base font-bold text-stone-900 mb-2">
              Alberta Metropolitan Directories
            </h2>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              {config.slug === "calgary"
                ? "Calgary and Edmonton represent Alberta's two major urban centers. Browse Edmonton mosques and Alberta-wide facilities:"
                : "Edmonton and Calgary are Alberta's two major metropolitan centers. Explore Calgary mosques and Alberta-wide facilities:"}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {config.slug === "calgary" ? (
                <Link
                  href="/cities/edmonton"
                  className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
                >
                  Edmonton Mosques (34 Locations) →
                </Link>
              ) : (
                <Link
                  href="/cities/calgary"
                  className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
                >
                  Calgary Mosques (28 Locations) →
                </Link>
              )}
              <Link
                href="/provinces/alberta"
                className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
              >
                All Alberta Mosques →
              </Link>
            </div>
          </nav>
        )}

        {/* Local Navigation Block: Montreal & Quebec */}
        {config.slug === "montreal" && (
          <nav aria-label="Quebec Province Connection" className="mb-10 rounded-2xl border border-stone-200 bg-stone-50/70 p-5 sm:p-6">
            <h2 className="text-base font-bold text-stone-900 mb-2">
              Ressource Bilingue du Québec / Quebec Bilingual Directory
            </h2>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Montréal regroupe la majorité des mosquées et centres islamiques du Québec. Consultez également le répertoire provincial du Québec :
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/provinces/quebec"
                className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
              >
                Répertoire Provincial du Québec (67 Mosquées) →
              </Link>
              <Link
                href="/prayer-times/montreal"
                className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-200 bg-white px-4 py-2 text-xs font-semibold text-stone-800 hover:border-emerald-600 hover:text-emerald-800 transition shadow-2xs"
              >
                Horaires de Prière à Montréal →
              </Link>
            </div>
          </nav>
        )}

        {/* Mosques Grid */}
        <section aria-labelledby="city-mosques-heading" className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <h2 id="city-mosques-heading" className="text-xl font-bold text-stone-900">
              Verified Mosques &amp; Masjids in {config.name} ({mosques.length})
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Sorted alphabetically
            </span>
          </div>

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
        </section>

        {/* Related / Sibling Canadian Cities */}
        {relatedCities.length > 0 && (
          <nav aria-label="Sibling Canadian Cities" className="rounded-xl bg-stone-50 p-6 border border-stone-200">
            <h2 className="text-base font-semibold text-stone-900 mb-3">
              Explore Nearby &amp; Sibling Canadian Cities
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/cities/${c.slug}`}
                  className="min-h-[44px] inline-flex items-center rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-700 hover:border-emerald-600 hover:text-emerald-700 transition shadow-2xs"
                >
                  {c.name}, {c.province}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </Container>
    </div>
  );
}
