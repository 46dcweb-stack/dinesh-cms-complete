"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";

interface Post {
    id: string;
    slug: string;
    title: string;
    featuredImage?: string;
    tags?: string[];
    publishDate?: any;
}

export default function BlogSectionClient({ posts }: { posts: Post[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {posts.map((post, index) => (
                <motion.div
                    key={post.id}
                    initial={{
                        opacity: 0,
                        x: index % 2 === 0 ? -50 : 50
                    }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: [0.21, 1, 0.36, 1]
                    }}
                >
                    <Link href={`/blog/${post.slug}`} className="group flex flex-col h-full">
                        <div className="aspect-[16/10] bg-brand-dark rounded-2xl mb-8 overflow-hidden relative border border-white/5 group-hover:border-brand-primary/30 transition-all duration-500">
                            {post.featuredImage ? (
                                <motion.img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7 }}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.7 }}
                                    className="w-full h-full bg-gradient-to-br from-brand-primary/10 to-transparent"
                                />
                            )}
                            <div className="absolute inset-0 bg-brand-dark/10 group-hover:bg-transparent transition-colors duration-500" />
                        </div>

                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
                                {post.tags?.[0] || 'Leadership'}
                            </span>
                            <span className="text-text-muted text-[10px] font-mono">•</span>
                            <span className="text-text-muted text-xs uppercase tracking-widest font-mono">
                                {post.publishDate?.toDate
                                    ? format(post.publishDate.toDate(), "MMM d, yyyy")
                                    : post.publishDate
                                        ? format(new Date(post.publishDate), "MMM d, yyyy")
                                        : "Recent"}
                            </span>
                        </div>

                        <h3 className="text-2xl font-display group-hover:text-brand-primary transition-colors leading-tight mb-4 text-white relative inline-block">
                            {post.title}
                            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-primary transition-all duration-500 group-hover:w-full" />
                        </h3>
                    </Link>
                </motion.div>
            ))}

            {posts.length === 0 && (
                [1, 2, 3].map((i) => (
                    <div key={i} className="group flex flex-col h-full opacity-20">
                        <div className="aspect-[16/10] bg-white/5 rounded-2xl mb-8" />
                        <div className="h-4 w-32 bg-white/10 mb-4" />
                        <div className="h-8 w-full bg-white/10" />
                    </div>
                ))
            )}
        </div>
    );
}
