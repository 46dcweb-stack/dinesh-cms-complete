"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";


type ManifestoBlock = {
    type?: "text" | "principle" | "quote" | "vision_grid" | "statement" | "essay";
    text?: string;
    /** Static fallback data (lib/data.ts) uses `author`; the CMS saves
     *  `authorAttr`. Both are read so either source renders. */
    author?: string;
    authorAttr?: string;
    principles?: { title: string; description: string }[];
    items?: { icon: string; title: string; text: string }[];
    isVisible?: boolean;
    sectionType?: string;
    highlightStyle?: "normal" | "emphasized";
    heading?: string;
    title?: string;
    backgroundImage?: string;
    body?: string;
    description?: string;
    pullQuote?: string;
};

export default function ManifestoContent({ blocks }: { blocks: ManifestoBlock[] }) {
    return (
        <div className="space-y-32 md:space-y-48">
            {blocks.filter((block) => block?.isVisible !== false).map((block, index) => (
                <ManifestoBlock key={index} block={block} />
            ))}
        </div>
    );
}

function ManifestoBlock({ block }: { block: ManifestoBlock }) {
    switch (block.type) {
        case "text":
        case "essay":
        case "statement":
            return (
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        className={`max-w-4xl mx-auto px-6 relative z-10 ${block.highlightStyle === "emphasized" ? "glass-card py-12" : ""}`}
                    >
                        {block.sectionType && (
                            <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] block mb-6">
                                {block.sectionType}
                            </span>
                        )}
                        <h2 className="text-3xl md:text-5xl font-display text-brand-primary mb-10 leading-tight">
                            {block.heading || block.title}
                        </h2>
                        {block.backgroundImage && (
                            <div className="relative mb-10 aspect-[16/8] overflow-hidden rounded-3xl border border-white/10">
                                <Image
                                    src={block.backgroundImage}
                                    alt={block.heading || block.title || "Manifesto visual"}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </div>
                        )}
                        <div className="space-y-8 text-lg md:text-xl text-text-secondary leading-relaxed font-light">
                            {(() => {
                                const bodyText = block.body || block.description || "";
                                const isHtml = bodyText.trimStart().startsWith("<");
                                if (isHtml) {
                                    return (
                                        <div
                                            className="prose prose-invert prose-lg max-w-none prose-p:text-text-secondary prose-headings:text-white prose-a:text-brand-primary prose-strong:text-white prose-ul:text-text-secondary prose-li:text-text-secondary"
                                            dangerouslySetInnerHTML={{ __html: bodyText }}
                                        />
                                    );
                                }
                                return bodyText.split("\n\n").filter(Boolean).map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ));
                            })()}
                        </div>
                        {block.pullQuote && (
                            <blockquote className="mt-10 border-l-2 border-brand-primary pl-6 text-white/90 text-xl leading-relaxed italic">
                                {block.pullQuote}
                            </blockquote>
                        )}
                    </motion.div>
                </div>
            );
        case "quote":
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto px-6 py-24 relative"
                >
                    <Quote className="absolute top-0 left-0 text-brand-primary/10 w-32 h-32 -translate-x-12 -translate-y-12" />
                    {block.sectionType && (
                        <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] block mb-8 text-center">
                            {block.sectionType}
                        </span>
                    )}
                    <blockquote className="text-4xl md:text-6xl font-display text-white text-center leading-[1.1] tracking-tighter">
                        <span className="text-gradient italic">&ldquo;{block.text}&rdquo;</span>
                    </blockquote>
                    {(block.authorAttr || block.author) && (
                        <div className="mt-12 text-center">
                            <div className="w-12 h-[1px] bg-brand-primary/50 mx-auto mb-6" />
                            <cite className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.5em] not-italic">
                                {block.authorAttr || block.author}
                            </cite>
                        </div>
                    )}
                </motion.div>
            );
        case "principle":
            return (
                <div className="max-w-7xl mx-auto px-6">
                    {block.sectionType && (
                        <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] block mb-6">
                            {block.sectionType}
                        </span>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {(block.principles ?? []).map((principle, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-12 border-l-2 border-brand-primary hover:bg-white/5 transition-all duration-500 group"
                            >
                                <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] block mb-6">
                                    Principle 0{i + 1}
                                </span>
                                <h3 className="text-3xl md:text-4xl font-display text-brand-primary mb-6 group-hover:scale-[1.02] transition-all duration-700">
                                    {principle.title}
                                </h3>
                                <p className="text-text-secondary text-lg leading-relaxed">
                                    {principle.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            );
        case "vision_grid":
            return (
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 text-center">
                        {block.sectionType && (
                            <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] block mb-6">
                                {block.sectionType}
                            </span>
                        )}
                        <h2 className="text-3xl md:text-5xl font-display text-brand-primary mb-6">{block.heading}</h2>
                        <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">{block.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {(block.items ?? []).map((item, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="glass-card p-8 group relative overflow-hidden flex flex-col items-center text-center hover:border-brand-primary/30 transition-all duration-300"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[40px] group-hover:bg-brand-primary/20 transition-all duration-500 -z-10" />
                                <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center text-2xl font-bold font-mono mb-6 border border-brand-primary/20 group-hover:scale-110 transition-transform duration-300">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-display text-brand-primary mb-4 tracking-tight">{item.title}</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {item.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            );
        default:
            return null;
    }
}