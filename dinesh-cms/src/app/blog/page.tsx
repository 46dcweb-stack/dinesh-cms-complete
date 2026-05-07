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
  const featuredPost = posts.find((p: any) => p.featuredPost) || posts[0] || null;

  return (
    <div className="pb-24">
      <div className="pt-28 lg:pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          <BlogClientWrapper initialPosts={posts as any} initialFeaturedPost={featuredPost as any} />
        </div>
      </div>

      {/* Contact CTA */}
      <div className="mt-24 border-t border-white/5">
        <ContactForm
          title="Have a Story Idea?"
          subtitle="Get in Touch"
          description="Want to collaborate on an article, interview, or guest post? Let's connect."
        />
      </div>
    </div>
  );
}
