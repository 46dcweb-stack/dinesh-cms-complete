// ─────────────────────────────────────────────────────────────────────────────
// Canonical site URL — single source of truth
// 46dc.com (with www) is the canonical domain. dineshkoyyalamudi.com is kept
// registered and 301s here permanently; it must never appear in canonical tags,
// sitemap entries, robots.txt, OG tags or schema markup.
// ─────────────────────────────────────────────────────────────────────────────
export const SITE_URL = "https://www.46dc.com";

/** Absolute URL for a path, e.g. absoluteUrl("/about") → https://www.46dc.com/about */
export function absoluteUrl(path: string = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;
}
