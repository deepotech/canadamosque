import React from "react";
import { Container } from "@/components/common/Container";
import { Badge } from "@/components/common/Badge";
import { constructMetadata } from "@/domain/seo/metadata";
import { DataDistinctionNotice } from "@/components/common/DataDistinctionNotice";
import { CanonicalMosqueRepository } from "@/domain/mosque/canonical-repository";
import { defaultScheduleRepository } from "@/domain/schedule/repository";
import { MosqueFinder } from "@/components/finder/MosqueFinder";
import { WebPageSchema } from "@/components/seo/WebPageSchema";
import { BreadcrumbSchema } from "@/components/seo/BreadcrumbSchema";

const PAGE_TITLE = "Mosques in Canada | Canadian Mosque Finder & Directory";
const PAGE_DESCRIPTION =
  "Find authentic mosques, Islamic centers, musallas, and prayer rooms across Canada. Browse 331 verified locations in Toronto, Montreal, Calgary, Edmonton, Ottawa, Mississauga, Winnipeg, Brampton, and Vancouver. View addresses, directions, facilities, and calculated prayer times.";

export const metadata = constructMetadata({
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  canonicalPath: "/mosques",
});

export default async function MosquesPage() {
  const repo = new CanonicalMosqueRepository();
  const mosques = await repo.list();
  const cities = await repo.getAllCities();

  const verifiedIqamahList = await defaultScheduleRepository.getAllVerifiedIqamah();
  const verifiedJummahList = await defaultScheduleRepository.getAllVerifiedJummah();

  const verifiedIqamahMosqueIds = verifiedIqamahList.map((i) => i.mosqueId);
  const verifiedJummahMosqueIds = verifiedJummahList.map((j) => j.mosqueId);

  const breadcrumbs = [
    { name: "Home", item: "/" },
    { name: "Mosques", item: "/mosques" },
  ];

  return (
    <div className="py-8 sm:py-12">
      <WebPageSchema title={PAGE_TITLE} description={PAGE_DESCRIPTION} url="/mosques" />
      <BreadcrumbSchema items={breadcrumbs} />
      <Container>
        {/* Page Header */}
        <div className="max-w-3xl mb-8">
          <Badge variant="primary" className="mb-3">
            🇨🇦 National Directory · 9 Metropolises
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Canadian Mosques & Prayer Locations
          </h1>
          <p className="mt-3 text-stone-600 leading-relaxed text-sm sm:text-base">
            Discover <strong>{mosques.length} verified locations</strong> across 9 Canadian metropolitan regions (Toronto, Montreal, Calgary, Edmonton, Ottawa, Mississauga, Winnipeg, Brampton, Vancouver). Search by name, filter by place type (Mosque, Islamic Center, Musalla, Jummah venue), or sort by distance from your current location.
          </p>
        </div>

        {/* Real Interactive Mosque Finder */}
        <MosqueFinder
          initialMosques={mosques}
          availableCities={cities}
          verifiedIqamahMosqueIds={verifiedIqamahMosqueIds}
          verifiedJummahMosqueIds={verifiedJummahMosqueIds}
        />

        {/* Philosophy and Integrity Distinction */}
        <div className="mt-12">
          <DataDistinctionNotice />
        </div>
      </Container>
    </div>
  );
}
