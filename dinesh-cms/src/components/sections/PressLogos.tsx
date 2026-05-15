"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const STATIC_LOGOS = [
  { name: "TechCrunch", color: "#02d200" },
  { name: "Forbes",     color: "#ffffff" },
  { name: "Wired",      color: "#ff0000" },
  { name: "Bloomberg",  color: "#ffffff" },
  { name: "Inc.",       color: "#ffffff" },
];

interface PressItem {
  outlet?: string;
  outletLogo?: string;
  url?: string;
  featured?: boolean;
  showInFeaturedBar?: boolean;
}

export default function PressLogos({ items = [] }: { items?: PressItem[] }) {
  // Show items marked for featured bar, or all items with logos as fallback
  const featuredItems = items.filter(i => i.showInFeaturedBar && i.outletLogo);
  const fallbackItems = items.filter(i => i.outletLogo);
  const displayItems  = featuredItems.length > 0 ? featuredItems : fallbackItems;

  return (
    <section className="py-16 md:py-20 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-text-secondary text-xs uppercase tracking-[0.4em] font-mono mb-12"
        >
          As Featured In
        </motion.p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {displayItems.length > 0 ? (
            displayItems.map((item, i) => (
              <motion.a
                key={i}
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative h-20 w-52 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              >
                <Image src={item.outletLogo!} alt={item.outlet || "Press"} fill className="object-contain" />
              </motion.a>
            ))
          ) : (
            STATIC_LOGOS.map((logo, i) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="text-white/20 hover:text-white/60 transition-all duration-500 text-sm font-bold uppercase tracking-widest"
              >
                {logo.name}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}