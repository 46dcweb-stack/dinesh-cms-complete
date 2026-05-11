"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface FeaturedQuoteSectionProps {
  quote?: string;
  source?: string;
  featuredBlog?: { slug: string; title: string } | null;
  featuredPress?: { url?: string; title: string } | null;
}

export default function FeaturedQuoteSection({
  quote,
  source,
  featuredBlog,
  featuredPress,
}: FeaturedQuoteSectionProps) {
  if (!quote && !featuredBlog && !featuredPress) return null;

  return (
    <section className="py-20 md:py-28 px-6 bg-brand-dark border-t border-white/5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-14"
          >
            {/* Quote mark */}
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

        {/* 2 featured boxes */}
        {(featuredBlog || featuredPress) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto"
          >
            {featuredBlog && (
              <Link
                href={`/blog/${featuredBlog.slug}`}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 transition-all hover:border-brand-primary/40 hover:bg-brand-primary/5 group"
              >
                <span className="block text-[10px] uppercase tracking-[0.22em] text-brand-primary mb-2">
                  Featured Journal
                </span>
                <span className="block text-sm md:text-base text-white leading-snug group-hover:text-brand-primary transition-colors">
                  {featuredBlog.title}
                </span>
              </Link>
            )}
            {featuredPress && (
              <Link
                href={featuredPress.url || "/press"}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 transition-all hover:border-brand-primary/40 hover:bg-brand-primary/5 group"
              >
                <span className="block text-[10px] uppercase tracking-[0.22em] text-brand-primary mb-2">
                  Featured Press
                </span>
                <span className="block text-sm md:text-base text-white leading-snug group-hover:text-brand-primary transition-colors">
                  {featuredPress.title}
                </span>
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
