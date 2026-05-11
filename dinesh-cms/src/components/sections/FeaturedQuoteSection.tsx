"use client";

import { motion } from "framer-motion";

interface FeaturedQuoteSectionProps {
  quote?: string;
  source?: string;
  box1Label?: string;
  box1Title?: string;
  box2Label?: string;
  box2Title?: string;
  // legacy props kept so existing Firestore data doesn't break anything
  featuredBlog?: { slug: string; title: string } | null;
  featuredPress?: { url?: string; title: string } | null;
}

export default function FeaturedQuoteSection({
  quote,
  source,
  box1Label,
  box1Title,
  box2Label,
  box2Title,
  featuredBlog,
  featuredPress,
}: FeaturedQuoteSectionProps) {
  // Resolve box content — prefer explicit box fields, fall back to legacy
  const resolvedBox1Label = box1Label ?? "Featured Journal";
  const resolvedBox1Title = box1Title ?? featuredBlog?.title ?? "";
  const resolvedBox2Label = box2Label ?? "Featured Press";
  const resolvedBox2Title = box2Title ?? featuredPress?.title ?? "";

  const showBoxes = resolvedBox1Title || resolvedBox2Title;

  if (!quote && !showBoxes) return null;

  return (
    <section className="py-20 md:py-28 px-6 bg-brand-dark border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Quote */}
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            <span className="block text-brand-primary font-display text-7xl md:text-8xl leading-none mb-2 select-none opacity-40">
              "
            </span>
            <p className="text-2xl md:text-4xl lg:text-5xl font-display text-white leading-[1.2] tracking-tight italic px-4">
              {quote}
            </p>
            <span className="block text-brand-primary font-display text-7xl md:text-8xl leading-none mt-2 select-none opacity-40 rotate-180 inline-block">
              "
            </span>
            {source && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-[1px] w-10 bg-brand-primary/40" />
                <span className="text-brand-primary text-xs font-mono uppercase tracking-[0.3em]">
                  {source}
                </span>
                <div className="h-[1px] w-10 bg-brand-primary/40" />
              </div>
            )}
          </motion.div>
        )}

        {/* Info Cards — no links, purely informational */}
        {showBoxes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {resolvedBox1Title && (
              <div className="bg-zinc-900/80 border border-white/10 rounded-2xl px-6 py-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-3">
                  {resolvedBox1Label}
                </span>
                <span className="block text-sm md:text-base font-medium text-white leading-snug">
                  {resolvedBox1Title}
                </span>
              </div>
            )}
            {resolvedBox2Title && (
              <div className="bg-zinc-900/80 border border-white/10 rounded-2xl px-6 py-5">
                <span className="block text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary mb-3">
                  {resolvedBox2Label}
                </span>
                <span className="block text-sm md:text-base font-medium text-white leading-snug">
                  {resolvedBox2Title}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}