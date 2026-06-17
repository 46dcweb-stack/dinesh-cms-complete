import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-dark text-white">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(255,90,0,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />

      <div className="text-center max-w-xl">
        <span className="text-brand-primary font-mono text-xs uppercase tracking-[0.4em] block mb-6">
          Error 404
        </span>

        <h1 className="text-[120px] md:text-[180px] font-display font-bold leading-none text-white/5 select-none mb-2">
          404
        </h1>

        <h2 className="text-3xl md:text-5xl font-display leading-tight mb-6 -mt-8 relative z-10">
          Page Not <span className="text-gradient italic">Found.</span>
        </h2>

        <p className="text-text-secondary text-base md:text-lg leading-relaxed mb-10">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="btn-premium px-10 py-4 inline-flex items-center gap-2"
          >
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="px-10 py-4 rounded-full border border-white/10 text-white/60 hover:border-brand-primary/40 hover:text-white transition-all duration-300 text-sm font-medium"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
