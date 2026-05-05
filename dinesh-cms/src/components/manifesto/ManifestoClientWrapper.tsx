"use client";

import { motion } from "framer-motion";

import CinematicImage from "@/components/ui/CinematicImage";

interface ManifestoClientWrapperProps {
    sections: any[];
}

export default function ManifestoClientWrapper({ sections }: ManifestoClientWrapperProps) {
    return (
        <div className="space-y-48">
            {sections.map((principle, index) => (
                <div
                    key={index}
                    className={cn(
                        "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
                        index % 2 !== 0 && "lg:flex-row-reverse"
                    )}
                >
                    <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={cn(
                            "relative group",
                            index % 2 !== 0 && "lg:order-2"
                        )}
                    >
                        <h2 className="text-4xl font-display mb-8 text-white group-hover:text-brand-primary transition-colors duration-500 tracking-tight">
                            {principle.heading}
                        </h2>
                        <div className="glass-card border-l-2 border-brand-primary/30 p-10 md:p-14 pl-12 md:pl-16 relative overflow-hidden group-hover:border-brand-primary/50 transition-all duration-500">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
                            <p className="text-xl text-text-secondary leading-relaxed font-body">
                                {principle.body}
                            </p>
                            {principle.quote && (
                                <p className="mt-10 text-brand-primary italic text-lg opacity-80 border-t border-white/5 pt-8 inline-block">
                                    — {principle.quote}
                                </p>
                            )}
                        </div>
                    </motion.div>

                    <div className={cn(
                        "h-[400px] lg:h-[600px] rounded-3xl overflow-hidden",
                        index % 2 !== 0 && "lg:order-1"
                    )}>
                        <CinematicImage
                            src={`/images/manifesto_${index + 1}.png`}
                            alt={principle.heading || principle.title || `Manifesto section ${index + 1}`}
                            animationType="manifesto"
                            parallax
                            parallaxSpeed={0.15}
                            wrapperClassName="h-full"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}

