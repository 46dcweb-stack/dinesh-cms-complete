import Link from "next/link";
import { ArrowRight } from "lucide-react";
import EcosystemGrid from "@/components/sections/EcosystemGrid";
import { getVentures, getEcosystemPageMeta, getSiteSettings } from "@/lib/firebase-data";
import { homePageData } from "@/lib/data";
import { fbArr, fbStr } from "@/lib/fallback";
import type { Metadata } from "next";
import { PageSchema } from "@/components/seo/JsonLd";

export const revalidate = 60;

// ── Defaults — used until the Ecosystem page doc is filled in via /admin/ecosystem
const DEFAULTS = {
  eyebrow: "The Ecosystem",
  heading: "Building the",
  headingItalic: "Invisible.",
  description:
    "We do not just build companies. We engineer ecosystems — a portfolio of ventures spanning global logistics, sovereign data, and biophilic tech.",
  introTitle: "One parent brand. Many frontiers.",
  introBody:
    "Every venture in the FourSix46 ecosystem is built on the same foundation: structural clarity, quiet precision, and infrastructure that thrives on volatility.",
  ctaTitle: "Want to build with us?",
  ctaDescription: "Whether you are founding, funding, or partnering — the conversation starts here.",
  ctaLabel: "Start a Conversation",
  ctaUrl: "/contact",
};

export async function generateMetadata(): Promise<Metadata> {
  const [meta, settings] = await Promise.all([getEcosystemPageMeta(), getSiteSettings()]) as any[];
  const title       = fbStr(meta?.seoMetaTitle,       "The Ecosystem | FourSix46 Ventures");
  const description = fbStr(meta?.seoMetaDescription, fbStr(meta?.description, DEFAULTS.description));
  const ogImage     = fbStr(meta?.seoOgImage,         fbStr(settings?.seoOgImage, "/og-image.jpg"));
  return {
    title, description,
    alternates: { canonical: "/ecosystem" },
    openGraph: { title, description, url: "/ecosystem", images: [{ url: ogImage, width: 1200, height: 630 }], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function EcosystemPage() {
  const [fbVentures, fbMeta] = await Promise.all([getVentures(), getEcosystemPageMeta()]);
  const meta = (fbMeta ?? {}) as any;

  const ventures = fbArr(fbVentures, (homePageData as any).ventures ?? []);

  const pd = {
    eyebrow:        fbStr(meta.eyebrow,        DEFAULTS.eyebrow),
    heading:        fbStr(meta.heading,        DEFAULTS.heading),
    headingItalic:  fbStr(meta.headingItalic,  DEFAULTS.headingItalic),
    description:    fbStr(meta.description,    DEFAULTS.description),
    introTitle:     fbStr(meta.introTitle,     DEFAULTS.introTitle),
    introBody:      fbStr(meta.introBody,      DEFAULTS.introBody),
    ctaTitle:       fbStr(meta.ctaTitle,       DEFAULTS.ctaTitle),
    ctaDescription: fbStr(meta.ctaDescription, DEFAULTS.ctaDescription),
    ctaLabel:       fbStr(meta.ctaLabel,       DEFAULTS.ctaLabel),
    ctaUrl:         fbStr(meta.ctaUrl,         DEFAULTS.ctaUrl),
  };

  const stats: { value: string; label: string }[] = Array.isArray(meta.stats)
    ? meta.stats.filter((s: any) => s?.value || s?.label)
    : [];

  return (
    <div className="pt-48 lg:pt-48 pb-24 bg-brand-dark min-h-screen">
      <PageSchema name="The Ecosystem" description="Every venture built under the FourSix46 parent brand." path="/ecosystem" type="CollectionPage" breadcrumb="Ecosystem" />
      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Page Header ──────────────────────────────────────── */}
          <div className="max-w-3xl mb-16">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              {pd.eyebrow}
            </span>
            <h1 className="text-4xl md:text-7xl font-display leading-[1.1] tracking-tight">
              {pd.heading} <span className="text-gradient italic">{pd.headingItalic}</span>
            </h1>
            {pd.description && (
              <p className="text-text-secondary text-lg mt-8 max-w-2xl leading-relaxed">
                {pd.description}
              </p>
            )}
          </div>

          {/* ── Stats ───────────────────────────────────────────── */}
          {stats.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 border-y border-white/5 py-10">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl md:text-5xl font-display text-white mb-2">{s.value}</div>
                  <div className="text-text-muted text-[10px] uppercase font-mono tracking-[0.2em]">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* ── Intro ───────────────────────────────────────────── */}
          {(pd.introTitle || pd.introBody) && (
            <div className={`grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 ${stats.length > 0 ? "mb-24" : "mb-24 pt-4"}`}>
              {pd.introTitle && (
                <h2 className="text-2xl md:text-4xl font-display text-white leading-tight">
                  {pd.introTitle}
                </h2>
              )}
              {pd.introBody && (
                <p className="text-text-secondary text-base md:text-lg leading-relaxed border-l-2 border-brand-primary/30 pl-6">
                  {pd.introBody}
                </p>
              )}
            </div>
          )}

          {/* ── Ventures ────────────────────────────────────────── */}
          <EcosystemGrid ventures={ventures as any[]} />

          {/* ── CTA ─────────────────────────────────────────────── */}
          {pd.ctaTitle && (
            <div className="glass-card mt-28 p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-display text-white mb-5">{pd.ctaTitle}</h2>
              {pd.ctaDescription && (
                <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                  {pd.ctaDescription}
                </p>
              )}
              {pd.ctaLabel && (
                <Link href={pd.ctaUrl || "/contact"} className="btn-premium inline-flex gap-3">
                  {pd.ctaLabel}
                  <ArrowRight size={18} />
                </Link>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
