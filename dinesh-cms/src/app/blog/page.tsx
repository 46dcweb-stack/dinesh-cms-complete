import BlogClientWrapper from "@/components/blog/BlogClientWrapper";
import ContactForm from "@/components/sections/ContactForm";
import { getPublishedBlogs } from "@/lib/firebase-data";
import { getAdminDb } from "@/lib/firebase-admin";
import { blogPosts } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 10;

export const metadata: Metadata = {
  title: "Journal",
  description: "Thought leadership, insights, and essays on venture building, strategy, and the future.",
  openGraph: {
    title: "Journal | Dinesh Koyyalamudi",
    description: "Thought leadership, insights, and essays on venture building and the future.",
    type: "website",
  },
};

const HERO_DEFAULTS = {
  subtitle:           "Thought Leadership & Insights",
  heading:            "The",
  headingItalic:      "Journal",
  description:        "Exploring the intersection of venture capital, logistics, and the philosophies that drive global impact.",
  contactTitle:       "Have a Story Idea?",
  contactSubtitle:    "Get in Touch",
  contactDescription: "Want to collaborate on an article, interview, or guest post? Let's connect.",
};

export default async function BlogListingPage() {
  const fbPosts = await getPublishedBlogs();
  const posts = fbPosts.length > 0 ? fbPosts : (blogPosts as any[]);

  let heroData = { ...HERO_DEFAULTS };

  try {
    const db = getAdminDb();
    const snap = await db.collection("siteSettings").doc("blogPage").get();
    if (snap.exists) {
      const d = snap.data() as any;
      heroData = {
        subtitle:           d.subtitle           || HERO_DEFAULTS.subtitle,
        heading:            d.heading            || HERO_DEFAULTS.heading,
        headingItalic:      d.headingItalic      || HERO_DEFAULTS.headingItalic,
        description:        d.description        || HERO_DEFAULTS.description,
        contactTitle:       d.contactTitle       || HERO_DEFAULTS.contactTitle,
        contactSubtitle:    d.contactSubtitle    || HERO_DEFAULTS.contactSubtitle,
        contactDescription: d.contactDescription || HERO_DEFAULTS.contactDescription,
      };
    }
  } catch (e) {
    console.error("[BlogListingPage heroData]", e);
  }

  return (
    <div className="pb-24">
      <BlogClientWrapper
        initialPosts={posts as any}
        initialFeaturedPost={null}
        heroData={heroData}
      />

      {/* Compact centred contact block */}
      <div className="px-6 mt-20 mb-8">
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-zinc-900/60 overflow-hidden p-5 md:p-10 lg:p-16">
          <ContactForm
            title={heroData.contactTitle}
            subtitle={heroData.contactSubtitle}
            description={heroData.contactDescription}
          />
        </div>
      </div>
    </div>
  );
}