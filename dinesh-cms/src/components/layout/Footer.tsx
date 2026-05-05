"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Twitter, Linkedin, Instagram, Youtube, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
    const pathname = usePathname();
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
                        <div className="flex space-x-4">
                            <SocialLink href="https://linkedin.com/in/dinesh" icon={<Linkedin size={18} />} />
                            <SocialLink href="https://x.com/dinesh" icon={<Twitter size={18} />} />
                            <SocialLink href="https://instagram.com/dinesh" icon={<Instagram size={18} />} />
                            <SocialLink href="https://youtube.com/@dinesh" icon={<Youtube size={18} />} />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Navigation</h4>
                        <ul className="space-y-4">
                            <FooterLink href="/about" label="Read My Story" />
                            <FooterLink href="/blog" label="The Journal" />
                            <FooterLink href="/gallery" label="Visual Gallery" />
                            <FooterLink href="/faq" label="FAQ Protocol" />
                            <FooterLink href="/manifesto" label="My Manifesto" />
                            <FooterLink href="/subscribe" label="Subscribe" />
                            <FooterLink href="/contact" label="Get in Touch" />
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Frequency</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3 text-text-secondary text-sm group">
                                <Mail size={18} className="text-brand-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="hover:text-white transition-colors cursor-pointer font-mono">dinesh@foursix46.com</span>
                            </li>
                            <li className="flex items-start space-x-3 text-text-secondary text-sm group">
                                <MapPin size={18} className="text-brand-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="font-mono">Global Base</span>
                            </li>
                        </ul>
                    </div>

                    {/* Vision Tagline */}
                    <div>
                        <h4 className="text-white font-display text-xl mb-8 uppercase tracking-widest text-[10px] font-bold opacity-40 italic">Intention</h4>
                        <p className="text-text-secondary text-sm mb-6 italic leading-relaxed">
                            "The best companies are built not just on ideas, but on conviction."
                        </p>
                        <div className="w-12 h-1 bg-brand-primary/30 rounded-full" />
                    </div>
                </div>

                {/* Bottom Bar with Light Sweep */}
                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-20 h-[1px] bg-brand-primary animate-light-sweep-horizontal shadow-[0_0_10px_rgba(255,90,0,0.5)]" />

                    <p className="text-text-muted text-[10px] uppercase font-mono tracking-[0.3em] relative z-10">
                        &copy; {new Date().getFullYear()} Dinesh Koyyalamudi. // Built with intention. Shared with purpose.
                    </p>
                    <div className="flex space-x-8 relative z-10">
                        <Link href="/privacy" className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-widest transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-widest transition-colors">Terms of Use</Link>
                        <Link href="/cookies" className="text-text-muted hover:text-brand-primary text-[10px] uppercase font-mono tracking-widest transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string, icon: React.ReactNode }) {
    return (
        <motion.a
            href={href}
            whileHover={{
                scale: 1.2,
                rotate: 5,
                boxShadow: "0 0 15px rgba(255, 90, 0, 0.3)",
                borderColor: "rgba(255, 90, 0, 0.4)"
            }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted hover:text-brand-primary transition-all duration-300"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </motion.a>
    );
}

function FooterLink({ href, label }: { href: string, label: string }) {
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

