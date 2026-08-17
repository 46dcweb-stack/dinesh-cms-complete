"use client";

import { useState } from "react";
import FAQGrid from "@/components/sections/FAQGrid";

export type FaqGroup = { category: string; questions: { q: string; a: string }[] };

const ALL_LABEL = "All";

// Only the category filter needs to be interactive — the groups themselves are
// passed in from the server component so the Q&A ships in the initial HTML.
export default function FaqContent({ groups }: { groups: FaqGroup[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_LABEL);

  if (groups.length === 0) return null;

  const categories = [ALL_LABEL, ...groups.map(g => g.category)];
  const visibleGroups = activeCategory === ALL_LABEL
    ? groups
    : groups.filter(g => g.category === activeCategory);

  return (
    <>
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
    </>
  );
}
