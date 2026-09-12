import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import MarkSpecimen from "./MarkSpecimen";
import StatusPill from "./StatusPill";
import { markSymbol, applicationLabel, classList } from "@/lib/trademarks";
import type { Trademark, Jurisdiction, Proprietor } from "@/lib/types";

export type RegisterGroup = {
  jurisdiction: Jurisdiction;
  marks: Trademark[];
};

export type RegisterLabels = {
  mark: string;
  proprietor: string;
  status: string;
  application: string;
  classes: string;
  action: string;
  empty: string;
  /** Singular and plural for the per-office count, e.g. "mark" / "marks". */
  countOne: string;
  countMany: string;
};

// The register, grouped by registry office.
//
// Two renderings of the same rows: a real table from `lg` up, and stacked rows
// below it. The earlier single-row flex layout gave each column a fixed width,
// so a long status ("Formalities check passed") or a number range overlapped
// its neighbour. A table lets the browser size the columns against the actual
// content instead, and `whitespace-nowrap` on the numeric columns keeps them
// from breaking mid-number.
//
// Server-rendered: nothing here is interactive, so it costs no client JS and
// every row is in the HTML a crawler sees.
export default function RegisterGroups({
  groups, proprietors, labels,
}: {
  groups: RegisterGroup[];
  proprietors: Proprietor[];
  labels: RegisterLabels;
}) {
  const propById = new Map(proprietors.map(p => [p.id!, p]));

  if (groups.length === 0) {
    return <p className="text-text-muted text-sm font-mono mt-12">{labels.empty}</p>;
  }

  return (
    <div className="mt-14 space-y-16">
      {groups.map(({ jurisdiction, marks }) => (
        <section key={jurisdiction.id}>
          {/* Office header */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pb-4 mb-2 border-b border-white/10">
            <span className="w-1.5 h-7 rounded-full bg-brand-primary/70 shrink-0" />
            <h3 className="text-2xl md:text-3xl font-display text-white">{jurisdiction.countryName}</h3>
            {jurisdiction.officeName && (
              <span className="text-text-muted text-xs font-mono uppercase tracking-[0.15em]">
                {jurisdiction.officeName}
              </span>
            )}
            <span className="sm:ml-auto text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] border border-white/10 rounded-full px-3 py-1">
              {marks.length} {marks.length === 1 ? labels.countOne : labels.countMany}
            </span>
          </div>

          {/* ── Table (lg and up) ───────────────────────────── */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <Th className="w-[30%]">{labels.mark}</Th>
                  <Th>{labels.proprietor}</Th>
                  <Th>{labels.status}</Th>
                  <Th>{labels.application}</Th>
                  <Th>{labels.classes}</Th>
                  <Th className="text-right">{labels.action}</Th>
                </tr>
              </thead>
              <tbody>
                {marks.map(m => (
                  <tr key={m.id ?? m.slug} className="group border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 pr-6 align-middle">
                      <div className="flex items-center gap-4">
                        <MarkSpecimen
                          name={m.markName} image={m.markImage} bg={m.markImageBg}
                          className="w-[86px] h-[56px] shrink-0" textClass="text-[13px]"
                        />
                        <div className="min-w-0">
                          <Link href={`/trademarks/${m.slug}`} className="inline-flex items-baseline gap-1">
                            <span className="text-xl font-display text-white group-hover:text-brand-primary transition-colors">
                              {m.markName}
                            </span>
                            <sup className="text-text-muted text-[10px] font-mono">{markSymbol(m.status)}</sup>
                          </Link>
                          <div className="text-text-muted text-xs mt-0.5">{m.markType}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 pr-6 align-middle">
                      <span className="text-text-muted text-[10px] font-mono uppercase tracking-[0.12em] leading-snug block max-w-[190px]">
                        {propById.get(m.proprietorId)?.legalName ?? "—"}
                      </span>
                    </td>
                    <td className="py-5 pr-6 align-middle"><StatusPill status={m.status} /></td>
                    <td className="py-5 pr-6 align-middle whitespace-nowrap text-white text-sm font-mono">
                      {applicationLabel(m) || "—"}
                    </td>
                    <td className="py-5 pr-6 align-middle whitespace-nowrap text-white text-sm font-mono">
                      {classList(m) || "—"}
                    </td>
                    <td className="py-5 align-middle text-right">
                      <Link href={`/trademarks/${m.slug}`}
                        className="inline-flex items-center gap-2 py-2.5 px-5 border border-white/10 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all whitespace-nowrap">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{labels.action}</span>
                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Stacked rows (below lg) ─────────────────────── */}
          <ul className="lg:hidden divide-y divide-white/5">
            {marks.map(m => (
              <li key={m.id ?? m.slug} className="py-6">
                <div className="flex items-start gap-4">
                  <MarkSpecimen
                    name={m.markName} image={m.markImage} bg={m.markImageBg}
                    className="w-[76px] h-[52px] shrink-0" textClass="text-[12px]"
                  />
                  <div className="min-w-0 flex-1">
                    <Link href={`/trademarks/${m.slug}`} className="inline-flex items-baseline gap-1">
                      <span className="text-xl font-display text-white">{m.markName}</span>
                      <sup className="text-text-muted text-[10px] font-mono">{markSymbol(m.status)}</sup>
                    </Link>
                    <div className="text-text-muted text-xs mt-0.5">{m.markType}</div>
                    <div className="mt-3"><StatusPill status={m.status} /></div>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 mt-5">
                  <Cell label={labels.application} value={applicationLabel(m) || "—"} />
                  <Cell label={labels.classes} value={classList(m) || "—"} />
                  <div className="col-span-2">
                    <Cell label={labels.proprietor} value={propById.get(m.proprietorId)?.legalName ?? "—"} />
                  </div>
                </dl>

                <Link href={`/trademarks/${m.slug}`}
                  className="inline-flex items-center gap-2 mt-5 py-2.5 px-5 border border-white/10 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{labels.action}</span>
                  <ArrowUpRight size={13} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`py-3 pr-6 text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono font-normal ${className}`}>
      {children}
    </th>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[9px] uppercase tracking-[0.2em] text-text-muted font-mono mb-1.5">{label}</dt>
      <dd className="text-white text-sm font-mono break-words">{value}</dd>
    </div>
  );
}
