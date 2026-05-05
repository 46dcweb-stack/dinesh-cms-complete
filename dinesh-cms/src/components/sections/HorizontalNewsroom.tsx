"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

export default function HorizontalNewsroom({ posts }: { posts: Post[] }) {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    // Translate from 0% to -70% across the 300vh scroll space
    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-70%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-brand-dark/20">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="absolute top-10 md:top-20 left-0 w-full md:w-auto md:left-20 max-w-2xl px-6 text-center md:text-left z-20">
                    <span className="text-brand-primary font-medium tracking-[0.2em] text-[10px] md:text-xs uppercase block mb-4 font-mono">Thought Pulse</span>
                    <h2 className="text-3xl md:text-6xl font-display text-white leading-tight">
                        What's On My <span className="text-gradient italic">Mind</span>
                    </h2>
                </div>

                <motion.div style={{ x }} className="flex gap-6 md:gap-8 px-6 md:px-20 mt-16 md:mt-20">
                    {posts.map((post, index) => (
                        <Card key={post.id} post={post} index={index} />
                    ))}

                    {/* View All Card at the end */}
                    <Link
                        href="/blog"
                        className="flex-shrink-0 w-[280px] md:w-[450px] aspect-[16/10] flex flex-col items-center justify-center border border-white/5 bg-brand-primary/5 rounded-3xl hover:bg-brand-primary/10 transition-all group"
                    >
                        <span className="text-brand-primary font-semibold flex items-center group-hover:translate-x-2 transition-transform text-lg md:text-xl">
                            Read All Posts <ArrowRight className="ml-2" size={24} />
                        </span>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}

function Card({ post, index }: { post: Post; index: number }) {
    return (
        <motion.div
            className="flex-shrink-0 w-[280px] md:w-[450px] group flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                <div className="aspect-[16/10] bg-brand-dark rounded-3xl mb-8 overflow-hidden relative border border-white/5 group-hover:border-brand-primary/30 transition-all duration-500">
                    {post.featuredImage ? (
                        <motion.img
                            src={post.featuredImage}
                            alt={post.title}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-brand-primary/20 to-transparent" />
                    )}
                    <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500" />
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

                <h3 className="text-2xl md:text-3xl font-display group-hover:text-brand-primary transition-colors leading-tight mb-4 text-white">
                    {post.title}
                </h3>
            </Link>
        </motion.div>
    );
}
