import type { Trademark } from "@/lib/types";
import { markSymbol } from "@/lib/trademarks";

// ItemList for the register index. Sits alongside the CollectionPage and
// FAQPage nodes emitted by PageSchema / FaqSchema.
export default function TrademarkListSchema({ marks }: { marks: Trademark[] }) {
  if (!marks || marks.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://www.46dc.com/trademarks#marklist",
    name: "Trademarks held by Dinesh Koyyalamudi and FourSix46 Global Ltd",
    numberOfItems: marks.length,
    itemListElement: marks.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://www.46dc.com/trademarks/${m.slug}`,
      name: `${m.markName}${markSymbol(m.status)} — ${m.markType.toLowerCase()}`,
    })),
  };

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
