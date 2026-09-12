import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Check, X } from "lucide-react";
import MarkSpecimen from "@/components/trademarks/MarkSpecimen";
import StatusPill from "@/components/trademarks/StatusPill";
import FAQGrid from "@/components/sections/FAQGrid";
import { PageSchema, FaqSchema } from "@/components/seo/JsonLd";
import TrademarkListSchema from "@/components/trademarks/TrademarkListSchema";
import { getTrademarks, getTrademarkRefs, getTrademarkPageMeta } from "@/lib/firebase-data";
import { TRADEMARK_PAGE_DEFAULTS as D } from "@/lib/trademark-defaults";
import { markSymbol, applicationLabel, classList } from "@/lib/trademarks";
import type { Trademark, Jurisdiction, Proprietor } from "@/lib/types";
import { fbStr, fbArr } from "@/lib/fallback";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const meta = (await getTrademarkPageMeta()) as any;
  const title = fbStr(meta?.seoTitle, D.seoTitle!);
  const description = fbStr(meta?.seoDescription, D.seoDescription!);
  return {
    title, description,
    alternates: { canonical: "/trademarks" },
    openGraph: { title, description, url: "/trademarks", type: "website" },
  };
}

export default async function TrademarksPage() {
  const [marks, refs, fbMeta] = await Promise.all([
    getTrademarks(), getTrademarkRefs(), getTrademarkPageMeta(),
  ]);
  const meta = (fbMeta ?? {}) as any;
  const trademarks = marks as unknown as Trademark[];
  const jurisdictions = refs.jurisdictions as unknown as Jurisdiction[];
  const proprietors = refs.proprietors as unknown as Proprietor[];

  const propById = new Map(proprietors.map(p => [p.id!, p]));

  // Group by registry office, in jurisdiction sort order
  const groups = jurisdictions
    .map(j => ({ jurisdiction: j, marks: trademarks.filter(t => t.jurisdictionId === j.id) }))
    .filter(g => g.marks.length > 0);

  const primary = trademarks.find(t => t.isPrimary) ?? trademarks[0];
  const faqs = fbArr(meta.pageFaqs, D.pageFaqs!);
  const p = {
    eyebrow: fbStr(meta.eyebrow, D.eyebrow!),
    heading: fbStr(meta.heading, D.heading!),
    headingItalic: fbStr(meta.headingItalic, D.headingItalic!),
    lede: fbStr(meta.lede, D.lede!),
    lede2: fbStr(meta.lede2, D.lede2!),
    whyHeading: fbStr(meta.whyHeading, D.whyHeading!),
    whyIntro: fbStr(meta.whyIntro, D.whyIntro!),
    whyColumns: fbArr(meta.whyColumns, D.whyColumns!),
    registerHeading: fbStr(meta.registerHeading, D.registerHeading!),
    registerIntro: fbStr(meta.registerIntro, D.registerIntro!),
    registerFootnote: fbStr(meta.registerFootnote, D.registerFootnote!),
    usageHeading: fbStr(meta.usageHeading, D.usageHeading!),
    usageIntro: fbStr(meta.usageIntro, D.usageIntro!),
    usageRules: fbArr(meta.usageRules, D.usageRules!),
    usageCorrect: fbArr(meta.usageCorrect, D.usageCorrect!),
    usageIncorrect: fbArr(meta.usageIncorrect, D.usageIncorrect!),
    crossSiteHeading: fbStr(meta.crossSiteHeading, D.crossSiteHeading!),
    crossSiteBody: fbStr(meta.crossSiteBody, D.crossSiteBody!),
    crossSiteUrl: fbStr(meta.crossSiteUrl, D.crossSiteUrl!),
  };

  const lastUpdated = trademarks
    .map(t => t.statusUpdated).filter(Boolean).sort().pop();

  return (
    <div className="pt-40 lg:pt-44 pb-24 bg-brand-dark min-h-screen">
      <PageSchema name="Trademarks" description={fbStr(meta.seoDescription, D.seoDescription!)} path="/trademarks" type="CollectionPage" />
      <TrademarkListSchema marks={trademarks} />
      <FaqSchema items={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} pageUrl="https://www.46dc.com/trademarks" />

      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Hero ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-12 lg:gap-16 items-start mb-24">
            <div>
              <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
                {p.eyebrow}
              </span>
              <h1 className="text-4xl md:text-6xl font-display leading-[1.1] tracking-tight">
                {p.heading} <span className="text-gradient italic">{p.headingItalic}</span>
              </h1>
              <p className="text-text-secondary text-lg mt-8 max-w-2xl leading-relaxed">{p.lede}</p>
              {p.lede2 && <p className="text-text-secondary text-lg mt-5 max-w-2xl leading-relaxed">{p.lede2}</p>}
            </div>

            {/* Certificate panel for the primary mark */}
            {primary && (
              <div className="glass-card p-7 relative">
                <div className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono pb-4 mb-5 border-b border-white/10">
                  Primary mark
                </div>
                <dl className="space-y-3 text-sm">
                  <Row label="Mark" value={`${primary.markName}${markSymbol(primary.status)}`} />
                  <Row label="Type" value={primary.markType} />
                  <Row label="Number" value={applicationLabel(primary)} />
                  <Row label="Office" value={jurisdictions.find(j => j.id === primary.jurisdictionId)?.officeShort ?? ""} />
                  <Row label="Classes" value={classList(primary)} />
                  <Row label="Status" value={primary.status} />
                </dl>
              </div>
            )}
          </div>

          {/* ── Why ──────────────────────────────────────────── */}
          <section className="mb-24 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{p.whyHeading}</h2>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">{p.whyIntro}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12">
              {p.whyColumns.map((c: any, i: number) => (
                <div key={i}>
                  <h3 className="text-xl font-display text-white mb-3">{c.heading}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── The register ─────────────────────────────────── */}
          <section className="mb-24 border-t border-white/5 pt-16" id="register">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{p.registerHeading}</h2>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">{p.registerIntro}</p>

            {groups.length === 0 && (
              <p className="text-text-muted text-sm font-mono mt-12">No marks published yet.</p>
            )}

            {groups.map(({ jurisdiction, marks: rows }) => (
              <div key={jurisdiction.id} className="mt-14">
                <div className="flex flex-wrap items-baseline gap-4 pb-3 border-b-2 border-white/15">
                  <h3 className="text-2xl font-display text-white">{jurisdiction.countryName}</h3>
                  <span className="text-text-muted text-xs font-mono">{jurisdiction.officeName}</span>
                  <span className="ml-auto text-text-muted text-xs font-mono">
                    {rows.length} {rows.length === 1 ? "mark" : "marks"}
                  </span>
                </div>

                <ul className="divide-y divide-white/5">
                  {rows.map(m => {
                    const owner = propById.get(m.proprietorId);
                    return (
                      <li key={m.id} className="py-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-5">
                          <MarkSpecimen
                            name={m.markName}
                            image={m.markImage}
                            bg={m.markImageBg}
                            className="w-[110px] h-[70px] shrink-0"
                            textClass="text-sm"
                          />

                          <div className="flex-1 min-w-0">
                            <Link href={`/trademarks/${m.slug}`} className="group inline-flex items-baseline gap-1">
                              <span className="text-xl md:text-2xl font-display text-white group-hover:text-brand-primary transition-colors">
                                {m.markName}
                              </span>
                              <sup className="text-text-muted text-[11px] font-mono">{markSymbol(m.status)}</sup>
                            </Link>
                            <div className="text-text-muted text-xs mt-1">{m.markType}</div>
                            {owner && (
                              <div className="text-text-muted text-[11px] font-mono mt-2 pt-2 border-t border-white/5 inline-block uppercase tracking-wider">
                                {owner.legalName}
                              </div>
                            )}
                          </div>

                          <div className="md:w-40"><StatusPill status={m.status} /></div>

                          <div className="md:w-44">
                            <div className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1">Application</div>
                            <div className="text-white text-sm font-mono">{applicationLabel(m)}</div>
                          </div>

                          <div className="md:w-32">
                            <div className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1">Classes</div>
                            <div className="text-white text-sm font-mono">{classList(m)}</div>
                          </div>

                          <Link href={`/trademarks/${m.slug}`}
                            className="inline-flex items-center gap-2 self-start md:self-auto py-2.5 px-5 border border-white/10 rounded-full hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all shrink-0 group/btn">
                            <span className="text-[11px] font-bold uppercase tracking-[0.15em]">View record</span>
                            <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <p className="mt-10 border-l-2 border-brand-primary/40 pl-5 py-3 text-text-secondary text-sm leading-relaxed max-w-4xl bg-white/[0.02]">
              {p.registerFootnote}
            </p>
          </section>

          {/* ── Usage ────────────────────────────────────────── */}
          <section className="mb-24 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{p.usageHeading}</h2>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">{p.usageIntro}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
              <ul className="divide-y divide-white/5 border-t border-white/5">
                {p.usageRules.map((r: any, i: number) => (
                  <li key={i} className="py-4 text-text-secondary text-sm leading-relaxed">
                    <strong className="text-white font-semibold">{r.lead}</strong> {r.body}
                  </li>
                ))}
              </ul>

              <div className="glass-card p-7 h-fit">
                <div className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono mb-5">In running text</div>
                {p.usageCorrect.map((t: string, i: number) => (
                  <div key={`y${i}`} className="flex items-start gap-3 py-2">
                    <Check size={15} className="text-emerald-400 shrink-0 mt-1" />
                    <code className="text-white text-sm font-mono">{t}</code>
                  </div>
                ))}
                {p.usageIncorrect.map((t: string, i: number) => (
                  <div key={`n${i}`} className="flex items-start gap-3 py-2">
                    <X size={15} className="text-text-muted shrink-0 mt-1" />
                    <code className="text-text-muted text-sm font-mono line-through">{t}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────── */}
          {faqs.length > 0 && (
            <section className="mb-24 border-t border-white/5 pt-16">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-10">Questions I get asked</h2>
              <FAQGrid questions={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} />
            </section>
          )}

          {/* ── Cross-site ───────────────────────────────────── */}
          {p.crossSiteHeading && (
            <section className="glass-card p-10 md:p-14 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-display text-white mb-3">{p.crossSiteHeading}</h2>
                <p className="text-text-secondary text-base max-w-2xl leading-relaxed">{p.crossSiteBody}</p>
              </div>
              {p.crossSiteUrl && (
                <Link href={p.crossSiteUrl} target="_blank" rel="noopener noreferrer"
                  className="btn-outline inline-flex gap-3 shrink-0">
                  Open the company register
                  <ExternalLink size={16} />
                </Link>
              )}
            </section>
          )}

          {lastUpdated && (
            <p className="text-text-muted text-[11px] font-mono uppercase tracking-[0.2em] mt-12 text-center">
              Register last updated {new Date(lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-text-muted text-xs">{label}</dt>
      <dd className="text-white font-medium font-mono text-right text-xs">{value}</dd>
    </div>
  );
}
