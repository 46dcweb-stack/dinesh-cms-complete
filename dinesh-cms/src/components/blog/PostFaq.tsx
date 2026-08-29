"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export type PostFaqItem = { question: string; answer: string };

// Rendered on the post itself, which is what makes the FAQPage schema legitimate:
// Google requires FAQ content published as structured data to be visible to the
// reader. Answers stay mounted (height-animated, not unmounted) so they are in
// the server HTML for crawlers even while collapsed.
export default function PostFaq({ items }: { items: PostFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items || items.length === 0) return null;

  return (
    <section className="mt-24" aria-labelledby="post-faq-heading">
      <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">
        Questions
      </span>
      <h2 id="post-faq-heading" className="text-3xl md:text-4xl font-display text-white mb-10 leading-tight">
        Frequently asked
      </h2>

      <div className="flex flex-col divide-y divide-white/5 border-t border-white/5">
        {items.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-controls={`post-faq-${idx}`}
                className="w-full flex items-start justify-between gap-6 py-6 text-left group"
              >
                <span className={`text-lg md:text-xl font-display leading-snug transition-colors duration-300 ${isOpen ? "text-brand-primary" : "text-white group-hover:text-brand-primary"}`}>
                  {faq.question}
                </span>
                <span className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 mt-0.5 ${isOpen ? "border-brand-primary bg-brand-primary text-white" : "border-white/10 text-white/40 group-hover:border-brand-primary/40 group-hover:text-brand-primary"}`}>
                  {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                </span>
              </button>

              <motion.div
                id={`post-faq-${idx}`}
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <p className="text-text-secondary text-base md:text-lg leading-relaxed pb-6 max-w-3xl">
                  {faq.answer}
                </p>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
