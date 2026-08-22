// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Sitemap — Next.js App Router
// Every static route is listed once below; blog posts are pulled live from the
// CMS, so a post published in /admin/blog appears here automatically within the
// revalidate window with no code change or redeploy.
// ─────────────────────────────────────────────────────────────────────────────
import { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/firebase-data";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

// Keep this in sync when a new static route is added under src/app.
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"]; priority: number }[] = [
    { path: "",           changeFrequency: "weekly",  priority: 1.0 },
    { path: "/about",     changeFrequency: "monthly", priority: 0.9 },
    { path: "/ecosystem", changeFrequency: "weekly",  priority: 0.9 },
    { path: "/manifesto", changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog",      changeFrequency: "daily",   priority: 0.8 },
    { path: "/press",     changeFrequency: "weekly",  priority: 0.7 },
    { path: "/gallery",   changeFrequency: "weekly",  priority: 0.6 },
    { path: "/faq",       changeFrequency: "monthly", priority: 0.6 },
    { path: "/contact",   changeFrequency: "yearly",  priority: 0.5 },
    { path: "/subscribe", changeFrequency: "yearly",  priority: 0.5 },
    { path: "/privacy",   changeFrequency: "yearly",  priority: 0.3 },
    { path: "/terms",     changeFrequency: "yearly",  priority: 0.3 },
    { path: "/cookies",   changeFrequency: "yearly",  priority: 0.3 },
    { path: "/sitemap",   changeFrequency: "weekly",  priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map(r => ({
        url: `${BASE_URL}${r.path}`,
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

    return [...staticPages, ...blogPages];
}
