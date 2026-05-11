"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Linkedin, Twitter } from "lucide-react";

const STATIC_TEAM = [
    {
        name: "Dinesh Koyyalamudi",
        role: "Founder & Visionary",
        image: "/images/dinesh_hero.png",
        bio: "Strategist focused on resilient architectures and venture building.",
        linkedIn: "",
        twitter: "",
    },
    {
        name: "Elena Rossi",
        role: "Head of Strategy",
        image: "/images/venture_1.png",
        bio: "Specializing in global operations and cross-cultural scalability.",
        linkedIn: "",
        twitter: "",
    },
    {
        name: "Marcus Chen",
        role: "Technical Architect",
        image: "/images/venture_2.png",
        bio: "Building the high-performance backbones of future ventures.",
        linkedIn: "",
        twitter: "",
    },
];

interface TeamMemberData {
    name: string;
    role: string;
    image: string;
    bio: string;
    linkedIn?: string;
    twitter?: string;
}

interface Props {
    members?: TeamMemberData[];
}

export default function LeadershipTeam({ members }: Props) {
    const team = members && members.length > 0 ? members : STATIC_TEAM;

    return (
        <section className="py-24 md:py-32 bg-brand-dark overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="mb-20 max-w-2xl">
                    <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
                        The Collective
                    </span>
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

function TeamCard({ member, index }: { member: TeamMemberData; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const hasLinks = member.linkedIn || member.twitter;

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
            {/* Hover image reveal */}
            <div className="hidden md:block absolute right-32 top-1/2 -translate-y-1/2 w-[300px] h-[400px] pointer-events-none z-0">
                <AnimatePresence>
                    {isHovered && member.image && (
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
                                unoptimized
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

            {/* Social icons — shown when linkedIn or twitter is set in admin */}
            {hasLinks && (
                <div className="relative z-20 flex items-center gap-2 mt-4 md:mt-0 md:flex-shrink-0">
                    {member.linkedIn && (
                        <a
                            href={member.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/30 hover:text-[#0077B5] hover:border-[#0077B5]/40 hover:bg-[#0077B5]/10 transition-all duration-300"
                            title={`${member.name} on LinkedIn`}
                        >
                            <Linkedin size={14} />
                        </a>
                    )}
                    {member.twitter && (
                        <a
                            href={member.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                            title={`${member.name} on X / Twitter`}
                        >
                            <Twitter size={14} />
                        </a>
                    )}
                </div>
            )}

            {/* Mobile image */}
            {member.image && (
                <div className="md:hidden mt-6 overflow-hidden aspect-[4/5] rounded-xl relative grayscale">
                    <Image src={member.image} alt={member.name} fill className="object-cover" unoptimized />
                </div>
            )}
        </motion.div>
    );
}