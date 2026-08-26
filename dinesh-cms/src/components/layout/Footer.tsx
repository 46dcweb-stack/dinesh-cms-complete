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
  footerEmail: "dinesh@46dc.com",
  footerLocation: "London, UK",
  footerQuote: "Long-term is the only foundation worth building on.",
  navItems: [
    { label: "About", url: "/about", order: 1 },
    { label: "Ecosystem", url: "/ecosystem", order: 2 },
    { label: "Blog", url: "/blog", order: 3 },
    { label: "Press", url: "/press", order: 4 },
    { label: "Gallery", url: "/gallery", order: 5 },
    { label: "FAQs", url: "/faq", order: 6 },
    { label: "Manifesto", url: "/manifesto", order: 7 },
    { label: "Subscribe", url: "/subscribe", order: 8 },
    { label: "Contact", url: "/contact", order: 9 },
  ],
};

const SOCIAL_LABELS: Record<string, string> = {
  linkedin:  "LinkedIn",
  twitter:   "X (Twitter)",
  instagram: "Instagram",
  youtube:   "YouTube",
  facebook:  "Facebook",
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
  const email     = (settings as any)?.footerEmail    ?? DEFAULTS.footerEmail;
  const location  = (settings as any)?.footerLocation ?? DEFAULTS.footerLocation;
  const quote     = (settings as any)?.footerQuote    ?? DEFAULTS.footerQuote;

  // Merge Firestore navItems with defaults so entries added after the last
  // Firestore save (e.g. FAQs) are always present in the footer.
  const rawNavItems = settings?.navItems ?? DEFAULTS.navItems;
  const mergedNavItems = [...rawNavItems];
  for (const defaultItem of DEFAULTS.navItems) {
    if (!mergedNavItems.some(n => n.url === defaultItem.url)) {
      mergedNavItems.push(defaultItem);
    }
  }
  const navItems = mergedNavItems.slice().sort((a, b) => a.order - b.order);
  const transmissionLabels = new Set(["Blog", "Press", "Manifesto"]);
  const primaryNavItems = navItems.filter(nav => !transmissionLabels.has(nav.label));
  const transmissionNavItems = navItems.filter(nav => transmissionLabels.has(nav.label));

  // Show only social links that have a URL, in a fixed display order
  const socialOrder = ["linkedin", "twitter", "instagram", "youtube", "facebook"] as const;
  const activeSocials = socialOrder.filter(key => !!(social as any)[key]);

  return (
    <footer className="bg-brand-dark border-t border-brand-border py-20 px-6 relative z-10 pointer-events-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">

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
              <div className="relative z-20 flex flex-nowrap gap-3">
                {activeSocials.map(key => (
                  <SocialLink key={key} href={(social as any)[key]} icon={SOCIAL_ICONS[key]} label={SOCIAL_LABELS[key]} />
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Ecosystem</h4>
            <ul className="space-y-4">
              {primaryNavItems.map(nav => (
                <FooterLink key={nav.url} href={nav.url} label={nav.label} />
              ))}
            </ul>
          </div>

          {/* Transmissions */}
          {transmissionNavItems.length > 0 && (
            <div>
              <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Transmissions</h4>
              <ul className="space-y-4">
                {transmissionNavItems.map(nav => (
                  <FooterLink key={nav.url} href={nav.url} label={nav.label} />
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          <div>
            <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Legal</h4>
            <ul className="space-y-4">
              <FooterLink href="/privacy" label="Privacy" />
              <FooterLink href="/terms" label="Terms of Use" />
              <FooterLink href="/cookies" label="Cookie Policy" />
              <FooterLink href="/sitemap" label="Sitemap" />
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
        <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-20 h-[1px] bg-brand-primary animate-light-sweep-horizontal shadow-[0_0_10px_rgba(255,90,0,0.5)]" />

          <div className="flex flex-col sm:flex-row items-center gap-1 relative z-10 justify-center">
            <p className="text-text-muted text-[10px] uppercase font-mono tracking-[0.12em] sm:tracking-[0.2em] whitespace-normal sm:whitespace-nowrap break-words text-center">
              &copy; {new Date().getFullYear()} {copyright.replace(/^©\s*\d{4}\s*/i, "")}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center space-y-2">
          <p className="text-text-secondary text-xs sm:text-sm font-mono tracking-[0.08em]">
            Designed &amp; built by <a href="https://stack46.com/" target="_blank" rel="noopener noreferrer" className="text-sm sm:text-base font-bold text-[#FFC845] hover:text-[#FFC845] hover:underline underline-offset-4 decoration-[#FFC845] transition-colors duration-300">Stack46</a> · Full-stack software agency
          </p>
          <p className="text-text-muted text-[11px] sm:text-xs uppercase font-mono tracking-[0.2em]">
            A FourSix46 venture
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.2, rotate: 5, boxShadow: "0 0 15px rgba(255, 90, 0, 0.3)", borderColor: "rgba(255, 90, 0, 0.4)" }}
      whileTap={{ scale: 0.9 }}
      className="relative z-20 w-12 h-12 min-w-12 min-h-12 aspect-square shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-brand-primary transition-all duration-300"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
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