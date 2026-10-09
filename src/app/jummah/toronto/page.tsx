import React from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { constructMetadata } from "@/domain/seo/metadata";
import { DataDistinctionNotice } from "@/components/common/DataDistinctionNotice";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { defaultScheduleRepository } from "@/domain/schedule/repository";
import { MosqueTypeBadge } from "@/components/mosque/MosqueTypeBadge";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { WebPageSchema } from "@/components/seo/WebPageSchema";

const PAGE_TITLE = "Toronto Mosque Jummah (Friday Prayer) Schedules";
const PAGE_DESCRIPTION =
  "Verified Friday Jummah prayer shifts for Toronto and Greater Toronto Area mosques. We publish Jummah times only when directly confirmed with mosque administrations — no fabrication.";

export const metadata = constructMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  canonicalPath: "/jummah/toronto",
});

const breadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Jummah", item: "/jummah" },
  { name: "Toronto", item: "/jummah/toronto" },
];

export default async function TorontoJummahPage() {
  const mosqueRepo = new CanonicalMosqueRepository();
  const verifiedJummahList = await defaultScheduleRepository.getAllVerifiedJummah();
  const allMosques = await mosqueRepo.list();

  // Combine verified Jummah with mosque identity
  const items = verifiedJummahList
    .map((j) => {
      const mosque = allMosques.find((m) => m.id === j.mosqueId);
      return mosque ? { schedule: j, mosque } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="py-8 sm:py-12">
      <WebPageSchema title={PAGE_TITLE} description={PAGE_DESCRIPTION} url="/jummah/toronto" />
      <BreadcrumbSchema items={breadcrumbs} />
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="primary" className="mb-3">
            Friday Prayer · Toronto &amp; GTA
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Verified Toronto Jummah Schedules
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
            Friday prayer services (Jummah) are hosted across Toronto mosques, Islamic centers, and
            designated prayer halls. Many venues host multiple consecutive shifts to accommodate
            congregants safely.
          </p>
        </div>

        {/* Zero Fabrication Verification Standard Notice */}
        <div className="mb-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
            Zero-Fabrication Data Standard
          </h2>
          <p className="mt-2 text-xs text-stone-600 leading-relaxed">
            In accordance with our strict data honesty policy, Jummah shift times are only published
            when directly corroborated with venue announcements. Unverified times are never guessed or
            inferred from Dhuhr prayer times.
          </p>
        </div>

        {/* Directory List or Honest Empty State */}
        {items.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 sm:p-12 text-center shadow-sm">
            <span className="text-4xl block mb-3" aria-hidden="true">
              🕌
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Verified Jummah schedules are not currently published
            </h3>
            <p className="mt-2 text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
              We are actively verifying Friday shift announcements directly from Toronto mosque
              administrations. In the meantime, you can find mosque contact numbers and directions to
              confirm their current Jummah shifts.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/mosques/toronto"
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition"
              >
                Browse Toronto Mosques →
              </Link>
              <Link
                href="/prayer-times/toronto"
                className="rounded-xl border border-stone-300 bg-white px-5 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition"
              >
                View Toronto Calculated Prayer Times
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map(({ schedule, mosque }) => (
              <div
                key={schedule.id}
                className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MosqueTypeBadge classification={mosque.classification} />
                    {/* Use dynamic province from canonical data — never hardcoded */}
                    <span className="text-xs text-stone-500">{mosque.city}, {mosque.province}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">
                    <Link href={`/mosque/${mosque.slug}`} className="hover:text-emerald-700">
                      {mosque.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-stone-500">{mosque.address}</p>

                  {/* Shifts */}
                  <div className="mt-4 space-y-2">
                    {schedule.shifts.map((shift) => (
                      <div
                        key={shift.shiftNumber}
                        className="rounded-lg border border-stone-100 bg-stone-50 p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-stone-800">
                            Shift {shift.shiftNumber}
                          </span>
                          {shift.language && (
                            <span className="ml-2 text-[10px] bg-stone-200/70 text-stone-700 px-1.5 py-0.5 rounded">
                              {shift.language}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-bold text-stone-900">
                          {shift.khutbahTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400">
                    Verified {schedule.verification.verifiedAt}
                  </span>
                  <Link
                    href={`/mosque/${mosque.slug}`}
                    className="font-semibold text-emerald-700 hover:underline"
                  >
                    Details &amp; Directions →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Data Philosophy */}
        <div className="mt-12">
          <DataDistinctionNotice />
        </div>
      </Container>
    </div>
  );
}
