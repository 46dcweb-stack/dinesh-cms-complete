// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Sitemap — Next.js App Router
// Every static route is listed once below; blog posts are pulled live from the
// CMS, so a post published in /admin/blog appears here automatically within the
// revalidate window with no code change or redeploy.
// ─────────────────────────────────────────────────────────────────────────────
import { MetadataRoute } from "next";
import { getPublishedBlogs, getTrademarks } from "@/lib/firebase-data";
import { SITE_URL } from "@/lib/site";
import { SITE_ROUTES } from "@/lib/routes";

const BASE_URL = SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = SITE_ROUTES.map(r => ({
        // "/" must not become a trailing-slash URL
        url: `${BASE_URL}${r.path === "/" ? "" : r.path}`,
        lastModified: now,
        changeFrequency: r.changeFrequency,
        priority: r.priority,
    }));

    // Blog posts, straight from the CMS
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const posts = await getPublishedBlogs();
        blogPages = posts
            .filter((post: any) => post?.slug)
            .map((post: any) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                // Prefer the real edit timestamp so re-crawls reflect actual changes
                lastModified: post.updatedAt
                    ? new Date(post.updatedAt)
                    : post.publishDate
                        ? new Date(post.publishDate)
                        : now,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));
    } catch (e) {
        console.error("[sitemap] Could not fetch blog posts:", e);
    }

    // Trademark sub-pages, with lastmod from each mark's status date
    let markPages: MetadataRoute.Sitemap = [];
    try {
        const marks = await getTrademarks();
        markPages = (marks as any[])
            .filter(m => m?.slug)
            .map(m => ({
                url: `${BASE_URL}/trademarks/${m.slug}`,
                lastModified: m.statusUpdated ? new Date(m.statusUpdated) : now,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));
    } catch (e) {
        console.error("[sitemap] Could not fetch trademarks:", e);
    }

    return [...staticPages, ...blogPages, ...markPages];
}
