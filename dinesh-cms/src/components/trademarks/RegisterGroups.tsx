"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import MarkSpecimen from "./MarkSpecimen";
import StatusPill from "./StatusPill";
import { markSymbol, applicationLabel, classList } from "@/lib/trademarks";
import type { Trademark, Jurisdiction, Proprietor } from "@/lib/types";

export type RegisterGroup = {
  jurisdiction: Jurisdiction;
  marks: Trademark[];
};

// The register, grouped by registry office. Each mark is a card rather than a
// table row: the old row put the status pill, the application number and the
// class list on one line, and the pill overlapped the number as soon as a
// status was long ("Formalities check passed") or a number was a range.
export default function RegisterGroups({
  groups,
  proprietors,
  emptyLabel,
}: {
  groups: RegisterGroup[];
  proprietors: Proprietor[];
  emptyLabel: string;
}) {
  const propById = new Map(proprietors.map(p => [p.id!, p]));

  if (groups.length === 0) {
    return <p className="text-text-muted text-sm font-mono mt-12">{emptyLabel}</p>;
  }

  return (
    <div className="mt-14 space-y-16">
      {groups.map(({ jurisdiction, marks }) => (
        <div key={jurisdiction.id}>
          {/* Office header */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-4 mb-8 border-b border-white/10">
            <span className="w-1.5 h-7 rounded-full bg-brand-primary/70 shrink-0" />
            <h3 className="text-2xl md:text-3xl font-display text-white">{jurisdiction.countryName}</h3>
            {jurisdiction.officeName && (
              <span className="text-text-muted text-xs font-mono uppercase tracking-[0.15em]">
                {jurisdiction.officeName}
              </span>
            )}
            <span className="sm:ml-auto text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] border border-white/10 rounded-full px-3 py-1">
              {marks.length} {marks.length === 1 ? "mark" : "marks"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {marks.map((m, i) => (
              <MarkCard
                key={m.id ?? m.slug}
                mark={m}
                index={i}
                ownerName={propById.get(m.proprietorId)?.legalName}
                officeShort={jurisdiction.officeShort}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MarkCard({
  mark, index, ownerName, officeShort,
}: {
  mark: Trademark;
  index: number;
  ownerName?: string;
  officeShort?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.05 }}
    >
      <Link
        href={`/trademarks/${mark.slug}`}
        className="glass-card relative overflow-hidden group flex flex-col h-full p-6"
      >
        <GlowingEffect spread={40} glow disabled={false} proximity={72} inactiveZone={0.01} borderWidth={2} />

        {/* Specimen */}
        <div className="relative">
          <MarkSpecimen
            name={mark.markName}
            image={mark.markImage}
            bg={mark.markImageBg}
            className="w-full h-[120px]"
            textClass="text-2xl"
          />
          {officeShort && (
            <span className="absolute top-3 right-3 text-[9px] font-mono uppercase tracking-[0.2em] text-text-muted bg-brand-dark/70 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
              {officeShort}
            </span>
          )}
        </div>

        {/* Identity */}
        <div className="mt-6">
          <div className="flex items-baseline gap-1">
            <h4 className="text-2xl font-display text-white group-hover:text-brand-primary transition-colors leading-none">
              {mark.markName}
            </h4>
            <sup className="text-text-muted text-[11px] font-mono">{markSymbol(mark.status)}</sup>
          </div>
          <div className="text-text-muted text-xs mt-2">{mark.markType}</div>
          {ownerName && (
            <div className="text-text-muted text-[10px] font-mono uppercase tracking-[0.15em] mt-3 leading-relaxed">
              {ownerName}
            </div>
          )}
        </div>

        {/* Particulars — own rows, so a long status can never collide with a number */}
        <dl className="grid grid-cols-2 gap-x-4 gap-y-4 mt-6 pt-5 border-t border-white/5">
          <div>
            <dt className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono mb-1.5">Application</dt>
            <dd className="text-white text-sm font-mono break-words">{applicationLabel(mark) || "—"}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono mb-1.5">Classes</dt>
            <dd className="text-white text-sm font-mono break-words">{classList(mark) || "—"}</dd>
          </div>
        </dl>

        {/* Status + action */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-6">
          <StatusPill status={mark.status} />
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-text-secondary group-hover:text-brand-primary transition-colors">
            View record
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
