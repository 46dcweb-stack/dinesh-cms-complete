"use client";

import { motion } from "framer-motion";

export default function ManifestoCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-32 mb-32 relative overflow-hidden rounded-[2rem] border border-white/5 bg-brand-muted/30 p-10 md:p-24 text-center shadow-2xl max-w-6xl mx-auto"
        >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[80%] h-full bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.12)_0%,transparent_60%)] rounded-full -z-10 blur-3xl pointer-events-none" />

            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display mb-8 text-white tracking-tight">
                Will you build <br className="hidden md:block" />
                <span className="text-gradient italic">the future with us?</span>
            </h3>

            <p className="text-text-secondary mb-12 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                We are actively looking for visionary collaborators, strategic investors, and relentless system-builders who share our core principles and want to engineer the next decade of resilient technology.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button className="btn-premium px-12 py-4 text-sm md:text-base w-full sm:w-auto">
                    Join the Collective
                </button>
                <button className="btn-outline px-12 py-4 text-sm md:text-base w-full sm:w-auto bg-brand-dark/50">
                    Read the Vision Paper
                </button>
            </div>
        </motion.div>
    );
}
