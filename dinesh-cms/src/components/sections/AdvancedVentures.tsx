import type { Venture } from "@/lib/types";
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";


const DEFAULT_VENTURES = [
    {
        name: "FourSix46",
        role: "Founder & CEO",
        description: "A premier venture studio dedicated to building high-impact startups at the intersection of technology and human scalability. We specialize in converting complex vision into resilient infrastructure.",
        image: "/gallery/venture-3.png",
        color: "#FF5A00"
    },
    {
        name: "TechVision",
        role: "Board Member",
        description: "An innovation hub focused on accelerating breakthroughs in artificial intelligence and next-generation software architectures. We provide the strategic fuel for exponential growth.",
        image: "/gallery/venture-2.png",
        color: "#00AEFF"
    },
    {
        name: "Quantum Logic",
        role: "Lead Strategist",
        description: "Developing advanced algorithmic models for predictive market analytics. We bridge the gap between abstract data and actionable commercial intelligence.",
        image: "/gallery/venture-1.png",
        color: "#A855F7"
    },
    {
        name: "Resilient Systems",
        role: "Venture Partner",
        description: "Focusing on the creation of robust, self-healing digital infrastructures for global enterprise. We build systems that thrive on volatility.",
        image: "/gallery/venture-6.png",
        color: "#22C55E"
    },
    {
        name: "Future Pulse",
        role: "Angel Investor",
        description: "Identifying and backing the next generation of storytellers and system builders. We invest in ideas that redefine the human-tech relationship.",
        image: "/gallery/venture-4.png",
        color: "#EAB308"
    }
];

export default function AdvancedVentures({ data }: { data?: Venture[] }) {
    const ventures = data || DEFAULT_VENTURES;
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="relative bg-brand-dark border-t border-white/5 py-20 md:py-0">
            {/* Mobile Header */}
            <div className="md:hidden px-6 mb-16 text-center">
                <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">Portfolio Showcase</span>
                <h2 className="text-4xl font-display text-white leading-tight">
                    Building the <span className="text-gradient italic">Invisible</span>
                </h2>
            </div>

            <div className="flex flex-col md:flex-row">
                {/* Left Side: Stretched container for sticky child (Desktop Only) */}
                <div className="hidden md:block w-1/2 relative bg-black min-h-screen">
                    <div className="h-screen sticky top-0 overflow-hidden flex flex-col justify-between p-12 lg:p-20">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="relative z-20"
                        >
                            <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-4 font-mono">Portfolio Showcase</span>
                            <h2 className="text-4xl lg:text-6xl font-display text-white leading-[1.1]">
                                Building the <br />
                                <span className="text-gradient italic">Invisible</span>
                            </h2>
                        </motion.div>

                        <AnimatePresence initial={false}>
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 0.8, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
                                className="absolute inset-0 w-full h-full"
                                style={{ backgroundColor: `${ventures[activeIndex].color}10` }}
                            >
                                <Image
                                    src={ventures[activeIndex]?.image || "/gallery/venture-3.png"}
                                    alt={ventures[activeIndex]?.name || "Venture"}
                                    fill
                                    className="object-cover grayscale-[0.5] brightness-[0.5] hover:grayscale-0 hover:brightness-100 transition-all duration-1000"
                                    unoptimized
                                    priority
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-linear-to-b from-brand-dark/90 via-brand-dark/10 to-brand-dark/90" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Venture Indicator - Bottom Left */}
                        <div className="relative z-20">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="flex items-center gap-4"
                                >
                                    <div
                                        className="w-12 h-[1px]"
                                        style={{ backgroundColor: ventures[activeIndex].color }}
                                    />
                                    <span className="text-white/40 font-mono text-[9px] uppercase tracking-[0.5em]">
                                        Venture {activeIndex + 1}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Right Side: Scrolling Content */}
                <div className="w-full md:w-1/2 px-6 lg:px-24">
                    <div className="md:py-[30vh] space-y-24 md:space-y-[60vh]">
                        {ventures.map((venture, index) => (
                            <VentureCard
                                key={venture.name}
                                venture={venture}
                                index={index}
                                onInView={() => setActiveIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function VentureCard({ venture, index, onInView }: { venture: Venture, index: number, onInView: () => void }) {
    const cardRef = useRef(null);

    return (
        <motion.div
            ref={cardRef}
            onViewportEnter={onInView}
            viewport={{ amount: 0.3 }}
            className="group"
        >
            {/* Mobile-only Image */}
            <div className="block md:hidden aspect-video relative overflow-hidden rounded-2xl mb-8 border border-white/5">
                <Image
                    src={venture?.image || "/gallery/venture-3.png"}
                    alt={venture?.name || "Venture"}
                    fill
                    className="object-cover"
                    unoptimized
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-dark/80 to-transparent" />
            </div>

            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="text-brand-primary font-mono text-xs md:text-sm leading-none">0{index + 1}</span>
                <div className="h-[1px] w-6 md:w-8 bg-brand-primary/30 group-hover:w-16 transition-all duration-500" />
                <span className="text-text-muted font-mono text-[9px] md:text-[10px] uppercase tracking-widest">{venture.role}</span>
            </div>

            <h3 className="text-4xl md:text-6xl font-display mb-8 text-white group-hover:text-brand-primary transition-colors cursor-pointer">
                {venture.name}
            </h3>

            <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-12 max-w-lg">
                {venture.description}
            </p>

            {venture.url && (
                <Link
                    href={venture.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 py-4 px-8 border border-white/10 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all group/btn"
                >
                    <span className="text-sm font-bold uppercase tracking-[0.2em]">View Project</span>
                    <ArrowUpRight className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" size={18} />
                </Link>
            )}
        </motion.div>
    );
}
