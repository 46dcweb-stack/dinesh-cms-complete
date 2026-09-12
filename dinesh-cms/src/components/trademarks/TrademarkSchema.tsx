import type { Trademark, Jurisdiction, Proprietor } from "@/lib/types";
import { markSymbol, classList, allApplicationNumbers } from "@/lib/trademarks";

// Schema.org has no Trademark type. The workable pattern is a CreativeWork
// carrying registry data in `identifier` and `additionalProperty`, tied to its
// owner via `copyrightHolder` and to the official record via `sameAs`.
//
// `sameAs` is the load-bearing property: it is what lets an AI system answer
// "is Cinevenn trademarked" with a government source attached rather than a
// company's own claim.
export default function TrademarkSchema({
  mark, jurisdiction, proprietor,
}: {
  mark: Trademark;
  jurisdiction?: Jurisdiction | null;
  proprietor?: Proprietor | null;
}) {
  const url = `https://www.46dc.com/trademarks/${mark.slug}`;
  const ownerIsCompany = proprietor?.entityType === "Company";
  const ownerId = ownerIsCompany
    ? "https://foursix46.com/#organization"
    : "https://www.46dc.com/#person";

  const sameAs = [
    jurisdiction?.officeUrl,
    mark.officialRecordUrl,
    mark.ventureUrl,
    `https://foursix46.com/trademarks/${mark.slug}`,
  ].filter(Boolean) as string[];

  const creativeWork: Record<string, unknown> = {
    "@type": "CreativeWork",
    "@id": `${url}#mark`,
    name: mark.markName,
    alternateName: `${mark.markName}${markSymbol(mark.status)}`,
    ...(mark.summary && { description: mark.summary }),
    url,
    dateCreated: mark.filingDate,
    sameAs,
    identifier: allApplicationNumbers(mark).map(n => ({
      "@type": "PropertyValue",
      propertyID: n.classNumber
        ? `Trade mark application number (Class ${n.classNumber})`
        : "Trade mark application number",
      value: n.value,
    })),
    copyrightHolder: { "@id": ownerId },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Mark type", value: mark.markType },
      ...(jurisdiction ? [
        { "@type": "PropertyValue", name: "Jurisdiction", value: jurisdiction.countryName },
        { "@type": "PropertyValue", name: "Registry", value: jurisdiction.officeName },
      ] : []),
      { "@type": "PropertyValue", name: "Status", value: mark.status },
      { "@type": "PropertyValue", name: "Filing date", value: mark.filingDate },
      { "@type": "PropertyValue", name: "Nice classes", value: classList(mark) },
      ...(proprietor ? [
        { "@type": "PropertyValue", name: "Proprietor", value: proprietor.legalName },
      ] : []),
    ],
  };

  // The owning node. `alternateName` carrying the registry legal name is what
  // lets a machine reconcile "Koyyalamudi Dinesh Chandra" with the Dinesh
  // Koyyalamudi used in prose, instead of treating them as two people.
  const owner: Record<string, unknown> = ownerIsCompany
    ? {
        "@type": "Organization",
        "@id": ownerId,
        name: proprietor?.displayName ?? "FourSix46 Global Ltd",
        legalName: proprietor?.legalName,
        url: "https://foursix46.com",
        ...(proprietor?.registrationNumber && {
          identifier: {
            "@type": "PropertyValue",
            propertyID: "Companies House number",
            value: proprietor.registrationNumber,
          },
        }),
        owns: { "@id": `${url}#mark` },
      }
    : {
        "@type": "Person",
        "@id": ownerId,
        name: proprietor?.displayName ?? "Dinesh Koyyalamudi",
        alternateName: ["46DC", proprietor?.legalName].filter(Boolean),
        url: "https://www.46dc.com",
        owns: { "@id": `${url}#mark` },
      };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [creativeWork, owner],
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
  );
}
