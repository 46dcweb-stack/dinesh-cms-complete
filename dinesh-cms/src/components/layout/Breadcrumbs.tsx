"use client";

import { motion } from "framer-motion";
import { ChevronRight, Home, Globe, Layout } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumbs() {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);

    // Hide breadcrumbs on home and press pages (since press has a full-bleed hero)
    if (pathname === "/" || pathname === "/press") return null;

    return (
        <nav className="flex items-center space-x-2 px-6 py-4 text-xs font-mono text-text-secondary border-b border-brand-border bg-brand-dark/50 backdrop-blur-sm sticky top-0 z-40 lg:top-0">
            <Link href="/" className="hover:text-brand-blue flex items-center transition-colors">
                <Home size={14} className="mr-1.5" />
                workstation
            </Link>

            {paths.map((path, index) => (
                <div key={path} className="flex items-center space-x-2">
                    <ChevronRight size={12} className="text-brand-border" />
                    <Link
                        href={`/${paths.slice(0, index + 1).join("/")}`}
                        className={cn(
                            "hover:text-brand-blue transition-colors capitalize",
                            index === paths.length - 1 ? "text-text-primary font-medium" : ""
                        )}
                    >
                        {path.replace(/-/g, " ")}
                    </Link>
                </div>
            ))}

            <div className="ml-auto flex items-center space-x-4 opacity-40">
                <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                    <span>Synced</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <Globe size={12} />
                    <span>Main Context</span>
                </div>
            </div>
        </nav>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
