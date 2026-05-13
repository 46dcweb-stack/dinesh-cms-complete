"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Search, X } from "lucide-react";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import Image from "next/image";

interface BlogClientWrapperProps {
  initialPosts: any[];
  initialFeaturedPost: any | null;
  heroData?: any;
}

function formatDate(raw: any): string {
  if (!raw) return "Recent";
  if (raw && typeof raw === "object" && "toDate" in raw) {
    try { return format(raw.toDate(), "MMM d, yyyy"); } catch { return "Recent"; }
  }
  const parsed = new Date(raw);
  return isNaN(parsed.getTime()) ? "Recent" : format(parsed, "MMM d, yyyy");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export default function BlogClientWrapper({ initialPosts, heroData }: BlogClientWrapperProps) {
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const eyebrow       = heroData?.subtitle      || "Thought Leadership & Insights";
  const heading       = heroData?.heading       || "The";
  const headingItalic = heroData?.headingItalic || "Journal";
  const description   = heroData?.description   || "Exploring the intersection of venture capital, logistics, and the philosophies that drive global impact.";

  // Collect all unique categories across all posts
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    initialPosts.forEach(p => {
      if (Array.isArray(p.categories)) p.categories.forEach((c: string) => c && set.add(c));
    });
    return Array.from(set).sort();
  }, [initialPosts]);

  const displayPosts = useMemo(() => {
    let posts = initialPosts;
    if (activeCategory) {
      posts = posts.filter(p =>
        Array.isArray(p.categories) && p.categories.includes(activeCategory)
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q) ||
        p.categories?.some((c: string) => c.toLowerCase().includes(q))
      );
    }
    return posts;
  }, [initialPosts, activeCategory, searchQuery]);

  return (
    <div className="pt-36 pb-24">
      <div className="px-6">
        <div className="max-w-7xl mx-auto">

          {/* ── Hero Heading ──────────────────────────────────────────── */}
          <div className="max-w-3xl mb-16">
            <span className="text-brand-primary font-medium tracking-[0.3em] text-xs uppercase block mb-6 font-mono">
              {eyebrow}
            </span>
            <h1 className="text-5xl md:text-8xl font-display leading-[1.1] tracking-tight">
              {heading}{" "}
              <span className="text-gradient italic">{headingItalic}</span>
            </h1>
            {description && (
              <p className="mt-8 text-text-secondary text-lg leading-relaxed max-w-xl">
                {description}
              </p>
            )}
          </div>

          {/* ── Category Filter Bar ───────────────────────────────────── */}
          {allCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border transition-all duration-200 ${
                  !activeCategory
                    ? "bg-brand-primary border-brand-primary text-white"
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                }`}
              >
                All
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] border transition-all duration-200 ${
                    activeCategory === cat
                      ? "bg-brand-primary border-brand-primary text-white"
                      : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* ── Search ────────────────────────────────────────────────── */}
          <div className="mb-14 max-w-md">
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-10 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-primary/50 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
            {(activeCategory || searchQuery) && (
              <p className="text-white/30 text-xs font-mono mt-2 ml-1">
                {displayPosts.length} article{displayPosts.length !== 1 ? "s" : ""}
                {activeCategory ? ` in "${activeCategory}"` : ""}
                {searchQuery ? ` matching "${searchQuery}"` : ""}
              </p>
            )}
          </div>

          {/* ── Blog Cards ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {displayPosts.map((post, index) => (
              <motion.div
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.07, 0.3) }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col md:flex-row gap-0 rounded-3xl border border-white/10 bg-zinc-900/60 hover:border-brand-primary/40 hover:bg-zinc-900/90 transition-all duration-400 overflow-hidden"
                >
                  {/* Left — Image */}
                  <div className="relative w-full md:w-[320px] lg:w-[380px] shrink-0 aspect-[16/10] md:aspect-auto md:min-h-[220px]">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 380px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-zinc-800 to-zinc-900" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>

                  {/* Right — Content */}
                  <div className="flex flex-col justify-between flex-1 p-7 md:p-9">
                    <div>
                      {/* Meta row */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        {/* Show first category as pill */}
                        {post.categories?.[0] && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                            {post.categories[0]}
                          </span>
                        )}
                        {/* Fallback to tag if no category */}
                        {!post.categories?.[0] && post.tags?.[0] && (
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
                            {post.tags[0]}
                          </span>
                        )}
                        <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                          {formatDate(post.publishDate)}
                        </span>
                        {post.readTime && (
                          <>
                            <span className="text-white/20 text-[10px]">·</span>
                            <span className="text-white/30 text-[10px] font-mono uppercase tracking-widest">
                              {post.readTime} min read
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-display text-white leading-snug mb-4 group-hover:text-brand-primary transition-colors duration-300">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      {(post.excerpt || post.content) && (
                        <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
                          {post.excerpt || stripHtml(post.content || "").slice(0, 200)}
                        </p>
                      )}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                      {post.author && (
                        <span className="text-xs text-white/30 font-mono uppercase tracking-wider">
                          {post.author}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary group-hover:gap-3 transition-all duration-300">
                        Read Article
                        <span className="w-8 h-8 rounded-full border border-brand-primary/40 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all duration-300">
                          <ArrowUpRight size={14} className="text-brand-primary group-hover:text-white transition-colors duration-300" />
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {displayPosts.length === 0 && (
              <div className="text-center py-24">
                <p className="text-white/30 text-lg font-mono">No articles found.</p>
                {(activeCategory || searchQuery) && (
                  <button
                    onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
                    className="mt-4 text-brand-primary text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}