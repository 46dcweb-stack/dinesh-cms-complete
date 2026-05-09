"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";

const faqs = [
    {
        question: "What ventures are you currently focused on?",
        answer: "Currently, my primary focus is on global logistics, sovereign data infrastructure, and biophilic technology. These represent the key pillars of resilient growth for the next decade."
    },
    {
        question: "How do you approach venture building?",
        answer: "We use a 'resilient systems' framework. Instead of building for quick exits, we build for structural integrity, long-term scalability, and the ability to thrive under systemic pressure."
    },
    {
        question: "Where are your global operations based?",
        answer: "FourSix46 operates across 5 global hubs, facilitating cross-border innovation and infrastructure deployment. Our decentralized approach ensures local relevance and global scale."
    },
    {
        question: "How can I collaborate with FourSix46?",
        answer: "We are always looking for visionary founders, strategic investors, and domain experts. You can reach out via our contact page to start a conversation about architecture and intent."
    }
];

interface FAQSectionProps {
    items?: { q: string; a: string }[];
    eyebrow?: string;
    heading?: string;
    headingItalic?: string;
    subtext?: string;
}

export default function FAQSection({ items, eyebrow, heading, headingItalic, subtext }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const displayFaqs = (items && items.length ? items : faqs.map((item) => ({
        q: item.question,
        a: item.answer
    })));

    const resolvedEyebrow = eyebrow || "Knowledge Base";
    const resolvedHeading = heading || "Frequently Asked";
    const resolvedItalic = headingItalic || "Questions.";
    const resolvedSubtext = subtext || "Quick insights into the architecture, vision, and operations of our venture studio.";

    return (
        <section className="py-24 md:py-32 bg-brand-dark/20 border-t border-white/5 relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24">
                    {/* Left Column: Title */}
                    <div>
                        <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-6 font-mono">{resolvedEyebrow}</span>
                        <h2 className="text-4xl md:text-6xl font-display leading-tight text-white mb-8">
                            {resolvedHeading} <span className="text-gradient italic">{resolvedItalic}</span>
                        </h2>
                        <p className="text-text-secondary text-lg max-w-sm mb-10">
                            {resolvedSubtext}
                        </p>
                        <Link
                            href="/faq"
                            className="group inline-flex items-center gap-2 text-brand-primary font-bold tracking-widest text-xs uppercase"
                        >
                            View Full FAQ Page
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Right Column: Accordions */}
                    <div className="space-y-4">
                        {displayFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="glass-card overflow-hidden transition-all duration-300 hover:border-brand-primary/30"
                            >
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
                                >
                                    <span className="text-xl md:text-2xl font-display text-white tracking-tight pr-8">
                                        {faq.q}
                                    </span>
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-brand-primary border border-white/10">
                                        {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                        >
                                            <div className="px-6 pb-8 md:px-8 md:pb-10 pt-0 text-text-secondary text-lg leading-relaxed max-w-3xl">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
