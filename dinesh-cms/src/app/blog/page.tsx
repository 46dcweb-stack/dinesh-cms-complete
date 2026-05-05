import BlogClientWrapper from "@/components/blog/BlogClientWrapper";
import { getPublishedBlogs } from "@/lib/firebase-data";
import { blogPosts } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
    title: "Journal",
    description: "Thought leadership, insights, and essays on venture building and the future.",
};

export default async function BlogListingPage() {
    const fbPosts = await getPublishedBlogs();
    const posts = fbPosts.length > 0 ? fbPosts : (blogPosts as any[]);
    const featuredPost = posts.find((p: any) => p.featuredPost) || posts[0] || null;

    return (
        <div className="pt-20 lg:pt-12 pb-24 px-6">
            <div className="max-w-7xl mx-auto">
                <BlogClientWrapper
                    initialPosts={posts as any}
                    initialFeaturedPost={featuredPost as any}
                />
            </div>
        </div>
    );
}
