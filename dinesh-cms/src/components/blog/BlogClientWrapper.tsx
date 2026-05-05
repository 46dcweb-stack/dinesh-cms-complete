"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Search } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";


interface BlogClientWrapperProps {
    initialPosts: any[];
    initialFeaturedPost: any | null;
    heroData?: any;
}

export default function BlogClientWrapper({ initialPosts, initialFeaturedPost, heroData }: BlogClientWrapperProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredPosts = initialPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayPosts = searchQuery ? filteredPosts : initialPosts;
    const featuredPost = initialFeaturedPost;

    const title = heroData?.title || "DINESH JOURNAL";
    const subtitle = heroData?.subtitle || "Thought Leadership & Insights";
    const description = heroData?.description || "Exploring the intersection of venture capital, logistics, and the philosophies that drive global impact.";
    const heroImage = heroData?.heroBackground || null;
    const heroVideo = heroData?.heroVideoUrl || null;

    const titleParts = title.split(' ');
    const mainTitle = titleParts.length > 1 ? titleParts.slice(0, -1).join(' ') : title;
    const highlightedPart = titleParts.length > 1 ? titleParts.slice(-1)[0] : "";

    return (
        <>
            {/* Immersive Hero Section */}
            <section className="relative -mx-6 -mt-20 md:-mt-12 mb-20 min-h-[85vh] flex items-center overflow-hidden">
                {/* Background Video or Image */}
                <div className="absolute inset-0 z-0">
                    {heroVideo ? (
                        <video
                            key={heroVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover brightness-75 contrast-125"
                        >
                            <source src={heroVideo} />
                            Your browser does not support the video tag.
                        </video>
                    ) : heroImage ? (
                        <Image
                            src={heroImage}
                            alt={title}
                            fill
                            priority
                            className="object-cover brightness-75 contrast-125"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-zinc-900 to-brand-dark" />
                    )}
                    {/* Multi-stage overlays for depth */}
                    <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
                </div>

                <div className="max-w-7xl mx-auto w-full relative z-10 px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-16">
                    {/* Left side: Main Typography */}
                    <div className="flex-1 text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-brand-primary font-bold tracking-[0.3em] text-xs uppercase block mb-6 px-1 border-l-2 border-brand-primary">
                                {subtitle}
                            </span>
                            <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-medium text-white leading-[0.85] tracking-tighter mb-10">
                                {mainTitle} <br />
                                <span className="italic text-brand-primary/90">{highlightedPart}</span>
                            </h1>
                            <p className="max-w-xl text-zinc-300 text-xl md:text-2xl leading-relaxed mb-12">
                                {description}
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <Link href="#articles" className="btn-premium px-10 py-5 text-lg shadow-[0_0_30px_rgba(var(--brand-primary-rgb),0.3)]">
                                    Browse All Articles
                                </Link>
                                <div className="relative group min-w-[300px] flex items-center">
                                    <Search className="absolute left-6 text-white/50 group-focus-within:text-brand-primary transition-colors" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search journal..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-full pl-14 pr-8 py-5 text-white placeholder:text-white/40 focus:outline-none focus:border-brand-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right side: Featured Preview Card (Reference style) */}
                    {!searchQuery && featuredPost && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: 50 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="hidden lg:block w-full max-w-md"
                        >
                            <Link href={`/blog/${featuredPost.slug}`} className="group block relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl hover:scale-[1.02] transition-transform duration-500">
                                {featuredPost.featuredImage ? (
                                    <img src={featuredPost.featuredImage} alt={featuredPost.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-black" />
                                )}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black via-black/80 to-transparent">
                                    <span className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-4 block">
                                        Latest Article
                                    </span>
                                    <h3 className="text-3xl font-display text-white mb-6 leading-tight group-hover:text-brand-primary transition-colors">
                                        {featuredPost.title}
                                    </h3>
                                    <div className="flex items-center text-white/60 text-sm font-mono tracking-tighter">
                                        <span>WATCH PREVIEW</span>
                                        <div className="ml-4 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/10 group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Bottom Blur Decorator */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
            </section>

            <div id="articles" />

            {/* Post List (Vertical) */}
            <div className="flex flex-col space-y-12">
                {displayPosts.map((post, index) => (
                    <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr] gap-8 md:gap-16 items-center">
                            <div className="aspect-[16/10] md:aspect-[4/3] bg-brand-muted/50 rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-brand-primary/30 transition-all duration-500">
                                {post.featuredImage ? (
                                    <img src={post.featuredImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent group-hover:scale-105 transition-transform duration-700" />
                                )}
                                <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition-colors duration-500" />
                            </div>

                            <div className="flex flex-col h-full py-4">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="text-xs font-semibold text-brand-primary uppercase tracking-widest">{post.tags?.[0] || 'Leadership'}</span>
                                    <span className="text-text-muted text-[10px]">•</span>
                                  <span className="text-text-muted text-xs uppercase tracking-widest font-mono">
    {(() => {
        const raw: any = post.publishDate;

        if (!raw) return "Recent";

        // Firestore Timestamp (safe check)
        if (raw && typeof raw === "object" && "toDate" in raw) {
            try {
                return format((raw as any).toDate(), "MMM d, yyyy");
            } catch {
                return "Recent";
            }
        }

        // string / number
        const parsed = new Date(raw);
        return isNaN(parsed.getTime()) ? "Recent" : format(parsed, "MMM d, yyyy");
    })()}
</span>
                                </div>
                                <h3 className="text-3xl md:text-5xl font-display group-hover:text-brand-primary transition-colors leading-tight mb-6">
                                    {post.title}
                                </h3>
                                <p className="text-text-secondary text-lg leading-relaxed line-clamp-3 mb-8">
                                    {post.excerpt}
                                </p>
                                <div className="mt-auto">
                                    <span className="text-brand-primary font-semibold flex items-center group-hover:translate-x-2 transition-transform">
                                        Read Article <Search className="ml-2 rotate-[-45deg]" size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>


            {displayPosts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-white/40 text-xl">No articles found matching your search.</p>
                </div>
            )}
        </>
    );
}
