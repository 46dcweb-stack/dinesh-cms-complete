import type { Metadata } from "next";
import BlogContentWrapper from "@/components/blog/BlogContentWrapper";
import { PageSchema } from "@/components/seo/JsonLd";
import { getLegalPage } from "@/lib/firebase-data";
import { LEGAL_DEFAULTS, type LegalSlug } from "@/lib/legal-defaults";
import { fbStr } from "@/lib/fallback";

// Shared renderer for /terms, /privacy and /cookies. Content comes from the
// `legalPages` collection (edited in /admin/legal); the constants in
// lib/legal-defaults.ts are the fallback so a page is never blank.

export async function buildLegalMetadata(slug: LegalSlug): Promise<Metadata> {
  const d = LEGAL_DEFAULTS[slug];
  const cms = (await getLegalPage(slug)) as any;
  const title = fbStr(cms?.seoTitle, d.seoTitle);
  const description = fbStr(cms?.seoDescription, d.seoDescription);
  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: { title, description, url: `/${slug}`, type: "website" },
  };
}

export default async function LegalPageView({ slug }: { slug: LegalSlug }) {
  const d = LEGAL_DEFAULTS[slug];
  const cms = (await getLegalPage(slug)) as any;

  const eyebrow     = fbStr(cms?.eyebrow,     d.eyebrow);
  const title       = fbStr(cms?.title,       d.title);
  const titleItalic = fbStr(cms?.titleItalic, d.titleItalic);
  const entityName  = fbStr(cms?.entityName,  d.entityName);
  const lastUpdated = fbStr(cms?.lastUpdated, d.lastUpdated);
  const content     = fbStr(cms?.content,     d.content);

  return (
    <div className="pt-28 lg:pt-28 pb-24 font-body">
      <PageSchema
        name={d.label}
        description={fbStr(cms?.seoDescription, d.seoDescription)}
        path={`/${slug}`}
        breadcrumb={d.label}
      />
      <div className="px-6">
        <div className="max-w-3xl mx-auto">

          <div className="mb-16">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              {eyebrow}
            </span>
            <h1 className="text-5xl md:text-7xl font-display leading-[1.1] tracking-tight mb-8">
              {title} <span className="text-gradient italic">{titleItalic}</span>
            </h1>
            {entityName && (
              <p className="text-text-secondary text-sm font-mono tracking-widest uppercase mb-2">
                {entityName}
              </p>
            )}
            {lastUpdated && (
              <p className="text-text-muted text-xs font-mono tracking-widest uppercase">
                {lastUpdated}
              </p>
            )}
          </div>

          <BlogContentWrapper content={content} />

        </div>
      </div>
    </div>
  );
}
