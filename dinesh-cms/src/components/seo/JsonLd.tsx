// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD Structured Data Components
// PDF requirement: Person, Article, Breadcrumb schema
// Goal: Google understands "Dinesh Koyyalamudi = Founder of FourSix46"
// ─────────────────────────────────────────────────────────────────────────────

// ── Person Schema (Dinesh Koyyalamudi) ───────────────────────────────────────
// Site-wide: describes the person independent of any single page, so it renders
// on every page via the root layout.
// NOTE: `sameAs` must only contain profiles that genuinely exist and are
// controlled by the subject — a wrong link actively weakens entity resolution.
// These are verified against siteSettings.socialLinks in the CMS.
export function PersonSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://www.46dc.com/#person",
        name: "Dinesh Koyyalamudi",
        alternateName: ["46DC", "Dinesh Chandra Koyyalamudi", "DC"],
        givenName: "Dinesh",
        additionalName: "Chandra",
        familyName: "Koyyalamudi",
        jobTitle: "Founder",
        description:
            "London-based founder and ecosystem architect. Founder of FourSix46 Global Ltd, a UK-registered parent brand building multiple ventures under a single identity.",
        url: "https://www.46dc.com",
        image: "https://www.46dc.com/og-image.jpg",
        nationality: "Indian",
        homeLocation: {
            "@type": "Place",
            address: {
                "@type": "PostalAddress",
                addressLocality: "London",
                addressCountry: "GB",
            },
        },
        worksFor: { "@id": "https://foursix46.com/#organization" },
        knowsAbout: [
            "Entrepreneurship",
            "Multi-venture business building",
            "Brand architecture",
            "Technology ventures",
        ],
        sameAs: [
            "https://www.linkedin.com/in/the46dc",
            "https://x.com/the46dc",
            "https://www.instagram.com/the46dc",
            "https://www.facebook.com/the46dc",
            "https://www.youtube.com/@the46dc",
            "https://foursix46.com",
            "https://find-and-update.company-information.service.gov.uk/company/16712658",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

// ── Organization Schema (FourSix46 Global Ltd) ───────────────────────────────
// The canonical definition lives on foursix46.com; this node carries the same
// @id so both sites resolve to one entity. Company number makes the legal
// entity verifiable rather than merely asserted in prose.
export function OrganizationSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://foursix46.com/#organization",
        name: "FourSix46",
        legalName: "FourSix46 Global Ltd",
        url: "https://foursix46.com",
        description:
            "A UK-registered parent brand building multiple ventures under a single identity, including Route46, Stack46, Cinevenn and 46Dogs.",
        identifier: {
            "@type": "PropertyValue",
            name: "UK Company Number",
            value: "16712658",
        },
        address: {
            "@type": "PostalAddress",
            addressLocality: "London",
            addressCountry: "GB",
        },
        founder: { "@id": "https://www.46dc.com/#person" },
        sameAs: [
            "https://foursix46.com",
            "https://find-and-update.company-information.service.gov.uk/company/16712658",
        ],
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

// ── BlogPosting Schema (Blog Posts) ──────────────────────────────────────────
// Per-page: generated from the CMS fields for each post, so every future post
// gets this automatically with no hardcoding.
interface BlogPostingSchemaProps {
    title: string;
    excerpt: string;
    slug: string;
    publishDate: string;
    dateModified?: string;
    featuredImage?: string;
    tags?: string[];
    author?: string;
}

export function BlogPostingSchema({
    title,
    excerpt,
    slug,
    publishDate,
    dateModified,
    featuredImage,
    tags = [],
    author = "Dinesh Koyyalamudi",
}: BlogPostingSchemaProps) {
    const url = `https://www.46dc.com/blog/${slug}`;
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: title,
        description: excerpt,
        url,
        datePublished: publishDate,
        dateModified: dateModified || publishDate,
        inLanguage: "en-GB",
        author: {
            "@type": "Person",
            "@id": "https://www.46dc.com/#person",
            name: author,
        },
        publisher: { "@id": "https://foursix46.com/#organization" },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
        },
        about: [
            { "@id": "https://www.46dc.com/#person" },
            { "@id": "https://foursix46.com/#organization" },
        ],
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
export function FaqSchema({
    items,
    pageUrl = "https://www.46dc.com/faq",
}: {
    items: { q: string; a: string }[];
    pageUrl?: string;
}) {
    if (!items || items.length === 0) return null;

    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${pageUrl}#faqpage`,
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

// ── WebPage + Breadcrumb Schema (any non-article page) ───────────────────────
// Site-wide Person/Organization say who the entity IS; this says what THIS page
// is and where it sits in the hierarchy. Without it a crawler only sees prose.
type PageSchemaType =
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "ProfilePage";

export function PageSchema({
    name,
    description,
    path,
    type = "WebPage",
    breadcrumb,
}: {
    name: string;
    description?: string;
    path: string;            // e.g. "/about"
    type?: PageSchemaType;
    breadcrumb?: string;     // label in the trail; defaults to `name`
}) {
    const base = "https://www.46dc.com";
    const url = `${base}${path}`;

    const page = {
        "@context": "https://schema.org",
        "@type": type,
        "@id": `${url}#webpage`,
        url,
        name,
        ...(description && { description }),
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": `${base}/#person` },
        inLanguage: "en-GB",
        breadcrumb: { "@id": `${url}#breadcrumb` },
    };

    const trail = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: base },
            { "@type": "ListItem", position: 2, name: breadcrumb || name, item: url },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(trail) }}
            />
        </>
    );
}
