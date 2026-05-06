// ─────────────────────────────────────────────────────────────────────────────
// Dynamic Sitemap — Next.js App Router
// Generates /sitemap.xml automatically including all blog posts from Firebase
// ─────────────────────────────────────────────────────────────────────────────
import { MetadataRoute } from "next";
import { getPublishedBlogs } from "@/lib/firebase-data";

const BASE_URL = "https://dineshkoyyalamudi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/manifesto`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/press`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/gallery`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    // Dynamic blog posts from Firebase
    let blogPages: MetadataRoute.Sitemap = [];
    try {
        const posts = await getPublishedBlogs();
        blogPages = posts.map((post: any) => ({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: post.publishDate ? new Date(post.publishDate) : new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        }));
    } catch (e) {
        console.error("[sitemap] Could not fetch blog posts:", e);
    }

    return [...staticPages, ...blogPages];
}
