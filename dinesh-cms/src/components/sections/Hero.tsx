"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-brand-gold/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-brand-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="inline-block text-brand-gold font-medium tracking-[0.2em] uppercase text-sm mb-6">
                        Visionary Entrepreneur • Founder • Leader
                    </span>
                    <h1 className="text-5xl md:text-8xl font-display font-medium text-white mb-8 leading-[1.1]">
                        Transforming <span className="text-brand-gold underline decoration-brand-gold/20 underline-offset-8">Ideas</span> Into Impactful <span className="italic">Ventures.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-loose">
                        Empowering the next generation of founders to build resilient systems
                        and visionary companies that define the future of technology and society.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link href="/about" className="btn-premium group">
                            Read My Story
                            <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                        <Link href="/manifesto" className="btn-outline">
                            The Manifesto
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
                    <motion.div
                        animate={{ y: [0, 48] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold"
                    />
                </div>
            </motion.div>
        </section>
    );
}
