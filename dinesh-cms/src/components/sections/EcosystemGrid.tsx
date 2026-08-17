"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import type { Venture } from "@/lib/types";

export type EcosystemVenture = Pick<Venture, "name" | "role" | "description" | "image" | "color"> & {
  id?: string;
  url?: string;
  status?: string;
  featured?: boolean;
  sortOrder?: number;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  "active":      { label: "Active",      color: "text-green-400 bg-green-400/10 border-green-400/20",             dot: "bg-green-400" },
  "pre-launch":  { label: "Pre Launch",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20",                dot: "bg-blue-400" },
  "coming-soon": { label: "Coming Soon", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",          dot: "bg-yellow-400" },
  "building":    { label: "Building",    color: "text-brand-primary bg-brand-primary/10 border-brand-primary/20", dot: "bg-brand-primary animate-pulse" },
  "inactive":    { label: "Inactive",    color: "text-white/30 bg-white/5 border-white/10",                       dot: "bg-white/30" },
};

const ALL_LABEL = "All";

export default function EcosystemGrid({ ventures }: { ventures: EcosystemVenture[] }) {
  const [activeFilter, setActiveFilter] = useState<string>(ALL_LABEL);

  // Only offer filters for statuses that actually exist in the data
  const filters = useMemo(() => {
    const present = Object.keys(STATUS_CONFIG).filter(
      key => key !== "inactive" && ventures.some(v => v.status === key)
    );
    return present.length > 1 ? [ALL_LABEL, ...present] : [];
  }, [ventures]);

  const visible = activeFilter === ALL_LABEL
    ? ventures
    : ventures.filter(v => v.status === activeFilter);

  if (ventures.length === 0) {
    return (
      <div className="py-24 text-center text-text-secondary text-sm font-mono">
        No ventures published yet.
      </div>
    );
  }

  return (
    <div>
      {/* ── Status Filter ────────────────────────────────────────── */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-14">
          {filters.map(key => {
            const label = key === ALL_LABEL ? ALL_LABEL : STATUS_CONFIG[key].label;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-5 py-2 rounded-full text-xs font-mono uppercase tracking-[0.2em] border transition-all duration-200
                  ${activeFilter === key
                    ? "bg-brand-primary border-brand-primary text-white"
                    : "bg-white/5 border-white/10 text-text-secondary hover:border-brand-primary/40 hover:text-white"
                  }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Venture Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visible.map((venture, index) => (
          <VentureCard key={venture.id ?? venture.name} venture={venture} index={index} />
        ))}
      </div>
    </div>
  );
}

function VentureCard({ venture, index }: { venture: EcosystemVenture; index: number }) {
  const statusCfg = venture.status ? STATUS_CONFIG[venture.status] : null;
  const accent = venture.color || "#FF5A00";

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06 }}
      className="glass-card relative overflow-hidden group flex flex-col h-full"
    >
      <GlowingEffect spread={40} glow disabled={false} proximity={72} inactiveZone={0.01} borderWidth={2} />

      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 opacity-20 z-10" style={{ backgroundColor: accent }} />
        <Image
          src={venture.image || "/gallery/venture-3.png"}
          alt={venture.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 z-20 bg-linear-to-t from-brand-dark via-brand-dark/30 to-transparent" />
        {statusCfg && (
          <div className={`absolute top-5 left-5 z-30 inline-flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em] ${statusCfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
            {statusCfg.label}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="relative z-10 p-8 flex flex-col grow border-t-2" style={{ borderTopColor: accent }}>
        {venture.role && (
          <span className="font-mono text-[10px] font-bold tracking-[0.3em] uppercase mb-3" style={{ color: accent }}>
            {venture.role}
          </span>
        )}
        <h3 className="text-3xl md:text-4xl font-display text-white mb-4 group-hover:text-brand-primary transition-colors">
          {venture.name}
        </h3>
        <p className="text-text-secondary text-base leading-relaxed mb-8 grow">
          {venture.description}
        </p>
        {venture.url && (
          <Link
            href={venture.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 self-start py-3 px-6 border border-white/10 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all group/btn"
          >
            <span className="text-xs font-bold uppercase tracking-[0.2em]">Visit Venture</span>
            <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}
