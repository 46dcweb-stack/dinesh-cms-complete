"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";


interface StackingManifestoProps {
    sections: any[];
}

export default function StackingManifesto({ sections }: StackingManifestoProps) {
    return (
        <div className="relative flex flex-col items-center">
            {sections.map((principle, index) => (
                <StackingCard
                    key={index}
                    principle={principle}
                    index={index}
                    total={sections.length}
                />
            ))}
        </div>
    );
}

function StackingCard({ principle, index, total }: { principle: any; index: number; total: number }) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll of this specific card container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"]
    });

    // We want the card to scale down slightly once the NEXT card starts covering it.
    // However, in a sticky stack, the next card's container starts after this one.
    // A simpler way for "Stacking Cards" is to have the scale effect based on the card's OWN position
    // relative to the top of the viewport once it is pinned, OR use the scroll of the entire section.

    // Let's use a simpler approach: Each card has a sticky container.
    // The scale of the card is 1 when it's entering, and stays 1 until...
    // Actually, to make the card UNDERNEATH scale, we need that card to react to the scroll progress.

    // Refined approach for stacking:
    // Each card is in a container with height (e.g., 100vh).
    // The card itself is sticky.

    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

    return (
        <div
            ref={containerRef}
            className="h-screen w-full flex items-center justify-center sticky top-0"
            style={{
                zIndex: index,
                // Apply a small vertical offset to create the "deck" look if desired
                paddingTop: `${index * 40}px`
            }}
        >
            <motion.div
                style={{ scale }}
                className="w-full max-w-5xl aspect-[16/9] md:aspect-[21/9] glass-card overflow-hidden relative group shadow-2xl border border-white/10"
            >
                {/* Background Image/Gradient */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={`/images/manifesto_${(index % 2) + 1}.png`}
                        alt={principle.heading || principle.title || `Manifesto section ${index + 1}`}
                        fill
                        className="object-cover opacity-30 grayscale group-hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-linear-to-br from-brand-dark/90 via-brand-dark/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center p-12 md:p-20">
                    <div className="flex items-center space-x-4 mb-8">
                        <span className="text-brand-primary font-mono text-sm tracking-[0.5em] uppercase">
                            Principle 0{index + 1}
                        </span>
                        <div className="h-[1px] w-20 bg-brand-primary/30" />
                    </div>

                    <h2 className="text-4xl md:text-7xl font-display text-white mb-8 leading-tight tracking-tighter">
                        {(principle.heading || principle.title || `Principle ${index + 1}`).split('. ')[1] || principle.heading || principle.title || `Principle ${index + 1}`}
                    </h2>

                    <div className="max-w-2xl">
                        <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-light">
                            {principle.body}
                        </p>
                    </div>

                    {principle.quote && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="mt-12 pt-8 border-t border-white/10 inline-block"
                        >
                            <p className="text-brand-primary italic text-lg">
                                — {principle.quote}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Corner Numbering (Magazine Style) */}
                <div className="absolute top-12 right-12 text-6xl md:text-9xl font-display opacity-5 text-white pointer-events-none">
                    0{index + 1}
                </div>
            </motion.div>
        </div>
    );
}
