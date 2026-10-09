import React from "react";
import Link from "next/link";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { constructMetadata } from "@/domain/seo/metadata";
import { DataDistinctionNotice } from "@/components/common/DataDistinctionNotice";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";
import { WebPageSchema } from "@/components/seo/WebPageSchema";

const PAGE_TITLE = "Jummah Prayer Times in Canada | Friday Prayer Schedules";
const PAGE_DESCRIPTION =
  "Find verified Friday Jummah prayer shift times across Canadian mosques. We only publish confirmed schedules — no guessing or fabrication. Browse by city or contact your local mosque directly.";

export const metadata = constructMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  canonicalPath: "/jummah",
});

const breadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Jummah", item: "/jummah" },
];

export default function JummahPage() {
  return (
    <div className="py-12 sm:py-16">
      <WebPageSchema title={PAGE_TITLE} description={PAGE_DESCRIPTION} url="/jummah" />
      <BreadcrumbSchema items={breadcrumbs} />
      <Container>
        <div className="max-w-3xl">
          <Badge variant="primary" className="mb-3">
            Friday Prayer Shifts
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Friday (Jummah) Prayer Schedules
          </h1>
          <p className="mt-4 text-stone-600 leading-relaxed">
            Friday prayer services (Jummah) are hosted across Canadian mosques, often in multiple
            consecutive shifts to accommodate local congregations. We publish schedules only when
            directly verified with mosque administrations.
          </p>

          <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-stone-900">
              Zero Fabrication Policy
            </h2>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              Jummah times displayed on Canada Mosque Near Me must be verified directly with mosque
              administrations. Where shift times have not yet been corroborated, we transparently
              indicate unverified status rather than guessing.
            </p>
            <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900">
              <strong>Current Status:</strong> No verified Jummah schedules are currently available.
              We are actively working to corroborate schedules directly with mosque administrators
              across Canada.
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between p-5 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <div>
              <h2 className="text-sm font-bold text-emerald-950">
                Pilot Directory: Toronto &amp; GTA
              </h2>
              <p className="text-xs text-emerald-800 mt-0.5">
                Check verification status for Toronto &amp; GTA Friday prayer announcements.
              </p>
            </div>
            <Link
              href="/jummah/toronto"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 transition"
            >
              <span>Toronto Jummah →</span>
            </Link>
          </div>

          {/* City mosque links for context */}
          <div className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-stone-900 mb-3">
              Find Your Local Mosque
            </h2>
            <p className="text-xs text-stone-600 mb-4">
              While Jummah schedules are being verified, you can find contact information and
              directions to mosques in your city.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: "Toronto mosques", href: "/mosques/toronto" },
                { name: "Montreal mosques", href: "/mosques/montreal" },
                { name: "Ottawa mosques", href: "/mosques/ottawa" },
                { name: "Calgary mosques", href: "/mosques/calgary" },
                { name: "Edmonton mosques", href: "/mosques/edmonton" },
                { name: "Vancouver mosques", href: "/mosques/vancouver" },
              ].map((city) => (
                <Link
                  key={city.href}
                  href={city.href}
                  className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-700 hover:border-emerald-600 hover:text-emerald-800 transition"
                >
                  {city.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <DataDistinctionNotice />
          </div>
        </div>
      </Container>
    </div>
  );
}
