// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD Structured Data Components
// PDF requirement: Person, Article, Breadcrumb schema
// Goal: Google understands "Dinesh Koyyalamudi = Founder of FourSix46"
// ─────────────────────────────────────────────────────────────────────────────

// ── Person Schema (Dinesh Koyyalamudi) ───────────────────────────────────────
export function PersonSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://www.46dc.com/#person",
        name: "Dinesh Koyyalamudi",
        url: "https://www.46dc.com",
        image: "https://www.46dc.com/og-image.jpg",
        jobTitle: "Founder & Strategic Visionary",
        description:
            "Founder of FourSix46, a premier venture studio dedicated to building high-impact startups at the intersection of technology and human scalability.",
        sameAs: [
            "https://www.linkedin.com/in/dineshkoyyalamudi",
            "https://twitter.com/dineshkoyya",
            "https://foursix46.com",
        ],
        worksFor: {
            "@type": "Organization",
            "@id": "https://foursix46.com/#organization",
            name: "FourSix46",
            url: "https://foursix46.com",
        },
        knowsAbout: [
            "Venture Building",
            "Technology Strategy",
            "Leadership",
            "Entrepreneurship",
            "Resilient Systems",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ── Organization Schema (FourSix46) ──────────────────────────────────────────
export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://foursix46.com/#organization",
        name: "FourSix46",
        url: "https://foursix46.com",
        description:
            "A premier venture studio dedicated to building high-impact startups at the intersection of technology and human scalability.",
        founder: {
            "@type": "Person",
            "@id": "https://www.46dc.com/#person",
            name: "Dinesh Koyyalamudi",
        },
        sameAs: ["https://foursix46.com"],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ── Website Schema ────────────────────────────────────────────────────────────
export function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://www.46dc.com/#website",
        url: "https://www.46dc.com",
        name: "Dinesh Koyyalamudi",
        description:
            "Official platform of Dinesh Koyyalamudi — Founder, thinker, and leader focused on building resilient systems and visionary companies.",
        author: {
            "@id": "https://www.46dc.com/#person",
        },
        potentialAction: {
            "@type": "SearchAction",
            target: "https://www.46dc.com/blog?q={search_term_string}",
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ── Article Schema (Blog Posts) ───────────────────────────────────────────────
interface ArticleSchemaProps {
    title: string;
    excerpt: string;
    slug: string;
    publishDate: string;
    featuredImage?: string;
    tags?: string[];
    author?: string;
}

export function ArticleSchema({
    title,
    excerpt,
    slug,
    publishDate,
    featuredImage,
    tags = [],
    author = "Dinesh Koyyalamudi",
}: ArticleSchemaProps) {
    const url = `https://www.46dc.com/blog/${slug}`;
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": `${url}#article`,
        headline: title,
        description: excerpt,
        url,
        datePublished: publishDate,
        dateModified: publishDate,
        author: {
            "@type": "Person",
            "@id": "https://www.46dc.com/#person",
            name: author,
        },
        publisher: {
            "@type": "Person",
            "@id": "https://www.46dc.com/#person",
            name: "Dinesh Koyyalamudi",
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        ...(featuredImage && {
            image: {
                "@type": "ImageObject",
                url: featuredImage,
            },
        }),
        ...(tags.length > 0 && { keywords: tags.join(", ") }),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ── Breadcrumb Schema ─────────────────────────────────────────────────────────
interface BreadcrumbItem {
    name: string;
    url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ── FAQPage Schema ───────────────────────────────────────────────────────────
// Requires the Q&A to be visible on the page (it is — see FAQGrid, which keeps
// answers mounted). Unlocks FAQ rich snippets in search results.
export function FaqSchema({ items }: { items: { q: string; a: string }[] }) {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": "https://www.46dc.com/faq#faqpage",
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
            },
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
