"use client";

import { motion } from "framer-motion";
import { InteractiveGlobe } from "@/components/ui/interactive-globe";

interface ManifestoHeaderProps {
    eyebrow?: string;
    introLabel?: string;
    title: string;
    subtitle: string;
    versionTag?: string;
    introStats?: { label: string; value: string }[];
    globeMarkers?: { lat: number; lng: number; label: string }[];
    globeConnections?: { from: [number, number]; to: [number, number] }[];
}

export default function ManifestoHeader({ title, subtitle, eyebrow, introLabel, versionTag, introStats, globeMarkers, globeConnections }: ManifestoHeaderProps) {
    const stats = introStats?.length
        ? introStats
        : [
              { value: "Global", label: "Impact" },
              { value: "Infinite", label: "Vision" },
              { value: "100%", label: "Resilience" }
          ];

    return (
        <div className="relative pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden flex items-center justify-center border-b border-white/5 mx-[-1.5rem] lg:mx-[-3rem] px-6 lg:px-12 -mt-20">
            <div className="w-full max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between min-h-[500px]">

                {/* Left content */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex-1 flex flex-col justify-center py-10 md:py-0 relative z-10 max-w-2xl text-left"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-zinc-400 mb-8 w-fit shadow-sm relative z-20">
                        <span className="size-1.5 rounded-full bg-[#FF5A00] animate-pulse" />
                        {introLabel || "Infrastructure for the future"}
                    </div>

                    {eyebrow && (
                        <span className="text-brand-primary font-medium tracking-[0.3em] text-[10px] uppercase block mb-5 font-mono">
                            {eyebrow}
                        </span>
                    )}

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-6 font-display relative z-10">
                        {title}
                    </h1>

                    <p className="text-base md:text-lg text-text-secondary max-w-lg leading-relaxed mb-12 relative z-10">
                        {subtitle}
                    </p>

                    <div className="flex flex-wrap items-center gap-6 relative z-10">
                        {stats.map((stat, index) => (
                            <div key={`${stat.label}-${index}`} className="flex items-center gap-6">
                                <div>
                                    <p className="text-2xl lg:text-3xl font-bold text-white mb-1 font-display">{stat.value}</p>
                                    <p className="text-xs lg:text-sm text-zinc-500 font-medium">{stat.label}</p>
                                </div>
                                {index < stats.length - 1 && <div className="w-px h-10 bg-white/10" />}
                            </div>
                        ))}
                    </div>

                    {versionTag && (
                        <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-zinc-400">
                            Version {versionTag}
                        </div>
                    )}
                </motion.div>

                {/* Right — Globe */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="flex-1 flex items-center justify-center md:justify-end mt-16 md:mt-0 min-h-[400px] lg:min-h-[500px]"
                >
                    <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center mix-blend-screen">
                        {/* Subtle ambient glow behind globe matching brand theme */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.15)_0%,transparent_60%)] rounded-full -z-10 pointer-events-none" />

                        <InteractiveGlobe
                            size="100%"
                            autoRotateSpeed={0.002}
                            dotColor="rgba(255, 90, 0, ALPHA)"
                            arcColor="rgba(255, 90, 0, 0.4)"
                            markerColor="rgba(255, 42, 0, 1)"
                            markers={globeMarkers && globeMarkers.length > 0 ? globeMarkers : undefined}
                            connections={globeConnections && globeConnections.length > 0 ? globeConnections : undefined}
                        />
                    </div>
                </motion.div>

            </div>
        </div>
    );
}