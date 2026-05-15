"use client";

interface PersonalIntroData {
  quote?: string;
  body?: string;
  linkText?: string;
  linkUrl?: string;
}


import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";



export default function PersonalIntro({ data }: { data?: PersonalIntroData }) {
    const quote = data?.quote || "I didn't start with a roadmap. I started with a question — what if? This site is where I share the lessons, the failures, the wins, and everything in between.";
    const words = quote.split(" ");

    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden bg-brand-muted/20">
            <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row gap-12 items-center text-center md:text-left">
                {/* Light Sweep Line */}
                <div className="hidden md:block w-[1px] h-64 bg-white/10 relative overflow-hidden flex-shrink-0">
                    <div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-transparent via-brand-primary to-transparent animate-light-sweep" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-grow"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 text-brand-primary text-[10px] md:text-xs font-mono uppercase tracking-widest mb-8 md:mb-10">
                        The Founder
                    </div>

                    <h2 className="text-2xl md:text-5xl font-display leading-tight mb-8 md:mb-12 text-white">
                        {words.map((word: string, i: number) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.05,
                                    delay: i * 0.03,
                                    ease: "linear"
                                }}
                                className={`inline-block mr-[0.2em] ${word.toLowerCase() === "what" || word.toLowerCase() === "if?" ? "text-gradient italic" : ""
                                    }`}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </h2>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="text-text-secondary text-lg md:text-xl mb-12 leading-relaxed max-w-3xl"
                    >
                        {(() => {
                            const body = data?.body || "If you're building something meaningful, you're in the right place. I believe in the power of intention, the logic of systems, and the fire of purpose.";
                            const isHtml = body.trimStart().startsWith("<");
                            if (isHtml) return (
                                <div className="prose prose-invert prose-lg max-w-none prose-p:text-text-secondary prose-strong:text-white prose-a:text-brand-primary"
                                    dangerouslySetInnerHTML={{ __html: body }} />
                            );
                            return <p>{body}</p>;
                        })()}
                    </motion.div>

                    <Link href={data?.linkUrl || "/about"} className="inline-flex items-center text-brand-primary font-display text-lg group">
                        {data?.linkText || "Learn More About Me"}
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                </motion.div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(255,90,0,0.05)_0%,transparent_60%)] rounded-full -z-10 pointer-events-none" />
        </section>
    );
}
