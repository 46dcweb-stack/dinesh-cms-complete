"use client";
import type { Venture } from "@/lib/types";

type VentureDisplay = Pick<Venture, "name" | "role" | "description" | "image" | "color"> & {
  url?: string; sortOrder?: number; featured?: boolean; status?: string; id?: string;
};

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const DEFAULT_VENTURES: VentureDisplay[] = [
  { name: "FourSix46", role: "Founder & CEO", description: "A premier venture studio dedicated to building high-impact startups at the intersection of technology and human scalability. We specialize in converting complex vision into resilient infrastructure.", image: "/gallery/venture-3.png", color: "#FF5A00" },
  { name: "TechVision", role: "Board Member", description: "An innovation hub focused on accelerating breakthroughs in artificial intelligence and next-generation software architectures. We provide the strategic fuel for exponential growth.", image: "/gallery/venture-2.png", color: "#00AEFF" },
  { name: "Quantum Logic", role: "Lead Strategist", description: "Developing advanced algorithmic models for predictive market analytics. We bridge the gap between abstract data and actionable commercial intelligence.", image: "/gallery/venture-1.png", color: "#A855F7" },
  { name: "Resilient Systems", role: "Venture Partner", description: "Focusing on the creation of robust, self-healing digital infrastructures for global enterprise. We build systems that thrive on volatility.", image: "/gallery/venture-6.png", color: "#22C55E" },
  { name: "Future Pulse", role: "Angel Investor", description: "Identifying and backing the next generation of storytellers and system builders. We invest in ideas that redefine the human-tech relationship.", image: "/gallery/venture-4.png", color: "#EAB308" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  "active":      { label: "Active",      color: "text-green-400 bg-green-400/10 border-green-400/20",           dot: "bg-green-400" },
  "pre-launch":  { label: "Pre Launch",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20",              dot: "bg-blue-400" },
  "coming-soon": { label: "Coming Soon", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",        dot: "bg-yellow-400" },
  "building":    { label: "Building",    color: "text-brand-primary bg-brand-primary/10 border-brand-primary/20", dot: "bg-brand-primary animate-pulse" },
  "inactive":    { label: "Inactive",    color: "text-white/30 bg-white/5 border-white/10",                     dot: "bg-white/30" },
};

interface AdvancedVenturesProps {
  data?: VentureDisplay[];
  eyebrow?: string;
  heading?: string;
  headingItalic?: string;
}

export default function AdvancedVentures({
  data,
  eyebrow = "Portfolio Showcase",
  heading = "Building the",
  headingItalic = "Invisible",
}: AdvancedVenturesProps) {
  const ventures: VentureDisplay[] = (data && data.length > 0) ? data : DEFAULT_VENTURES;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative bg-brand-dark border-t border-white/5 py-20 md:py-0">
      {/* Mobile Header */}
      <div className="md:hidden px-6 mb-16 text-center">
        <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">{eyebrow}</span>
        <h2 className="text-4xl font-display text-white leading-tight">
          {heading} <span className="text-gradient italic">{headingItalic}</span>
        </h2>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Left Side: Sticky (Desktop) */}
        <div className="hidden md:block w-1/2 relative bg-black min-h-screen">
          <div className="h-screen sticky top-0 flex flex-col justify-between p-12 lg:p-20">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="relative z-20">
              <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">{eyebrow}</span>
              <h2 className="text-3xl lg:text-4xl font-display text-white leading-[1.1]">
                {heading} <br /><span className="text-gradient italic">{headingItalic}</span>
              </h2>
            </motion.div>

            {/* Centered Curvy Card Container */}
            <div className="relative z-20 flex items-center justify-center flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                  transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                  className="relative w-[80%] aspect-[5/4] rounded-[32px] overflow-hidden shadow-2xl"
                  style={{ boxShadow: `0 25px 50px -12px ${ventures[activeIndex]?.color}40` }}
                >
                  <div className="absolute inset-0 opacity-20" style={{ backgroundColor: ventures[activeIndex]?.color }} />
                  <Image
                    src={ventures[activeIndex]?.image || "/gallery/venture-3.png"}
                    alt={ventures[activeIndex]?.name || "Venture"}
                    fill
                    className="object-cover transition-all duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
                  <div className="absolute inset-0 rounded-[32px] border-2 opacity-50" style={{ borderColor: ventures[activeIndex]?.color }} />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative z-20" />
          </div>
        </div>

        {/* Right Side: Scrolling */}
        <div className="w-full md:w-1/2 px-6 lg:px-24">
          <div className="md:py-[30vh] space-y-24 md:space-y-[60vh]">
            {ventures.map((venture, index) => (
              <VentureCard key={venture.name} venture={venture} index={index} onInView={() => setActiveIndex(index)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function VentureCard({ venture, index, onInView }: { venture: VentureDisplay; index: number; onInView: () => void }) {
  const cardRef = useRef(null);
  const statusCfg = venture.status ? STATUS_CONFIG[venture.status] : null;

  return (
    <motion.div ref={cardRef} onViewportEnter={onInView} viewport={{ amount: 0.3 }} className="group">
      {/* Mobile image */}
      <div className="block md:hidden aspect-video relative overflow-hidden rounded-2xl mb-8 border border-white/5">
        <Image
          src={venture?.image || "/gallery/venture-3.png"}
          alt={venture?.name || "Venture"}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-dark/80 to-transparent" />
      </div>

      {/* Status badge */}
      {statusCfg && (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] mb-5 ${statusCfg.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {statusCfg.label}
        </div>
      )}

      <h3 className="text-4xl md:text-6xl font-display mb-8 text-white group-hover:text-brand-primary transition-colors cursor-pointer">{venture.name}</h3>
      <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-12 max-w-lg">{venture.description}</p>
      {venture.url && (
        <Link href={venture.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 py-4 px-8 border border-white/10 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all group/btn">
          <span className="text-sm font-bold uppercase tracking-[0.2em]">View Project</span>
          <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" size={18} />
        </Link>
      )}
    </motion.div>
  );
}