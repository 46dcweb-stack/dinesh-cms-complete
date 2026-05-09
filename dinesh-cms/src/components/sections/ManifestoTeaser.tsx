"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function ManifestoTeaser() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <section ref={sectionRef} className="py-32 px-6 relative overflow-hidden bg-brand-dark">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/manifesto_bg.png"
                    alt=""
                    className="w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-linear-to-b from-brand-dark via-transparent to-brand-dark" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="glass-card p-12 md:p-20 relative overflow-hidden border-brand-primary/10">
                    {/* Gradient Background Effect */}
                    <div
                        className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.1)_0%,transparent_70%)] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl relative z-10"
                    >
                        <span className="text-brand-primary font-mono text-xs tracking-[0.4em] uppercase block mb-8">The Core Conviction</span>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-display leading-[1.1] mb-12 tracking-tight text-white italic text-highlight-sweep">
                            "I believe the best companies are built not just on ideas, but on conviction."
                        </h2>

                        <Link href="/manifesto" className="btn-premium group inline-flex liquid-fill">
                            Read My Manifesto <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
