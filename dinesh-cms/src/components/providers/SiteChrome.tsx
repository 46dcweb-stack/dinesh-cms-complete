"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    useEffect(() => {
        if (typeof window === "undefined") return;
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (isAdmin) return;

        // Ensure each route starts from top on user-facing pages.
        const resetToTop = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        };

        // Run now and again on next frame / shortly after render.
        resetToTop();
        const raf = window.requestAnimationFrame(resetToTop);
        const timer = window.setTimeout(resetToTop, 80);

        return () => {
            window.cancelAnimationFrame(raf);
            window.clearTimeout(timer);
        };
    }, [pathname, isAdmin]);

    if (isAdmin) {
        // Admin pages: no navbar, no footer, no scroll-to-top
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <ScrollToTop />
        </>
    );
}
