"use client";

import { motion } from "framer-motion";
import { ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";


interface PressClientWrapperProps {
    mentions: any[];
}

export default function PressClientWrapper({ mentions }: PressClientWrapperProps) {
    return (
        <div className="grid grid-cols-1 gap-6">
            {mentions.map((item, index) => (
                <motion.a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-10 glass-card relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-[40px] -z-10" />

                    <div className="mb-6 md:mb-0 relative z-10 flex-1">
                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-[10px] font-mono font-bold px-3 py-1 bg-brand-primary/10 text-brand-primary rounded uppercase tracking-wider border border-brand-primary/20">
                                {item.mediaType || (item.featured ? "Featured Mention" : "Press Mention")}
                            </span>
                            <span className="text-text-muted text-[10px] uppercase tracking-[0.2em] font-mono">
                                {typeof item.date === "number" ? format(new Date(item.date), "MMM yyyy") : "Recent"}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mb-4">
                            {item.outletLogo && (
                                <div className="relative h-10 w-24 overflow-hidden rounded-lg bg-white/5 border border-white/5">
                                    <Image
                                        src={item.outletLogo}
                                        alt={item.outlet}
                                        fill
                                        className="object-contain p-2"
                                    />
                                </div>
                            )}
                            <p className="text-text-muted font-mono uppercase tracking-widest text-xs">{item.outlet}</p>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display text-white group-hover:text-brand-primary transition-colors duration-500 leading-tight">
                            {item.title}
                        </h3>
                        <p className="text-text-secondary mt-4 max-w-3xl">{item.description}</p>
                        {item.pullQuote && (
                            <blockquote className="mt-5 border-l-2 border-brand-primary/40 pl-4 italic text-white/85">
                                {item.pullQuote}
                            </blockquote>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-3">
                      {item.downloadableAsset && (
                        <a
                          href={item.downloadableAsset}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider text-brand-primary border border-brand-primary/30 rounded-full hover:bg-brand-primary/10 transition-colors whitespace-nowrap"
                        >
                          <Download size={12} />
                          Download Asset
                        </a>
                      )}
                      <div className="w-14 h-14 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-text-muted group-hover:border-brand-primary group-hover:text-brand-primary group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        <ExternalLink size={24} />
                      </div>
                    </div>
                </motion.a>
            ))}
            {mentions.length === 0 && (
                <div className="text-center py-24 glass-card">
                    <p className="text-text-muted text-xl font-display italic">More strategic mentions propagating soon.</p>
                </div>
            )}

        </div>
    );
}
