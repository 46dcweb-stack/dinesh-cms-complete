"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface ManifestoCTAProps {
  heading?: string;
  headingItalic?: string;
  description?: string;
  btn1Label?: string;
  btn2Label?: string;
}

export default function ManifestoCTA({
  heading = "Will you build",
  headingItalic = "the future with us?",
  description = "We are actively looking for visionary collaborators, strategic investors, and relentless system-builders who share our core principles and want to engineer the next decade of resilient technology.",
  btn1Label = "Join the Collective",
  btn2Label = "Read the Vision Paper",
}: ManifestoCTAProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-32 mb-32 relative overflow-hidden rounded-[2rem] border border-white/5 bg-brand-muted/30 p-10 md:p-24 text-center shadow-2xl max-w-6xl mx-auto"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[80%] h-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.12)_0%,transparent_60%)] rounded-full -z-10 blur-3xl pointer-events-none" />

      <h3 className="text-4xl md:text-5xl lg:text-6xl font-display mb-8 text-white tracking-tight">
        {heading} <br className="hidden md:block" />
        <span className="text-gradient italic">{headingItalic}</span>
      </h3>

      <p className="text-text-secondary mb-12 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
        <Link href="/contact" className="btn-premium px-12 py-4 text-sm md:text-base w-full sm:w-auto">
          {btn1Label}
        </Link>
        <Link href="/about" className="btn-outline px-12 py-4 text-sm md:text-base w-full sm:w-auto bg-brand-dark/50">
          {btn2Label}
        </Link>
      </div>
    </motion.div>
  );
}
