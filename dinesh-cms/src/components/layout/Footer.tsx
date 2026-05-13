"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Twitter, Linkedin, Instagram, Youtube, Facebook, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { settingsService } from "@/lib/firebase-services";
import type { SiteSettings } from "@/lib/types";

// ── Fallback defaults (used until Firestore data loads) ───────────────────────
const DEFAULTS = {
  socialLinks: { linkedin: "", twitter: "", instagram: "", youtube: "", facebook: "" },
  footerCopyright: `© ${new Date().getFullYear()} Dinesh Koyyalamudi. All rights reserved.`,
  footerTagline: "Built with intention. Shared with purpose.",
  footerEmail: "dinesh@foursix46.com",
  footerLocation: "Global Base",
  footerQuote: "The best companies are built not just on ideas, but on conviction.",
  navItems: [
    { label: "About", url: "/about", order: 1 },
    { label: "Blog", url: "/blog", order: 2 },
    { label: "Press", url: "/press", order: 3 },
    { label: "Gallery", url: "/gallery", order: 4 },
    { label: "FAQs", url: "/faq", order: 5 },
    { label: "Manifesto", url: "/manifesto", order: 6 },
    { label: "Subscribe", url: "/subscribe", order: 7 },
    { label: "Contact", url: "/contact", order: 8 },
  ],
};

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  linkedin:  <Linkedin size={18} />,
  twitter:   <Twitter size={18} />,
  instagram: <Instagram size={18} />,
  youtube:   <Youtube size={18} />,
  facebook:  <Facebook size={18} />,
};

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    settingsService.get().then(data => { if (data) setSettings(data); });
  }, []);

  const social    = settings?.socialLinks    ?? DEFAULTS.socialLinks;
  const copyright = settings?.footerCopyright ?? DEFAULTS.footerCopyright;
  const tagline   = settings?.footerTagline   ?? DEFAULTS.footerTagline;
  const email     = (settings as any)?.footerEmail    ?? DEFAULTS.footerEmail;
  const location  = (settings as any)?.footerLocation ?? DEFAULTS.footerLocation;
  const quote     = (settings as any)?.footerQuote    ?? DEFAULTS.footerQuote;
  const navItems  = (settings?.navItems ?? DEFAULTS.navItems)
    .slice()
    .sort((a, b) => a.order - b.order);

  // Show only social links that have a URL, in a fixed display order
  const socialOrder = ["linkedin", "twitter", "instagram", "youtube", "facebook"] as const;
  const activeSocials = socialOrder.filter(key => !!(social as any)[key]);

  return (
    <footer className="bg-brand-dark border-t border-brand-border py-20 px-6 relative z-10 pointer-events-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-10 group">
              <div className="relative h-28 md:h-40 w-auto">
                <Image
                  src="/logo.png"
                  alt="Dinesh Koyyalamudi"
                  width={450}
                  height={160}
                  className="h-full w-auto object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-8 max-w-xs font-body">
              Founder, entrepreneur, and the mind behind FourSix46 Ventures. Building products that matter and telling stories that resonate.
            </p>
            {activeSocials.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {activeSocials.map(key => (
                  <SocialLink key={key} href={(social as any)[key]} icon={SOCIAL_ICONS[key]} />
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Navigation</h4>
            <ul className="space-y-4">
              {navItems.map(nav => (
                <FooterLink key={nav.url} href={nav.url} label={nav.label} />
              ))}
            </ul>
          </div>

          {/* Contact / Frequency */}
          <div>
            <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Frequency</h4>
            <ul className="space-y-4">
              {email && (
                <li className="flex items-start space-x-3 text-text-secondary text-sm group">
                  <Mail size={18} className="text-brand-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors cursor-pointer font-mono">{email}</a>
                </li>
              )}
              {location && (
                <li className="flex items-start space-x-3 text-text-secondary text-sm group">
                  <MapPin size={18} className="text-brand-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-mono">{location}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Intention / Quote */}
          <div>
            <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Intention</h4>
            {quote && (
              <p className="text-text-secondary text-sm mb-6 italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
            )}
            <div className="w-12 h-1 bg-brand-primary/30 rounded-full" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-[1px] bg-brand-primary animate-light-sweep-horizontal shadow-[0_0_10px_rgba(255,90,0,0.5)]" />

          <div className="flex flex-col sm:flex-row items-center gap-1 relative z-10">
            <p className="text-text-muted text-[10px] uppercase font-mono tracking-[0.2em] whitespace-nowrap">
              &copy; {new Date().getFullYear()} {copyright.replace(/^©\s*\d{4}\s*/i, "")}
            </p>
            {tagline && (
              <p className="text-text-muted text-[10px] uppercase font-mono tracking-[0.2em] whitespace-nowrap sm:before:content-['//'] sm:before:mx-2 sm:before:opacity-30">
                {tagline}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2 relative z-10">
            <Link href="/privacy"    className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-[0.15em] transition-colors whitespace-nowrap">Privacy</Link>
            <Link href="/terms"      className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-[0.15em] transition-colors whitespace-nowrap">Terms of Use</Link>
            <Link href="/cookies"    className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-[0.15em] transition-colors whitespace-nowrap">Cookie Policy</Link>
            <Link href="/sitemap.xml" className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-[0.15em] transition-colors whitespace-nowrap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.2, rotate: 5, boxShadow: "0 0 15px rgba(255, 90, 0, 0.3)", borderColor: "rgba(255, 90, 0, 0.4)" }}
      whileTap={{ scale: 0.9 }}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-brand-primary transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </motion.a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className="text-text-secondary hover:text-brand-primary text-sm transition-all flex items-center group font-medium cursor-pointer relative z-20"
      >
        <div className="h-[1px] bg-brand-primary transition-all duration-300 w-0 mr-0 group-hover:w-3 group-hover:mr-3 overflow-hidden" />
        {label}
      </Link>
    </li>
  );
}