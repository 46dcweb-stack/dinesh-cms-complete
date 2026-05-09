"use client";

import type { HomePage } from "@/lib/types";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

import { GlowingEffect } from "@/components/ui/glowing-effect";

const DEFAULT_PRINCIPLES = [
  {
    id: "01",
    label: "PRINCIPLE 01",
    title: "NEO-BRUTALISM",
    description:
      "Structural clarity and raw honesty in every venture.",
    color: "#E22D2D",
  },
  {
    id: "02",
    label: "PRINCIPLE 02",
    title: "QUIET LUXURY",
    description:
      "Sophistication through absolute precision and poise.",
    color: "#E22D2D",
  },
  {
    id: "03",
    label: "PRINCIPLE 03",
    title: "SOVEREIGN SCALE",
    description:
      "Distributed, secure, and sovereign infrastructure nodes.",
    color: "#00AEFF",
  },
  {
    id: "04",
    label: "PRINCIPLE 04",
    title: "GLOBAL SYNERGY",
    description:
      "Unifying cross-border ventures for maximum impact.",
    color: "#00AEFF",
  },
];

export default function EthosSection({
  data,
}: {
  data?: HomePage["ethos"];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const phrase =
    data?.phrase ||
    "We do not just build companies. We engineer ecosystems. FourSix46 is a parent brand dedicated to shaping the future of global logistics, sovereign data, and biophilic tech.";

  const words = phrase.split(" ");

  const principles =
    data?.principles || DEFAULT_PRINCIPLES;

  // LEFT SIDE PARALLAX
  const leftY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -120]
  );

  const leftOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.85, 1],
    [1, 1, 0.9, 0.4]
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-brand-dark min-h-[300vh] overflow-clip"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-primary/10 blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[180px]" />
      </div>

      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="max-w-7xl mx-auto h-full px-6 lg:px-24 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-20">

          {/* LEFT SIDE */}
          <motion.div
            style={{
              y: leftY,
              opacity: leftOpacity,
            }}
            className="flex flex-col justify-center h-screen relative"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="text-brand-primary font-bold tracking-[0.35em] text-[10px] uppercase block mb-6 font-mono">
                OUR PURPOSE
              </span>

              <h2 className="text-5xl sm:text-6xl md:text-8xl font-display text-brand-primary leading-none tracking-tight">
                MISSION
              </h2>
            </motion.div>

            {/* Animated Mission Text */}
            <div className="max-w-3xl">
              <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display leading-[1.08] flex flex-wrap text-left text-text-secondary">
                {words.map((word: string, i: number) => {
                  const start = i / words.length;
                  const end = start + 1 / words.length;

                  return (
                    <Word
                      key={i}
                      progress={scrollYProgress}
                      range={[
                        0.08 + start * 0.35,
                        0.08 + end * 0.35,
                      ]}
                    >
                      {word}
                    </Word>
                  );
                })}
              </p>
            </div>

            {/* Ambient Gradient Line */}
            <motion.div
              style={{
                opacity: useTransform(
                  scrollYProgress,
                  [0, 0.3],
                  [0, 1]
                ),
              }}
              className="absolute bottom-24 left-0 w-48 h-[1px] bg-gradient-to-r from-brand-primary to-transparent"
            />
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="relative h-[300vh]">
            <div className="sticky top-0 h-screen flex items-center">
              <div className="w-full space-y-8">

                {principles.map(
                  (
                    p: NonNullable<
                      HomePage["ethos"]
                    >["principles"][0],
                    idx: number
                  ) => (
                    <PrincipleCard
                      key={p.id}
                      principle={p}
                      index={idx}
                      scrollProgress={scrollYProgress}
                    />
                  )
                )}

              </div>
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
  scrollProgress: MotionValue<number>;
}) {
  const start = 0.15 + index * 0.12;
  const end = start + 0.22;

  const opacity = useTransform(
    scrollProgress,
    [start, end],
    [0, 1]
  );

  const y = useTransform(
    scrollProgress,
    [start, end],
    [120, 0]
  );

  const scale = useTransform(
    scrollProgress,
    [start, end],
    [0.92, 1]
  );

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        borderColor: `${principle.color}40`,
        boxShadow: `0 0 60px ${principle.color}12`,
      }}
      className="
        relative overflow-hidden
        rounded-[32px]
        border
        bg-white/[0.02]
        backdrop-blur-xl
        p-8 md:p-10
        transition-all duration-700
        hover:bg-white/[0.04]
        hover:border-white/20
      "
    >
      {/* Top Glow Border */}
      <div
        className="absolute top-0 left-0 h-[2px] w-full opacity-70"
        style={{
          background: `linear-gradient(90deg, ${principle.color}, transparent)`,
        }}
      />

      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at top left, ${principle.color}40, transparent 60%)`,
        }}
      />

      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
        borderWidth={2}
      />

      <div className="relative z-10">
        <span
          className="font-mono text-[10px] font-bold tracking-[0.35em] uppercase block mb-5"
          style={{ color: principle.color }}
        >
          {principle.label}
        </span>

        <h4 className="text-2xl md:text-3xl font-display text-white mb-4 tracking-tight leading-tight">
          {principle.title}
        </h4>

        <p className="text-text-muted text-sm md:text-base leading-relaxed">
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
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(
    progress,
    range,
    [0.08, 1]
  );

  const y = useTransform(
    progress,
    range,
    [40, 0]
  );

 const blur = useTransform(
  progress,
  range,
  [12, 0]
);

const blurFilter = useTransform(
  blur,
  (v) => `blur(${v}px)`
);

return (
  <span className="relative mr-4 mt-4">
    <span className="absolute opacity-[0.06]">
      {children}
    </span>

    <motion.span
      style={{
        opacity,
        y,
        filter: blurFilter,
      }}
      className="inline-block will-change-transform"
    >
      {children}
    </motion.span>
  </span>
);
}