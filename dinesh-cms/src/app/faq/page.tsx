"use client";

import { useState, useEffect } from "react";
import FAQGrid from "@/components/sections/FAQGrid";
import { faqService, faqPageService } from "@/lib/firebase-services";
import type { FaqPageSettings } from "@/lib/types";
import { faqGroups } from "@/lib/data";

const ALL_LABEL = "All";

const PAGE_DEFAULTS: FaqPageSettings = {
  pageLabel: "Knowledge Protocol",
  pageTitle: "Frequently Asked",
  pageTitleItalic: "Questions.",
  pageDescription: "Answers to the most common questions about Dinesh Koyyalamudi, FourSix46, and our ventures.",
};

export default function FAQPage() {
  const [pageSettings, setPageSettings] = useState<FaqPageSettings>(PAGE_DEFAULTS);
  const [faqGroupsData, setFaqGroupsData] = useState<{ category: string; questions: { q: string; a: string }[] }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [pageMeta, fbFaq] = await Promise.all([
        faqPageService.get(),
        faqService.getPublished(),
      ]);

      if (pageMeta) setPageSettings({ ...PAGE_DEFAULTS, ...pageMeta });

      if (fbFaq && fbFaq.length > 0) {
        // Deduplicate by question text to remove any duplicates
        const seen = new Set<string>();
        const deduped = fbFaq.filter((item: any) => {
          const key = item.question?.trim().toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        const grouped = Object.entries(
          deduped.reduce((acc: any, item: any) => {
            const cat = item.category ?? "General";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push({ q: item.question, a: item.answer });
            return acc;
          }, {})
        ).map(([category, questions]) => ({ category, questions: questions as { q: string; a: string }[] }));

        setFaqGroupsData(grouped);
      } else {
        setFaqGroupsData(faqGroups);
      }

      setLoading(false);
    }
    load();
  }, []);

  const categories = [ALL_LABEL, ...faqGroupsData.map(g => g.category)];

  const visibleGroups = activeCategory === ALL_LABEL
    ? faqGroupsData
    : faqGroupsData.filter(g => g.category === activeCategory);

  const label       = pageSettings.pageLabel      ?? PAGE_DEFAULTS.pageLabel;
  const title       = pageSettings.pageTitle       ?? PAGE_DEFAULTS.pageTitle;
  const titleItalic = pageSettings.pageTitleItalic ?? PAGE_DEFAULTS.pageTitleItalic;
  const description = pageSettings.pageDescription ?? PAGE_DEFAULTS.pageDescription;

  return (
    <div className="pt-28 lg:pt-28 pb-24">
      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Page Header ──────────────────────────────────────── */}
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

          {/* ── Category Filter ──────────────────────────────────── */}
          {!loading && faqGroupsData.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-16">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-[0.2em] border transition-all duration-200
                    ${activeCategory === cat
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "bg-white/5 border-white/10 text-text-secondary hover:border-brand-primary/40 hover:text-white"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* ── FAQ Groups ───────────────────────────────────────── */}
          {loading ? (
            <div className="py-24 text-center text-text-secondary text-sm font-mono">Loading…</div>
          ) : (
            <div className="space-y-24 mb-32">
              {visibleGroups.map((group, idx) => (
                <div key={idx}>
                  {activeCategory === ALL_LABEL && (
                    <h2 className="text-brand-primary font-mono text-sm uppercase tracking-[0.4em] mb-12 border-b border-white/5 pb-4">
                      {group.category}
                    </h2>
                  )}
                  <FAQGrid questions={group.questions} />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
