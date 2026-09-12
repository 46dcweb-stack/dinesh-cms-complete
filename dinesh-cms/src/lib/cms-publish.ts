// ─────────────────────────────────────────────────────────────────────────────
// What each admin section invalidates when it saves.
//
// Every page on the site is ISR-cached, and the data behind it sits in
// `unstable_cache`. Saving to Firestore alone therefore changes nothing a
// visitor can see until the cache window expires. Each admin screen calls
// `publish()` straight after its save so the edit is live immediately.
//
// Kept in one place so a new admin screen cannot quietly ship without
// invalidation — the failure mode is silent and looks like "the CMS is broken".
// ─────────────────────────────────────────────────────────────────────────────
import { revalidate } from "./revalidate";

export type CmsSection =
  | "home" | "about" | "blog" | "press" | "faq" | "ventures" | "ecosystem"
  | "gallery" | "manifesto" | "team" | "settings" | "legal" | "trademarks";

type Target = { tags: string[]; paths: string[]; layout?: boolean };

// The sitemaps and the AI-crawler index are rebuilt from the same collections,
// so anything that adds or removes a page has to drop them too.
const SITEMAPS = ["/sitemap.xml", "/sitemap", "/llms.txt"];

const TARGETS: Record<CmsSection, Target> = {
  home:       { tags: ["homePage"],       paths: ["/"] },
  about:      { tags: ["aboutPage"],      paths: ["/about"] },
  blog:       { tags: ["blogPosts"],      paths: ["/blog", "/", ...SITEMAPS] },
  press:      { tags: ["pressMentions"],  paths: ["/press", "/", ...SITEMAPS] },
  faq:        { tags: ["faqItems"],       paths: ["/faq", ...SITEMAPS] },
  ventures:   { tags: ["ventures"],       paths: ["/", "/ecosystem"] },
  ecosystem:  { tags: ["ecosystemPage", "ventures"], paths: ["/ecosystem", "/"] },
  gallery:    { tags: ["galleryImages"],  paths: ["/gallery"] },
  manifesto:  { tags: ["manifesto"],      paths: ["/manifesto", "/"] },
  team:       { tags: ["teamMembers"],    paths: ["/about", "/"] },
  legal:      { tags: [],                 paths: [] },   // per-slug, see publishLegal
  trademarks: { tags: ["trademarks"],     paths: ["/trademarks", ...SITEMAPS] },

  // Site settings feed the root layout — navigation, footer and the default
  // metadata — so every page has to be dropped, not just one.
  settings:   { tags: ["siteSettings"],   paths: ["/"], layout: true },
};

/**
 * Push an admin edit live. Never throws: a failed revalidation must not make a
 * successful save look like it failed, so callers use the boolean to choose
 * between "published" and "will update shortly" wording.
 *
 * `extraPaths` covers per-record routes the section map cannot know in advance,
 * such as /blog/{slug} or /trademarks/{slug}.
 */
export async function publish(section: CmsSection, extraPaths: string[] = []): Promise<boolean> {
  const t = TARGETS[section];
  return revalidate({
    tags: t.tags,
    paths: [...t.paths, ...extraPaths],
    layout: t.layout,
  });
}

/** Legal pages are one document per slug, each with its own cache tag. */
export async function publishLegal(slug: string): Promise<boolean> {
  return revalidate({ tags: [`legalPage-${slug}`], paths: [`/${slug}`] });
}

/** Wording for the banner shown after a save. */
export function publishNote(pushed: boolean): string {
  return pushed
    ? "Saved and published — the live page is updated."
    : "Saved. The live page will update within a couple of minutes.";
}
