"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Twitter, Linkedin, Facebook, Link2, Check, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);
  const ref                 = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms = [
    {
      label: "Twitter / X",
      icon: <Twitter size={15} />,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`,
    },
    {
      label: "LinkedIn",
      icon: <Linkedin size={15} />,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encoded}&title=${encodedTitle}`,
    },
    {
      label: "Facebook",
      icon: <Facebook size={15} />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    },
    {
      label: "WhatsApp",
      icon: <MessageCircle size={15} />,
      href: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-text-muted hover:text-brand-primary hover:border-brand-primary/30 transition-all"
        aria-label="Share article"
      >
        <Share2 size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 top-12 w-52 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="px-3 pt-3 pb-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-white/30 mb-2 px-1">Share via</p>
              <div className="space-y-0.5">
                {platforms.map(p => (
                  <a
                    key={p.label}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <span className="text-brand-primary group-hover:scale-110 transition-transform">
                      {p.icon}
                    </span>
                    {p.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Divider + Copy Link */}
            <div className="border-t border-white/5 mx-3 my-1" />
            <div className="px-3 pb-3">
              <button
                onClick={copyLink}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all group"
              >
                <span className={`transition-all ${copied ? "text-green-400" : "text-brand-primary group-hover:scale-110"}`}>
                  {copied ? <Check size={15} /> : <Link2 size={15} />}
                </span>
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
