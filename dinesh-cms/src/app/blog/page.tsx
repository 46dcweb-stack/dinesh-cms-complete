import BlogClientWrapper from "@/components/blog/BlogClientWrapper";
import ContactForm from "@/components/sections/ContactForm";
import { getPublishedBlogs } from "@/lib/firebase-data";
import { blogPosts } from "@/lib/data";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Journal",
  description: "Thought leadership, insights, and essays on venture building, strategy, and the future.",
  openGraph: {
    title: "Journal | Dinesh Koyyalamudi",
    description: "Thought leadership, insights, and essays on venture building and the future.",
    type: "website",
  },
};

export default async function BlogListingPage() {
  const fbPosts = await getPublishedBlogs();
  const posts = fbPosts.length > 0 ? fbPosts : (blogPosts as any[]);

  // Fetch blog page hero settings from Firestore
  let heroData = {
    subtitle:      "Thought Leadership & Insights",
    heading:       "The",
    headingItalic: "Journal",
    description:   "Exploring the intersection of venture capital, logistics, and the philosophies that drive global impact.",
  };
  try {
    const { getAdminDb } = await import("@/lib/firebase-admin");
    const db = getAdminDb();
    const snap = await db.collection("siteSettings").doc("blogPage").get();
    if (snap.exists) {
      const d = snap.data() as any;
      heroData = {
        subtitle:      d.subtitle      || heroData.subtitle,
        heading:       d.heading       || heroData.heading,
        headingItalic: d.headingItalic || heroData.headingItalic,
        description:   d.description   || heroData.description,
      };
    }
  } catch {}

  return (
    <div className="pb-24">
      <BlogClientWrapper
        initialPosts={posts as any}
        initialFeaturedPost={null}
        heroData={heroData}
      />

      <div className="border-t border-white/5">
        <ContactForm
          title="Have a Story Idea?"
          subtitle="Get in Touch"
          description="Want to collaborate on an article, interview, or guest post? Let's connect."
        />
      </div>
    </div>
  );
}