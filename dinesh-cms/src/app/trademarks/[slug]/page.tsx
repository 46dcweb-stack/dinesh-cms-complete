import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, ChevronRight, Check, X } from "lucide-react";
import MarkSpecimen from "@/components/trademarks/MarkSpecimen";
import StatusPill from "@/components/trademarks/StatusPill";
import TrademarkSchema from "@/components/trademarks/TrademarkSchema";
import FAQGrid from "@/components/sections/FAQGrid";
import { BreadcrumbSchema, FaqSchema } from "@/components/seo/JsonLd";
import { getTrademarks, getTrademarkRefs, getTrademarkPageMeta } from "@/lib/firebase-data";
import {
  markSymbol, applicationLabel, classList, numberForClass,
  verifyLink, buildTimeline, formatMarkDate,
} from "@/lib/trademarks";
import { TRADEMARK_PAGE_DEFAULTS as D } from "@/lib/trademark-defaults";
import { absoluteUrl } from "@/lib/site";
import { fbStr } from "@/lib/fallback";
import type { Trademark, Jurisdiction, Proprietor } from "@/lib/types";

export const revalidate = 60;

async function load(slug: string) {
  const [marks, refs, pageMeta] = await Promise.all([
    getTrademarks(), getTrademarkRefs(), getTrademarkPageMeta(),
  ]);
  const all = marks as unknown as Trademark[];
  const mark = all.find(m => m.slug === slug) ?? null;
  const jurisdictions = refs.jurisdictions as unknown as Jurisdiction[];
  const proprietors = refs.proprietors as unknown as Proprietor[];
  return {
    mark, all,
    meta: (pageMeta ?? {}) as any,
    jurisdiction: mark ? jurisdictions.find(j => j.id === mark.jurisdictionId) ?? null : null,
    proprietor: mark ? proprietors.find(p => p.id === mark.proprietorId) ?? null : null,
  };
}

export async function generateStaticParams() {
  const marks = (await getTrademarks()) as unknown as Trademark[];
  return marks.filter(m => m.slug).map(m => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { mark, jurisdiction } = await load(slug);
  if (!mark) return {};
  const sym = markSymbol(mark.status);
  // Sub-page title pattern: {mark}{symbol} Trademark — {jurisdiction} — {site}
  const title = mark.seoTitle
    || `${mark.markName}${sym} Trademark — ${jurisdiction?.countryName ?? ""} — 46DC`.replace(/\s+—\s+—/, " —");
  const description = mark.seoDescription
    || mark.summary
    || `${mark.markType} for ${mark.markName}, filed in ${jurisdiction?.countryName ?? ""} in Classes ${classList(mark)}. Application ${applicationLabel(mark)}.`;
  return {
    title, description,
    alternates: { canonical: `/trademarks/${mark.slug}` },
    openGraph: {
      title, description, url: `/trademarks/${mark.slug}`, type: "article",
      ...(mark.ogImage || mark.markImage ? { images: [{ url: (mark.ogImage || mark.markImage)! }] } : {}),
    },
  };
}

export default async function TrademarkDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { mark, all, meta, jurisdiction, proprietor } = await load(slug);
  if (!mark) notFound();

  // Section headings are shared by every mark page and come from the CMS
  // (Trademarks → Page settings → Mark page labels).
  const L = {
    story:        fbStr(meta.markStoryHeading, D.markStoryHeading!),
    classes:      fbStr(meta.markClassesHeading, D.markClassesHeading!),
    classesIntro: fbStr(meta.markClassesIntro, D.markClassesIntro!),
    timeline:     fbStr(meta.markTimelineHeading, D.markTimelineHeading!),
    timelineIntro:fbStr(meta.markTimelineIntro, D.markTimelineIntro!),
    usage:        fbStr(meta.markUsageHeading, D.markUsageHeading!),
    verify:       fbStr(meta.markVerifyHeading, D.markVerifyHeading!),
    verifyIntro:  fbStr(meta.markVerifyIntro, D.markVerifyIntro!),
    related:      fbStr(meta.markRelatedHeading, D.markRelatedHeading!),
    faq:          fbStr(meta.markFaqHeading, D.markFaqHeading!),
    wordNote:     fbStr(meta.wordMarkNote, D.wordMarkNote!),
    deviceNote:   fbStr(meta.deviceMarkNote, D.deviceMarkNote!),
    specFallback: fbStr(meta.specificationFallback, D.specificationFallback!),
    verifyRegisterTitle:   fbStr(meta.verifyRegisterTitle, D.verifyRegisterTitle!),
    verifyRegisterBody:    fbStr(meta.verifyRegisterBody, D.verifyRegisterBody!),
    verifyVentureTitle:    fbStr(meta.verifyVentureTitle, D.verifyVentureTitle!),
    verifyVentureBody:     fbStr(meta.verifyVentureBody, D.verifyVentureBody!),
    verifyProprietorTitle: fbStr(meta.verifyProprietorTitle, D.verifyProprietorTitle!),
    verifyProprietorBody:  fbStr(meta.verifyProprietorBody, D.verifyProprietorBody!),
    manualSearchNote:      fbStr(meta.manualSearchNote, D.manualSearchNote!),
  };

  // CMS copy carries {office} / {venture} / {proprietor} / {number} placeholders
  // so the editor never has to repeat a name that already lives on the record.
  const fill = (tpl: string, vars: Record<string, string>) =>
    tpl.replace(/\{(office|venture|proprietor|number)\}/g, (_, k) => vars[k] ?? "");

  const sym = markSymbol(mark.status);
  const verify = verifyLink(mark, jurisdiction);
  const timeline = buildTimeline(mark, jurisdiction?.countryCode);
  const related = all.filter(m => m.id !== mark.id).slice(0, 3);
  const isDevice = /Device|Combined/.test(mark.markType);
  const faqs = mark.faqs ?? [];

  return (
    <div className="pt-40 lg:pt-44 pb-24 bg-brand-dark min-h-screen">
      <TrademarkSchema mark={mark} jurisdiction={jurisdiction} proprietor={proprietor} />
      <BreadcrumbSchema items={[
        { name: "Home", url: absoluteUrl("/") },
        { name: "Trademarks", url: absoluteUrl("/trademarks") },
        { name: mark.markName, url: absoluteUrl(`/trademarks/${mark.slug}`) },
      ]} />
      <FaqSchema items={faqs.map(f => ({ q: f.question, a: f.answer }))}
        pageUrl={absoluteUrl(`/trademarks/${mark.slug}`)} />

      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          <nav className="flex items-center gap-2 text-xs font-mono text-text-muted mb-10">
            <Link href="/" className="hover:text-brand-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/trademarks" className="hover:text-brand-primary transition-colors">Trademarks</Link>
            <ChevronRight size={12} />
            <span className="text-white">{mark.markName}</span>
          </nav>

          {/* ── Hero ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-12 lg:gap-16 items-start mb-20">
            <div>
              <MarkSpecimen name={mark.markName} image={mark.markImage} bg={mark.markImageBg}
                className="w-[260px] h-[165px] mb-4" textClass="text-4xl" />
              <p className="text-text-muted text-xs mb-8 max-w-[320px] leading-relaxed">
                {isDevice ? L.deviceNote : L.wordNote}
              </p>

              <h1 className="text-4xl md:text-6xl font-display leading-[1.05] tracking-tight text-white">
                {mark.markName}<sup className="text-text-muted text-[0.28em] font-mono align-super ml-1">{sym}</sup>
              </h1>
              <div className="text-text-muted text-sm mt-3">
                {mark.markType}{jurisdiction ? ` — ${jurisdiction.countryName}` : ""}
              </div>

              {mark.summary && (
                <p className="text-text-secondary text-lg mt-7 max-w-2xl leading-relaxed">{mark.summary}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-8">
                <StatusPill status={mark.status} />
                <span className="text-text-muted text-sm">
                  Filed {formatMarkDate(mark.filingDate)}
                  {mark.statusNote ? ` · ${mark.statusNote}` : ""}
                </span>
              </div>
            </div>

            {/* Registry particulars */}
            <div className="glass-card p-7">
              <div className="text-[10px] uppercase tracking-[0.25em] text-text-muted font-mono pb-4 mb-5 border-b border-white/10">
                Registry particulars
              </div>
              <dl className="space-y-3">
                <Row label="Mark" value={mark.markName} />
                <Row label="Type" value={mark.markType} />
                <Row label="Application" value={applicationLabel(mark)} />
                {mark.registrationNumber && <Row label="Registration" value={mark.registrationNumber} />}
                {proprietor && <Row label="Proprietor" value={proprietor.legalName} />}
                {jurisdiction && <Row label="Office" value={jurisdiction.officeName} />}
                <Row label="Filed" value={formatMarkDate(mark.filingDate)} />
                <Row label="Classes" value={classList(mark)} />
                <Row label="Status" value={mark.status} />
              </dl>

              {verify.url && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <Link href={verify.url} target="_blank" rel="noopener noreferrer"
                    className="btn-premium w-full inline-flex gap-3 text-sm">
                    Verify on {jurisdiction?.officeShort ?? "the register"}
                    <ExternalLink size={15} />
                  </Link>
                  {verify.manualEntry && (
                    <p className="text-text-muted text-[11px] mt-3 leading-relaxed">
                      {fill(L.manualSearchNote, { number: verify.number })}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Story ────────────────────────────────────────── */}
          {mark.story && (
            <section className="mb-20 border-t border-white/5 pt-16">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-8">{L.story}</h2>
              <div className="max-w-3xl space-y-5">
                {mark.story.split("\n\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="text-text-secondary text-base md:text-lg leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          )}

          {/* ── Classes ──────────────────────────────────────── */}
          <section className="mb-20 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{L.classes}</h2>
            <p className="text-text-secondary text-base max-w-3xl leading-relaxed">{L.classesIntro}</p>
            {mark.classNote && (
              <p className="text-text-secondary text-base max-w-3xl leading-relaxed mt-3">{mark.classNote}</p>
            )}

            <div className="space-y-6 mt-10">
              {(mark.classes ?? []).map((c, i) => (
                <div key={i} className="rounded-2xl border border-white/10 overflow-hidden">
                  <div className="flex flex-wrap items-baseline gap-4 px-6 py-4 bg-white/5 border-b border-white/10">
                    <span className="text-2xl font-display text-white">{c.classNumber}</span>
                    <span className="text-text-secondary text-sm">{c.classHeading}</span>
                    <span className="ml-auto text-text-muted text-xs font-mono">
                      Application {numberForClass(mark, c)}
                    </span>
                  </div>
                  <div className="px-6 py-5">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-mono mb-3">
                      Specification as filed
                    </div>
                    {c.specification?.trim() ? (
                      <p className="text-text-secondary text-base leading-relaxed max-w-4xl">{c.specification}</p>
                    ) : (
                      // Never invent this wording — it defines the legal scope of protection.
                      // Until the exact filed text is entered, point the reader at the register.
                      <p className="text-text-muted text-sm leading-relaxed max-w-4xl italic">
                        {L.specFallback}
                        {verify.url ? " Open the registry record above to read it in full." : ""}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Timeline ─────────────────────────────────────── */}
          <section className="mb-20 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{L.timeline}</h2>
            <p className="text-text-secondary text-base max-w-3xl leading-relaxed">{L.timelineIntro}</p>
            <ol className="mt-10 border-l-2 border-white/10 max-w-3xl">
              {timeline.map((s, i) => (
                <li key={i} className="relative pl-8 pb-8 last:pb-0">
                  <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 ${
                    s.state === "done" ? "bg-brand-primary border-brand-primary"
                    : s.state === "now" ? "bg-emerald-400 border-emerald-400"
                    : "bg-brand-dark border-white/25"}`} />
                  {s.date && <div className="text-text-muted text-xs font-mono mb-1">{s.date}</div>}
                  <div className={`font-display text-lg mb-1 ${s.state === "future" ? "text-white/50" : "text-white"}`}>
                    {s.title}
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">{s.description}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── Usage (device marks) ─────────────────────────── */}
          {mark.usageEnabled && (
            <section className="mb-20 border-t border-white/5 pt-16">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{L.usage}</h2>
              {mark.usageIntro && (
                <p className="text-text-secondary text-base max-w-3xl leading-relaxed">{mark.usageIntro}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {mark.usageCorrect && (
                  <div className="glass-card p-7">
                    <div className="flex items-center gap-2 mb-3">
                      <Check size={16} className="text-emerald-400" />
                      <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-emerald-400">Correct</h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{mark.usageCorrect}</p>
                  </div>
                )}
                {mark.usageIncorrect && (
                  <div className="glass-card p-7">
                    <div className="flex items-center gap-2 mb-3">
                      <X size={16} className="text-text-muted" />
                      <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-text-muted">Not permitted</h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{mark.usageIncorrect}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── Verify ───────────────────────────────────────── */}
          <section className="mb-20 border-t border-white/5 pt-16">
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">{L.verify}</h2>
            <p className="text-text-secondary text-base max-w-3xl leading-relaxed">{L.verifyIntro}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
              {verify.url && (
                <VCard title={L.verifyRegisterTitle}
                  body={fill(L.verifyRegisterBody, { office: jurisdiction?.officeName ?? "the registry" })}
                  href={verify.url} label={`Open ${jurisdiction?.officeShort ?? "register"}`} primary />
              )}
              {mark.ventureUrl && (
                <VCard title={L.verifyVentureTitle}
                  body={fill(L.verifyVentureBody, { venture: mark.ventureName ?? mark.markName })}
                  href={mark.ventureUrl} label={`Visit ${mark.ventureName ?? mark.markName}`} />
              )}
              {proprietor && (
                <VCard title={L.verifyProprietorTitle}
                  body={fill(L.verifyProprietorBody, { proprietor: proprietor.legalName })}
                  href={proprietor.verifyUrl || "/about"} label="About the proprietor" />
              )}
            </div>
          </section>

          {/* ── Related ──────────────────────────────────────── */}
          {related.length > 0 && (
            <section className="mb-20 border-t border-white/5 pt-16">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-10">{L.related}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map(r => (
                  <Link key={r.id} href={`/trademarks/${r.slug}`}
                    className="glass-card p-5 flex items-center gap-4 group">
                    <MarkSpecimen name={r.markName} image={r.markImage} bg={r.markImageBg}
                      className="w-[64px] h-[46px] shrink-0" textClass="text-[11px]" />
                    <div className="min-w-0">
                      <div className="font-display text-lg text-white group-hover:text-brand-primary transition-colors truncate">
                        {r.markName}<sup className="text-text-muted text-[9px] font-mono ml-0.5">{markSymbol(r.status)}</sup>
                      </div>
                      <div className="text-text-muted text-xs mt-0.5 truncate">{r.markType} · {r.status}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* ── FAQ ──────────────────────────────────────────── */}
          {faqs.length > 0 && (
            <section className="border-t border-white/5 pt-16">
              <h2 className="text-3xl md:text-4xl font-display text-white mb-10">{L.faq}</h2>
              <FAQGrid questions={faqs.map(f => ({ q: f.question, a: f.answer }))} />
            </section>
          )}

        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-text-muted text-xs shrink-0">{label}</dt>
      <dd className="text-white font-medium font-mono text-right text-xs break-all">{value}</dd>
    </div>
  );
}

function VCard({ title, body, href, label, primary }: {
  title: string; body: string; href: string; label: string; primary?: boolean;
}) {
  const external = href.startsWith("http");
  return (
    <div className="glass-card p-7 flex flex-col">
      <h3 className="font-display text-lg text-white mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed mb-6 grow">{body}</p>
      <Link href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`${primary ? "btn-premium" : "btn-outline"} text-xs inline-flex gap-2 self-start`}>
        {label}
        {external && <ExternalLink size={13} />}
      </Link>
    </div>
  );
}
