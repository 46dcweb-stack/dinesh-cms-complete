"use client";
import type { HomePage } from "@/lib/types";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlowingEffect } from "@/components/ui/glowing-effect";


const DEFAULT_PRINCIPLES = [
  {
    id: "01",
    label: "PRINCIPLE 01",
    title: "NEO-BRUTALISM",
    description: "Structural clarity and raw honesty in every venture.",
    color: "#E22D2D",
  },
  {
    id: "02",
    label: "PRINCIPLE 02",
    title: "QUIET LUXURY",
    description: "Sophistication through absolute precision and poise.",
    color: "#E22D2D",
  },
  {
    id: "03",
    label: "PRINCIPLE 03",
    title: "SOVEREIGN SCALE",
    description: "Distributed, secure, and sovereign infrastructure nodes.",
    color: "#00AEFF",
  },
  {
    id: "04",
    label: "PRINCIPLE 04",
    title: "GLOBAL SYNERGY",
    description: "Unifying cross-border ventures for maximum impact.",
    color: "#00AEFF",
  },
];

export default function EthosSection({ data }: { data?: HomePage["ethos"] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress over the whole section.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const phrase = data?.phrase ||
    "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech.";
  const words = phrase.split(" ");
  const principles = data?.principles || DEFAULT_PRINCIPLES;

  return (
    <section
      ref={containerRef}
      className="
        relative bg-brand-dark transition-all duration-300
        min-h-[120vh] md:h-[300vh]
      "
    >
      {/* 
        MOBILE:
          - not sticky
          - allow natural page scroll
          - items-start so heading stays visible
          - no overflow-hidden so nothing gets clipped
        DESKTOP (md+):
          - sticky hero scrollytelling
          - overflow-hidden OK
      */}
      <div
        className="
          relative
          md:sticky md:top-0 md:h-screen
          flex items-start md:items-center
          px-6 lg:px-24
          py-16 md:py-0
          md:overflow-hidden
        "
      >
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 lg:gap-24 items-start">
          {/* Left Column */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="mb-8 md:mb-12"
            >
              <span className="text-brand-primary font-bold tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">
                OUR PURPOSE
              </span>

              {/* Slightly smaller base on mobile so it doesn't push content off-screen */}
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display text-brand-primary leading-none">
                MISSION
              </h2>
            </motion.div>

            <p className="max-w-2xl text-xl sm:text-2xl md:text-4xl lg:text-5xl font-display leading-[1.1] flex flex-wrap text-left text-text-secondary">
              {words.map((word: string, i: number) => {
                const start = i / words.length;
                const end = start + 1 / words.length;

                return (
                  <Word
                    key={i}
                    progress={scrollYProgress}
                    range={[0.1 + start * 0.4, 0.1 + end * 0.4]}
                  >
                    {word}
                  </Word>
                );
              })}
            </p>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 gap-6 pt-8 md:pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {principles.map((p: NonNullable<HomePage['ethos']>['principles'][0], idx: number) => (
                <PrincipleCard
                  key={p.id}
                  principle={p}
                  index={idx}
                  scrollProgress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type Principle = {
  id: string;
  label: string;
  title: string;
  description: string;
  color: string;
};

function PrincipleCard({
  principle,
  index,
  scrollProgress,
}: {
  principle: Principle;
  index: number;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = 0.2 + index * 0.1;
  const end = start + 0.2;

  const opacity = useTransform(scrollProgress, [start, end], [0, 1]);
  const y = useTransform(scrollProgress, [start, end], [40, 0]);

  return (
    <motion.div
      className="glass-card p-8 border-l-2 relative group overflow-hidden transition-all duration-500 hover:bg-white/5 h-full"
      style={{
        borderLeftColor: principle.color,
        opacity,
        y,
      }}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={3}
      />

      <div className="relative z-10 flex flex-col h-full">
        <span
          className="font-mono text-[9px] font-bold tracking-[0.3em] uppercase block mb-4"
          style={{ color: principle.color }}
        >
          {principle.label}
        </span>
        <h4 className="text-xl md:text-2xl font-display text-white mb-3 tracking-tight">
          {principle.title}
        </h4>
        <p className="text-text-muted text-sm leading-relaxed">
          {principle.description}
        </p>
      </div>
    </motion.div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: ReturnType<typeof import('framer-motion').useScroll>['scrollYProgress'];
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.15, 1]);

  return (
    <span className="relative mr-3 mt-3">
      <span className="absolute opacity-15">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}
