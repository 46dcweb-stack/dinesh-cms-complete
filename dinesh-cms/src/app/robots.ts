import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// AI / LLM crawlers, listed explicitly so their access is a deliberate,
// documented decision rather than an accident of the wildcard rule.
// These power answer engines and assistant training/retrieval — being readable
// by them is how 46DC shows up inside ChatGPT, Claude, Perplexity and Gemini.
//
// To BLOCK any of these later, move it out of this list and give it its own
// rule with `disallow: "/"`. Removing it from here alone does nothing, because
// the `*` rule below still grants access.
const AI_CRAWLERS = [
  // OpenAI — training, live browsing, and ChatGPT search
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic — Claude
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / Vertex (separate from Googlebot: this one governs AI use)
  "Google-Extended",
  // Apple Intelligence (separate from Applebot)
  "Applebot-Extended",
  // Meta AI
  "meta-externalagent",
  "FacebookBot",
  // Common Crawl — a major dataset source for most open models
  "CCBot",
  // Others
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "DuckAssistBot",
  "YouBot",
  "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Search engines and everything else
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // AI crawlers — same access, stated explicitly
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
