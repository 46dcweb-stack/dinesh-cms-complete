import type { Metadata } from "next";
import FaqContent, { type FaqGroup } from "@/components/sections/FaqContent";
import { FaqSchema, PageSchema } from "@/components/seo/JsonLd";
import { getPublishedFaq, getFaqPageSettings } from "@/lib/firebase-data";
import { faqGroups } from "@/lib/data";
import { fbStr } from "@/lib/fallback";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "FAQs — Dinesh Koyyalamudi (46DC) & FourSix46®",
  description:
    "Common questions about Dinesh Koyyalamudi (46DC), FourSix46® Global Ltd, and its ventures: Stack46, Cinevenn, Route46 Couriers and 46 Dogs.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "FAQs — Dinesh Koyyalamudi (46DC) & FourSix46®",
    url: "/faq",
    type: "website",
  },
};

const PAGE_DEFAULTS = {
  pageLabel: "Knowledge Protocol",
  pageTitle: "Frequently Asked",
  pageTitleItalic: "Questions.",
  pageDescription:
    "Answers to the most common questions about Dinesh Koyyalamudi, FourSix46, and our ventures.",
};

export default async function FAQPage() {
  const [fbFaq, fbMeta] = await Promise.all([
    getPublishedFaq(),
    getFaqPageSettings(),
  ]);

  const meta = (fbMeta ?? {}) as any;

  // Build the grouped Q&A on the server so the content is in the initial HTML.
  let groups: FaqGroup[];
  if (fbFaq.length > 0) {
    const seen = new Set<string>();
    const deduped = (fbFaq as any[]).filter(item => {
      const key = (item.question ?? "").trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const byCategory = deduped.reduce((acc: Record<string, { q: string; a: string }[]>, item: any) => {
      const cat = item.category ?? "General";
      (acc[cat] ||= []).push({ q: item.question, a: item.answer });
      return acc;
    }, {});
    groups = Object.entries(byCategory).map(([category, questions]) => ({ category, questions }));
  } else {
    groups = faqGroups as FaqGroup[];
  }

  const label       = fbStr(meta.pageLabel,       PAGE_DEFAULTS.pageLabel);
  const title       = fbStr(meta.pageTitle,       PAGE_DEFAULTS.pageTitle);
  const titleItalic = fbStr(meta.pageTitleItalic, PAGE_DEFAULTS.pageTitleItalic);
  const description = fbStr(meta.pageDescription, PAGE_DEFAULTS.pageDescription);

  const allItems = groups.flatMap(g => g.questions);

  return (
    <div className="pt-48 lg:pt-48 pb-24">
      <PageSchema name="FAQ" description="Direct answers about Dinesh Koyyalamudi (46DC) and FourSix46 Global Ltd." path="/faq" />
      <FaqSchema items={allItems} />
      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-3xl mb-16">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              {label}
            </span>
            <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">
              {title} <span className="text-gradient italic">{titleItalic}</span>
            </h1>
            {description && (
              <p className="text-text-secondary text-lg mt-6 max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <FaqContent groups={groups} />

        </div>
      </div>
    </div>
  );
}
