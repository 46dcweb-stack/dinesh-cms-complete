"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Home, User, Lightbulb, FileText, Send, Newspaper, Menu, X, ChevronRight, Image as GalleryIcon } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { cn } from "@/lib/utils";

const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'About', url: '/about', icon: User },
    { name: 'Gallery', url: '/gallery', icon: GalleryIcon },
    { name: 'Blog', url: '/blog', icon: FileText },
    { name: 'Press', url: '/press', icon: Newspaper },
    { name: 'Manifesto', url: '/manifesto', icon: Lightbulb },
    { name: 'Contact', url: '/contact', icon: Send }
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Unified Top Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300 shadow-lg">
                <div className="w-full max-w-[1400px] mx-auto px-6 h-24 md:h-32 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center h-full py-3 md:py-4">
                        <div className="relative h-full w-auto min-w-[150px] md:min-w-[200px] flex items-center">
                            <Image
                                src="/logo.png"
                                alt="Dinesh Koyyalamudi"
                                width={300}
                                height={90}
                                className="h-full w-auto object-contain transition-all duration-300 group-hover:scale-105"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Mobile Toggle Button */}
                    <button
                        className="md:hidden pointer-events-auto text-white hover:text-brand-primary transition-colors p-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Desktop Responsive Tubelight Nav */}
                    <div className="hidden md:flex items-center">
                        <NavBar items={navItems} />
                    </div>
                </div>
            </header>

            {/* Full-screen Mobile Nav Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 top-0 bg-brand-dark z-40 md:hidden overflow-hidden flex flex-col justify-center px-6"
                    >
                        <div className="flex flex-col space-y-8 py-10 mt-16">
                            {navItems.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.url}
                                        className={cn(
                                            "text-4xl font-display flex items-center justify-between group",
                                            pathname === link.url ? "text-brand-primary" : "text-white/70"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <link.icon size={32} className={pathname === link.url ? "text-brand-primary" : "text-white/40"} />
                                            <span>{link.name}</span>
                                        </div>
                                        <ChevronRight size={28} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="pt-8"
                            >
                                <Link href="/contact" className="btn-premium block py-5 text-center text-lg uppercase tracking-widest font-bold">
                                    Let's Talk
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
