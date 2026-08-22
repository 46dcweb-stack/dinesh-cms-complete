import type { Metadata } from "next";
import Link from "next/link";
import { PageSchema } from "@/components/seo/JsonLd";
import { getPublishedBlogs, getVentures } from "@/lib/firebase-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sitemap — Dinesh Koyyalamudi (46DC)",
  description:
    "Every page on 46dc.com in one place — about, ecosystem, manifesto, blog posts, press, gallery and legal information.",
  alternates: { canonical: "/sitemap" },
  openGraph: { title: "Sitemap — Dinesh Koyyalamudi (46DC)", url: "/sitemap", type: "website" },
};

type Entry = { label: string; href: string; note?: string; external?: boolean };

const SECTIONS: { title: string; links: Entry[] }[] = [
  {
    title: "Main",
    links: [
      { label: "Home",      href: "/",          note: "Overview of 46DC and the FourSix46 ecosystem" },
      { label: "About",     href: "/about",     note: "Biography, background and current focus" },
      { label: "Ecosystem", href: "/ecosystem", note: "Every venture built under FourSix46" },
      { label: "Manifesto", href: "/manifesto", note: "Operating principles and long-term philosophy" },
    ],
  },
  {
    title: "Content",
    links: [
      { label: "Blog",    href: "/blog",    note: "Founder notes, written in public" },
      { label: "Press",   href: "/press",   note: "Media coverage and press assets" },
      { label: "Gallery", href: "/gallery", note: "Moments from the founder journey" },
      { label: "FAQ",     href: "/faq",     note: "Direct answers about 46DC and FourSix46" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact",   href: "/contact",   note: "Enquiries and collaboration" },
      { label: "Subscribe", href: "/subscribe", note: "Get founder notes by email" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use",   href: "/terms" },
      { label: "Cookie Policy",  href: "/cookies" },
      { label: "XML Sitemap",    href: "/sitemap.xml", note: "Machine-readable version for search engines", external: true },
    ],
  },
];

export default async function SitemapPage() {
  const [posts, ventures] = await Promise.all([
    getPublishedBlogs().catch(() => []),
    getVentures().catch(() => []),
  ]);

  const postLinks: Entry[] = (posts as any[])
    .filter(p => p?.slug)
    .map(p => ({
      label: p.title,
      href: `/blog/${p.slug}`,
      note: p.publishDate
        ? new Date(p.publishDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : undefined,
    }));

  const ventureLinks: Entry[] = (ventures as any[])
    .filter(v => v?.url)
    .map(v => ({ label: v.name, href: v.url, note: v.role, external: true }));

  return (
    <div className="pt-48 lg:pt-48 pb-24 bg-brand-dark min-h-screen">
      <PageSchema
        name="Sitemap"
        description="Every page on 46dc.com in one place."
        path="/sitemap"
        type="CollectionPage"
      />
      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-3xl mb-20">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              Index
            </span>
            <h1 className="text-4xl md:text-7xl font-display leading-[1.1] tracking-tight">
              Every page, <span className="text-gradient italic">one place.</span>
            </h1>
            <p className="text-text-secondary text-lg mt-8 max-w-2xl leading-relaxed">
              A complete index of 46dc.com. Looking for the machine-readable version?
              It lives at <Link href="/sitemap.xml" className="text-brand-primary hover:underline underline-offset-4">/sitemap.xml</Link>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
            {SECTIONS.map(section => (
              <Section key={section.title} title={section.title} links={section.links} />
            ))}

            {postLinks.length > 0 && (
              <Section title={`Blog Posts (${postLinks.length})`} links={postLinks} />
            )}

            {ventureLinks.length > 0 && (
              <Section title="Ventures" links={ventureLinks} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function Section({ title, links }: { title: string; links: Entry[] }) {
  return (
    <div>
      <h2 className="text-brand-primary font-mono text-xs uppercase tracking-[0.4em] mb-8 border-b border-white/5 pb-4">
        {title}
      </h2>
      <ul className="space-y-5">
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group inline-flex flex-col"
            >
              <span className="text-white group-hover:text-brand-primary transition-colors text-base md:text-lg font-display">
                {link.label}
                {link.external && <span className="text-text-muted text-xs ml-2 font-mono">↗</span>}
              </span>
              {link.note && (
                <span className="text-text-muted text-sm mt-1 leading-relaxed">{link.note}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
