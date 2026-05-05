"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

const defaultMilestones = [
    {
        year: "2012",
        title: "The First Question",
        description: "It started with a simple observation of systemic inefficiency. This wasn't just about business; it was about the logic of how we build things."
    },
    {
        year: "2015",
        title: "Venture Genesis",
        description: "Launching the first studio focused on human-centric scalability. We didn't build products; we built the frameworks that allowed products to thrive."
    },
    {
        year: "2018",
        title: "Global Pivoting",
        description: "Expanding operations to three continents. The challenge wasn't geographical—it was architectural. Scaling systems across cultures and timezones."
    },
    {
        year: "2021",
        title: "Resilience Focused",
        description: "Formalizing the 'Resilient Systems' manifesto. In an era of polycrisis, building for stability isn't enough. We must build for transformation."
    },
    {
        year: "2024",
        title: "Future Architectures",
        description: "Investing in next-gen software and AI that prioritize intent over automation. Building the tools for the next century of leaders."
    }
];

interface Milestone {
    year: string;
    title: string;
    description: string;
}

export default function StoryTimeline({ milestones }: { milestones?: Milestone[] }) {
    const activeMilestones = milestones && milestones.length > 0 ? milestones : defaultMilestones;
    return (
        <section className="py-24 md:py-32 bg-brand-dark/30 border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
                    {/* Left Column: Sticky Title */}
                    <div className="md:sticky md:top-32 h-fit">
                        <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">Our Evolution</span>
                        <h2 className="text-4xl md:text-6xl font-display leading-tight text-white">
                            The Founding <span className="text-gradient italic">Story.</span>
                        </h2>
                        <p className="mt-8 text-text-secondary text-lg max-w-sm">
                            A decade of questioning the status quo and building the frameworks for what comes next.
                        </p>
                    </div>

                    {/* Right Column: Vertical Timeline */}
                    <div className="relative pl-8 md:pl-12 border-l border-white/5">
                        <div className="space-y-24 md:space-y-32">
                            {activeMilestones.map((milestone, index) => (
                                <MilestoneItem key={index} milestone={milestone} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MilestoneItem({ milestone }: { milestone: Milestone }) {
    return (
        <motion.div
            initial={{ opacity: 0.2, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ amount: 0.8 }}
            transition={{ duration: 0.8 }}
            className="relative group pb-4"
        >
            {/* Timeline Dot */}
            <div className="absolute -left-[33px] md:-left-[49px] top-2 w-2 h-2 rounded-full bg-white/20 group-hover:bg-brand-primary transition-colors duration-500 shadow-[0_0_0_4px_rgba(255,255,255,0.02)] group-hover:shadow-[0_0_12px_rgba(255,90,0,0.5)] z-10" />

            <div className="flex flex-col space-y-4">
                <span className="text-brand-primary font-mono text-sm tracking-widest leading-none">
                    {milestone.year}
                </span>
                <h3 className="text-2xl md:text-4xl font-display text-white group-hover:text-brand-primary transition-colors">
                    {milestone.title}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed max-w-xl">
                    {milestone.description}
                </p>
            </div>
        </motion.div>
    );
}
