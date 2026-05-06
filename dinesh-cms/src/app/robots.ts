// ─────────────────────────────────────────────────────────────────────────────
// robots.txt — Next.js App Router
// Allows all crawlers, blocks admin panel, points to sitemap
// ─────────────────────────────────────────────────────────────────────────────
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",       // Block CMS admin from crawlers
                    "/api/",         // Block API routes
                ],
            },
        ],
        sitemap: "https://dineshkoyyalamudi.com/sitemap.xml",
        host: "https://dineshkoyyalamudi.com",
    };
}
