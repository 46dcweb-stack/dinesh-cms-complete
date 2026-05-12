"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

interface PressClientWrapperProps {
  mentions: any[];
}

function formatDate(raw: any): string {
  if (!raw) return "Recent";
  if (typeof raw === "number") return format(new Date(raw), "MMM yyyy");
  if (raw && typeof raw === "object" && "toDate" in raw) {
    try { return format(raw.toDate(), "MMM yyyy"); } catch { return "Recent"; }
  }
  const parsed = new Date(raw);
  return isNaN(parsed.getTime()) ? "Recent" : format(parsed, "MMM yyyy");
}

export default function PressClientWrapper({ mentions }: PressClientWrapperProps) {
  if (mentions.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-white/30 text-lg font-mono">No press mentions yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {mentions.map((item, index) => (
        <motion.a
          key={item.id}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.07 }}
          className="group flex flex-col md:flex-row gap-0 rounded-3xl border border-white/10 bg-zinc-900/60 hover:border-brand-primary/40 hover:bg-zinc-900/90 transition-all duration-400 overflow-hidden"
        >
          {/* Left — thumbnail first, outletLogo as fallback, then text */}
          <div className="relative w-full md:w-[280px] lg:w-[320px] shrink-0 aspect-[16/10] md:aspect-auto md:min-h-[200px] bg-zinc-800/60">
            {item.thumbnail ? (
              <>
                <Image
                  src={item.thumbnail}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
              </>
            ) : item.outletLogo ? (
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <Image
                  src={item.outletLogo}
                  alt={item.outlet || item.title}
                  fill
                  className="object-contain p-10 opacity-30"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-zinc-800 to-zinc-900 flex items-center justify-center p-8">
                {item.outlet && (
                  <span className="text-white/20 font-display text-2xl font-bold text-center leading-tight">
                    {item.outlet}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Right — Content */}
          <div className="flex flex-col justify-between flex-1 p-7 md:p-9">
            <div>
              {/* Meta row */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {(item.mediaType || item.featured) && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                    {item.mediaType || (item.featured ? "Featured" : "Press")}
                  </span>
                )}
                {item.outlet && (
                  <span className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
                    {item.outlet}
                  </span>
                )}
                <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                  {formatDate(item.date)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-display text-white leading-snug mb-4 group-hover:text-brand-primary transition-colors duration-300">
                {item.title}
              </h2>

              {/* Description */}
              {item.description && (
                <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              )}

              {/* Pull quote */}
              {item.pullQuote && (
                <blockquote className="mt-4 border-l-2 border-brand-primary/40 pl-4 italic text-white/70 text-sm line-clamp-2">
                  {item.pullQuote}
                </blockquote>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
              {item.downloadableAsset && (
                <a
                  href={`/api/download-media-kit?url=${encodeURIComponent(item.downloadableAsset)}`}
                  download
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/40 hover:text-brand-primary transition-colors"
                >
                  <Download size={12} />
                  Download Asset
                </a>
              )}
              <span className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary group-hover:gap-3 transition-all duration-300">
                Read Article
                <span className="w-8 h-8 rounded-full border border-brand-primary/40 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                  <ArrowUpRight size={14} className="text-brand-primary group-hover:text-white transition-colors duration-300" />
                </span>
              </span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}