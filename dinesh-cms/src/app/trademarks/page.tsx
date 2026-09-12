import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Check, X, ShieldCheck } from "lucide-react";
import StatusPill from "@/components/trademarks/StatusPill";
import MarkSpecimen from "@/components/trademarks/MarkSpecimen";
import RegisterGroups from "@/components/trademarks/RegisterGroups";
import FAQGrid from "@/components/sections/FAQGrid";
import { PageSchema, FaqSchema } from "@/components/seo/JsonLd";
import TrademarkListSchema from "@/components/trademarks/TrademarkListSchema";
import { getTrademarks, getTrademarkRefs, getTrademarkPageMeta } from "@/lib/firebase-data";
import { markSymbol, applicationLabel, classList, isRegistered } from "@/lib/trademarks";
import { absoluteUrl } from "@/lib/site";
import type { Trademark, Jurisdiction, Proprietor, TrademarkPageMeta } from "@/lib/types";

export const revalidate = 60;

// Every string on this page comes from the `trademarkPageMeta` document. There
// is no static copy to fall back to: what the register says is whatever the
// admin last saved, so editing it is never a code change.
export async function generateMetadata(): Promise<Metadata> {
  const meta = ((await getTrademarkPageMeta()) ?? {}) as TrademarkPageMeta;
  const title = meta.seoTitle ?? "";
  const description = meta.seoDescription ?? "";
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
  const p = (fbMeta ?? {}) as TrademarkPageMeta;
  const trademarks = marks as unknown as Trademark[];
  const jurisdictions = refs.jurisdictions as unknown as Jurisdiction[];
  const proprietors = refs.proprietors as unknown as Proprietor[];

  // Group by registry office, in jurisdiction sort order
  const groups = jurisdictions
    .map(j => ({ jurisdiction: j, marks: trademarks.filter(t => t.jurisdictionId === j.id) }))
    .filter(g => g.marks.length > 0);

  const primary = trademarks.find(t => t.isPrimary) ?? trademarks[0];
  const primaryOffice = primary
    ? jurisdictions.find(j => j.id === primary.jurisdictionId)
    : null;
  const faqs = p.pageFaqs ?? [];
  const t = (v?: string) => v ?? "";

  const registeredCount = trademarks.filter(t => isRegistered(t.status)).length;
  const lastUpdated = trademarks.map(t => t.statusUpdated).filter(Boolean).sort().pop();

  return (
    <div className="pt-40 lg:pt-44 pb-24 bg-brand-dark min-h-screen">
      <PageSchema name="Trademarks" description={t(p.seoDescription)} path="/trademarks" type="CollectionPage" />
      <TrademarkListSchema marks={trademarks} />
      <FaqSchema items={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} pageUrl={absoluteUrl("/trademarks")} />

      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Hero ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-12 lg:gap-16 items-start mb-20">
            <div>
              <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
                {t(p.eyebrow)}
              </span>
              <h1 className="text-4xl md:text-6xl font-display leading-[1.1] tracking-tight">
                {t(p.heading)} <span className="text-gradient italic">{t(p.headingItalic)}</span>
              </h1>
              <p className="text-text-secondary text-lg mt-8 max-w-2xl leading-relaxed">{t(p.lede)}</p>
              {p.lede2 && <p className="text-text-secondary text-lg mt-5 max-w-2xl leading-relaxed">{t(p.lede2)}</p>}

              {trademarks.length > 0 && (
                <div className="flex flex-wrap gap-10 mt-10 pt-8 border-t border-white/5">
                  <Stat value={String(trademarks.length)} label={t(p.statMarksLabel)} />
                  <Stat value={String(registeredCount)} label={t(p.statRegisteredLabel)} />
                  <Stat value={String(groups.length)} label={t(p.statOfficesLabel)} />
                </div>
              )}
            </div>

            {/* Certificate panel for the primary mark */}
            {primary && (
              <div className="glass-card p-7 relative">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono pb-4 mb-6 border-b border-white/10">
                  <ShieldCheck size={13} className="text-brand-primary" />
                  {t(p.primaryPanelLabel)}
                </div>

                <MarkSpecimen
                  name={primary.markName}
                  image={primary.markImage}
                  bg={primary.markImageBg}
                  className="w-full h-[110px] mb-6"
                  textClass="text-2xl"
                />

                <dl className="space-y-3 text-sm">
                  <Row label={t(p.labelMark)} value={`${primary.markName}${markSymbol(primary.status)}`} />
                  <Row label={t(p.labelType)} value={primary.markType} />
                  <Row label={t(p.labelNumber)} value={applicationLabel(primary)} />
                  <Row label={t(p.labelOffice)} value={primaryOffice?.officeShort ?? ""} />
                  <Row label={t(p.labelClasses)} value={classList(primary)} />
                </dl>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <StatusPill status={primary.status} />
                </div>
              </div>
            )}
          </div>

          {/* ── Why ──────────────────────────────────────────── */}
          <section className="mb-24 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{t(p.whyHeading)}</h2>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">{t(p.whyIntro)}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {(p.whyColumns ?? []).map((c: any, i: number) => (
                <div key={i} className="glass-card p-7 flex flex-col">
                  <span className="text-brand-primary/60 font-mono text-xs tracking-[0.25em] mb-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-xl font-display text-white mb-3">{c.heading}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{c.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── The register ─────────────────────────────────── */}
          <section className="mb-24 border-t border-white/5 pt-16" id="register">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{t(p.registerHeading)}</h2>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">{t(p.registerIntro)}</p>

            <RegisterGroups
              groups={groups}
              proprietors={proprietors}
              labels={{
                mark: t(p.colMark), proprietor: t(p.colProprietor), status: t(p.colStatus),
                application: t(p.colApplication), classes: t(p.colClasses),
                action: t(p.colAction), empty: t(p.registerEmpty),
                countOne: t(p.countOne), countMany: t(p.countMany),
              }}
            />

            <p className="mt-14 border-l-2 border-brand-primary/40 pl-5 py-4 text-text-secondary text-sm leading-relaxed max-w-4xl bg-white/[0.02] rounded-r-lg">
              {t(p.registerFootnote)}
            </p>
          </section>

          {/* ── Usage ────────────────────────────────────────── */}
          <section className="mb-24 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{t(p.usageHeading)}</h2>
            <p className="text-text-secondary text-base md:text-lg max-w-3xl leading-relaxed">{t(p.usageIntro)}</p>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 mt-12">
              <div className="glass-card p-8">
                <ul className="divide-y divide-white/5">
                  {(p.usageRules ?? []).map((r: any, i: number) => (
                    <li key={i} className="py-4 first:pt-0 last:pb-0 text-text-secondary text-sm leading-relaxed">
                      <strong className="text-white font-semibold">{r.lead}</strong> {r.body}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8 h-fit">
                <div className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono mb-6">{t(p.usageExamplesLabel)}</div>
                <div className="space-y-3">
                  {(p.usageCorrect ?? []).map((t: string, i: number) => (
                    <div key={`y${i}`} className="flex items-start gap-3">
                      <Check size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                      <code className="text-white text-sm font-mono break-words">{t}</code>
                    </div>
                  ))}
                </div>
                {(p.usageIncorrect ?? []).length > 0 && (
                  <div className="space-y-3 mt-6 pt-6 border-t border-white/5">
                    {(p.usageIncorrect ?? []).map((t: string, i: number) => (
                      <div key={`n${i}`} className="flex items-start gap-3">
                        <X size={15} className="text-text-muted shrink-0 mt-0.5" />
                        <code className="text-text-muted text-sm font-mono line-through break-words">{t}</code>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ── FAQ ──────────────────────────────────────────── */}
          {faqs.length > 0 && (
            <section className="mb-24 border-t border-white/5 pt-16">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-10">{t(p.faqHeading)}</h2>
              <FAQGrid questions={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} />
            </section>
          )}

          {/* ── Cross-site ───────────────────────────────────── */}
          {p.crossSiteHeading && (
            <section className="glass-card p-10 md:p-14 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-display text-white mb-3">{t(p.crossSiteHeading)}</h2>
                <p className="text-text-secondary text-base max-w-2xl leading-relaxed">{t(p.crossSiteBody)}</p>
              </div>
              {p.crossSiteUrl && (
                <Link href={t(p.crossSiteUrl)} target="_blank" rel="noopener noreferrer"
                  className="btn-outline inline-flex gap-3 shrink-0">
                  {t(p.crossSiteCta)}
                  <ExternalLink size={16} />
                </Link>
              )}
            </section>
          )}

          {lastUpdated && (
            <p className="text-text-muted text-[11px] font-mono uppercase tracking-[0.2em] mt-12 text-center">
              {t(p.lastUpdatedLabel)} {new Date(lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-display text-white leading-none">{value}</div>
      <div className="text-text-muted text-[10px] font-mono uppercase tracking-[0.2em] mt-2">{label}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-text-muted text-xs shrink-0">{label}</dt>
      <dd className="text-white font-medium font-mono text-right text-xs break-words">{value}</dd>
    </div>
  );
}
