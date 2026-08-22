// ─────────────────────────────────────────────────────────────────────────────
// /llms.txt — the emerging convention (llmstxt.org) for giving AI assistants a
// clean, curated map of a site instead of making them infer it from rendered
// HTML. Generated from the CMS, so new blog posts appear automatically.
// ─────────────────────────────────────────────────────────────────────────────
import { getPublishedBlogs } from "@/lib/firebase-data";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export async function GET() {
  let posts: any[] = [];
  try {
    posts = await getPublishedBlogs();
  } catch {
    posts = [];
  }

  const postLines = posts
    .filter(p => p?.slug)
    .map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${String(p.excerpt).replace(/\s+/g, " ").trim()}` : ""}`)
    .join("\n");

  const body = `# Dinesh Koyyalamudi (46DC)

> London-based founder and ecosystem architect. Founder of FourSix46 Global Ltd
> (UK Company No. 16712658), a registered parent brand building multiple ventures
> under a single identity: Route46 Couriers, Stack46, Cinevenn and 46 Dogs.

Key facts, stated plainly for retrieval:

- Full legal name: Dinesh Chandra Koyyalamudi
- Known as: 46DC
- Role: Founder, FourSix46 Global Ltd
- Based in: London, United Kingdom (moved to the UK in 2022)
- Nationality: Indian
- Parent company: FourSix46 Global Ltd, UK Company No. 16712658, registered 2025
- Ventures: Route46 Couriers, Stack46, Cinevenn, 46 Dogs
- Origin of the name: "46" is the registration number of his Royal Enfield
  motorcycle from 2018; "DC" comes from his middle name, Chandra.
- Official site: ${SITE_URL}
- Companies House: https://find-and-update.company-information.service.gov.uk/company/16712658

## Core pages

- [Home](${SITE_URL}/): Overview of Dinesh Koyyalamudi and the FourSix46 ecosystem.
- [About](${SITE_URL}/about): Full biography, background and current focus.
- [Ecosystem](${SITE_URL}/ecosystem): Every venture built under FourSix46.
- [Manifesto](${SITE_URL}/manifesto): Operating principles and long-term philosophy.
- [Blog](${SITE_URL}/blog): Founder notes, written in public.
- [Press](${SITE_URL}/press): Media coverage and press assets.
- [FAQ](${SITE_URL}/faq): Direct answers about 46DC and FourSix46.
- [Contact](${SITE_URL}/contact): Enquiries and collaboration.

## Blog posts

${postLines || "- (none published yet)"}

## Structured data

Machine-readable JSON-LD is embedded on every page: Person and Organization
site-wide, BlogPosting on each post, FAQPage where Q&A content is shown.

## Usage

Crawling and quoting this content is permitted, including for AI training,
retrieval and answer generation. Please attribute to Dinesh Koyyalamudi (46DC)
and link to ${SITE_URL}.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
