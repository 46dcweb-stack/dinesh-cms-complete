"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ventures = [
    {
        name: "FourSix46",
        role: "Founder & CEO",
        description: "A premier venture studio dedicated to building high-impact startups at the intersection of technology and human scalability.",
        logo: "/images/venture_1.png",
    },
    {
        name: "TechVision",
        role: "Board Member",
        description: "An innovation hub focused on accelerating breakthroughs in artificial intelligence and next-generation software architectures.",
        logo: "/images/venture_2.png",
    },
];

export default function Ventures() {
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-4 font-mono">Building the Future</span>
                        <h2 className="text-4xl md:text-6xl font-display">Ventures & <span className="text-gradient italic">Impact</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-1000">
                    {ventures.map((venture, index) => (
                        <motion.div
                            key={venture.name}
                            initial={{ opacity: 0, rotateY: 30, y: 30 }}
                            whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
                            whileHover={{
                                y: -8,
                                boxShadow: "0 25px 50px -12px rgba(255, 90, 0, 0.25)",
                                borderColor: "rgba(255, 90, 0, 0.4)"
                            }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.15,
                                duration: 0.8,
                                ease: [0.23, 1, 0.32, 1]
                            }}
                            className="group glass-card p-10 relative overflow-hidden flex flex-col h-full transition-shadow duration-500"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-brand-primary/30 transition-all">
                                    <div className="w-7 h-7 rounded-full bg-linear-to-br from-brand-primary to-brand-accent shadow-[0_0_15px_rgba(255,90,0,0.3)]" />
                                </div>
                                <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20">
                                    {venture.role}
                                </span>
                            </div>

                            <h3 className="text-3xl font-display mb-4 text-white group-hover:text-brand-primary transition-colors">{venture.name}</h3>
                            <p className="text-text-secondary text-lg leading-relaxed mb-8">
                                {venture.description}
                            </p>

                            <Link href="/ventures" className="mt-auto text-sm font-bold uppercase tracking-[0.2em] flex items-center text-text-muted hover:text-brand-primary transition-all group/link">
                                Explore <ArrowUpRight className="ml-2 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" size={18} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
