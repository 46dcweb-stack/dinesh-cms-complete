import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, Share2, Twitter, Linkedin, Clock } from "lucide-react";
import BlogContentWrapper from "@/components/blog/BlogContentWrapper";
import { blogPosts } from "@/lib/data";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/firebase-data";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/JsonLd";

export const revalidate = 60;

export async function generateStaticParams() {
    const fbPosts = await getPublishedBlogs().catch(() => []);
    const fbSlugs = fbPosts.map((p: any) => ({ slug: p.slug }));
    const staticSlugs = blogPosts.map((post) => ({ slug: post.slug }));
    // Merge both, deduplicate
    const all = [...fbSlugs, ...staticSlugs];
    return all.filter((v, i, a) => a.findIndex(t => t.slug === v.slug) === i);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const fbPost = await getBlogBySlug(slug).catch(() => null);
    const post = fbPost ?? blogPosts.find((p) => p.slug === slug);
    if (!post) return {};
    return {
        title: post.title,
        description: post.excerpt,
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const fbPost = await getBlogBySlug(slug).catch(() => null);
    const post = fbPost ?? (blogPosts.find((p) => p.slug === slug) as any);

    if (!post) notFound();

    const wordCount = post.content ? post.content.split(/\s+/).length : 0;
    const readingTime = wordCount ? `${Math.ceil(wordCount / 200)} min read` : "Short read";
    const publishDate = new Date(post.publishDate);

    return (
        <article className="pt-32 pb-24 px-6">
            {/* SEO: Article schema + Breadcrumb for Google */}
            <ArticleSchema
                title={post.title}
                excerpt={post.excerpt || ""}
                slug={post.slug}
                publishDate={post.publishDate}
                featuredImage={post.featuredImage}
                tags={post.tags}
                author={post.author}
            />
            <BreadcrumbSchema items={[
                { name: "Home", url: "https://dineshkoyyalamudi.com" },
                { name: "Blog", url: "https://dineshkoyyalamudi.com/blog" },
                { name: post.title, url: `https://dineshkoyyalamudi.com/blog/${post.slug}` },
            ]} />
            <div className="max-w-3xl mx-auto">
                <Link
                    href="/blog"
                    className="inline-flex items-center text-text-muted hover:text-brand-primary transition-all mb-12 group"
                >
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Writing
                </Link>

                <div className="mb-16">
                    <div className="flex items-center space-x-3 mb-6">
                        <span className="text-xs font-semibold px-2 py-0.5 bg-brand-primary/10 text-brand-primary rounded uppercase tracking-wider">
                            {post.tags?.[0] || "Leadership"}
                        </span>
                        <span className="text-text-muted text-xs">•</span>
                        <div className="flex items-center text-text-muted text-xs uppercase tracking-widest font-mono">
                            <Clock size={14} className="mr-1.5" />
                            {readingTime}
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-display leading-[1.1] text-white mb-10 tracking-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center justify-between py-10 border-y border-white/5">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-display text-xl border border-brand-primary/20">
                                DK
                            </div>
                            <div>
                                <p className="text-white font-medium">Dinesh Koyyalamudi</p>
                                <p className="text-text-muted text-xs uppercase tracking-widest font-mono">
                                    {format(publishDate, "MMMM d, yyyy")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                                <Twitter size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                                <Linkedin size={18} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                <BlogContentWrapper content={post.content} />

                <div className="mt-20 p-12 glass-card text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] -z-10" />
                    <h3 className="text-2xl md:text-3xl font-display mb-4">The Founder's Pulse</h3>
                    <p className="text-text-secondary mb-8 max-w-sm mx-auto">
                        Subscribe for weekly newsletters on vision, leadership and innovation.
                    </p>
                    <Link href="/subscribe" className="btn-premium px-10">
                        Join the Pulse
                    </Link>
                </div>
            </div>
        </article>
    );
}
