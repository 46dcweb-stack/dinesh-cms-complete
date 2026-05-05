"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const team = [
    {
        name: "Dinesh Koyyalamudi",
        role: "Founder & Visionary",
        image: "/images/dinesh_hero.png",
        bio: "Strategist focused on resilient architectures and venture building."
    },
    {
        name: "Elena Rossi",
        role: "Head of Strategy",
        image: "/images/venture_1.png",
        bio: "Specializing in global operations and cross-cultural scalability."
    },
    {
        name: "Marcus Chen",
        role: "Technical Architect",
        image: "/images/venture_2.png",
        bio: "Building the high-performance backbones of future ventures."
    }
];

export default function LeadershipTeam() {
    return (
        <section className="py-24 md:py-32 bg-brand-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 max-w-2xl">
                    <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">The Collective</span>
                    <h2 className="text-4xl md:text-6xl font-display leading-tight text-white italic">
                        Leadership & <span className="text-gradient">Logic.</span>
                    </h2>
                </div>

                <div className="flex flex-col border-t border-white/5">
                    {team.map((member, index) => (
                        <TeamCard key={index} member={member} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TeamCard({ member, index }: { member: typeof team[0], index: number }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-white/5 cursor-pointer overflow-hidden px-4 md:px-8"
        >
            {/* Reveal Image Overflow Container */}
            <div className="hidden md:block absolute right-32 top-1/2 -translate-y-1/2 w-[300px] h-[400px] pointer-events-none z-0">
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                            className="w-full h-full relative rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover grayscale"
                            />
                            <div className="absolute inset-0 bg-brand-primary/10 mix-blend-overlay" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-2 md:gap-12 w-full">
                <h3 className="text-3xl md:text-5xl font-display text-white group-hover:text-brand-primary transition-colors duration-500">
                    {member.name}
                </h3>
                <div className="flex flex-col">
                    <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] mb-1">
                        {member.role}
                    </span>
                    <p className="text-text-secondary text-sm max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                        {member.bio}
                    </p>
                </div>
            </div>

            {/* Mobile Image (Always visible or different transition) */}
            <div className="md:hidden mt-6 overflow-hidden aspect-[4/5] rounded-xl relative grayscale">
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                />
            </div>
        </motion.div>
    );
}
