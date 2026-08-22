// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for every static route on the site.
//
// Both sitemaps read from this list:
//   • /sitemap.xml  (src/app/sitemap.ts)      — for search engines
//   • /sitemap      (src/app/sitemap/page.tsx) — for people
//
// Adding a new static page? Add ONE entry here and it appears in both, plus
// llms.txt. CMS-driven pages (blog posts) are pulled live and need nothing.
// ─────────────────────────────────────────────────────────────────────────────

export type RouteSection = "Main" | "Content" | "Connect" | "Legal";

export type SiteRoute = {
  path: string;
  label: string;
  description?: string;
  section: RouteSection;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
};

export const SITE_ROUTES: SiteRoute[] = [
  // ── Main ──────────────────────────────────────────────────────────────────
  { path: "/",           label: "Home",           section: "Main",    changeFrequency: "weekly",  priority: 1.0, description: "Overview of 46DC and the FourSix46 ecosystem" },
  { path: "/about",      label: "About",          section: "Main",    changeFrequency: "monthly", priority: 0.9, description: "Biography, background and current focus" },
  { path: "/ecosystem",  label: "Ecosystem",      section: "Main",    changeFrequency: "weekly",  priority: 0.9, description: "Every venture built under FourSix46" },
  { path: "/manifesto",  label: "Manifesto",      section: "Main",    changeFrequency: "monthly", priority: 0.9, description: "Operating principles and long-term philosophy" },

  // ── Content ───────────────────────────────────────────────────────────────
  { path: "/blog",       label: "Blog",           section: "Content", changeFrequency: "daily",   priority: 0.8, description: "Founder notes, written in public" },
  { path: "/press",      label: "Press",          section: "Content", changeFrequency: "weekly",  priority: 0.7, description: "Media coverage and press assets" },
  { path: "/gallery",    label: "Gallery",        section: "Content", changeFrequency: "weekly",  priority: 0.6, description: "Moments from the founder journey" },
  { path: "/faq",        label: "FAQ",            section: "Content", changeFrequency: "monthly", priority: 0.6, description: "Direct answers about 46DC and FourSix46" },

  // ── Connect ───────────────────────────────────────────────────────────────
  { path: "/contact",    label: "Contact",        section: "Connect", changeFrequency: "yearly",  priority: 0.5, description: "Enquiries and collaboration" },
  { path: "/subscribe",  label: "Subscribe",      section: "Connect", changeFrequency: "yearly",  priority: 0.5, description: "Get founder notes by email" },

  // ── Legal ─────────────────────────────────────────────────────────────────
  { path: "/privacy",    label: "Privacy Policy", section: "Legal",   changeFrequency: "yearly",  priority: 0.3 },
  { path: "/terms",      label: "Terms of Use",   section: "Legal",   changeFrequency: "yearly",  priority: 0.3 },
  { path: "/cookies",    label: "Cookie Policy",  section: "Legal",   changeFrequency: "yearly",  priority: 0.3 },
  { path: "/sitemap",    label: "Sitemap",        section: "Legal",   changeFrequency: "weekly",  priority: 0.3, description: "Complete index of every page" },
];

export const SECTION_ORDER: RouteSection[] = ["Main", "Content", "Connect", "Legal"];

export function routesBySection(section: RouteSection): SiteRoute[] {
  return SITE_ROUTES.filter(r => r.section === section);
}
