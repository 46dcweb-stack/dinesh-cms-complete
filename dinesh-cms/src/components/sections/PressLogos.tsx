"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const STATIC_LOGOS = [
  { name: "TechCrunch", color: "hover:text-[#02d200]", svg: (<svg viewBox="0 0 178 32" className="h-6 md:h-7 w-auto fill-current"><path d="M0 0h31.9v6.5H0V0zm12.7 6.5h6.5v25.4h-6.5V6.5zm40 0V0h-19.1v6.5H40v25.4h6.5V6.5h6.2zM78.6 18.5V14h-6.2v6.2c0 3.3 1.8 5.1 5.1 5.1h1.1v6.2h-1.1c-6.8 0-11.7-4.1-11.7-11.3V5c0-3.3 1.8-5 5.1-5h12.8v6.5H72.4v5.4h6.2v6.6zm31.3-12V0H90.8v6.5H97v25.4h6.5V6.5h6.4z"/></svg>) },
  { name: "Forbes", color: "hover:text-white", svg: (<svg viewBox="0 0 117 30" className="h-6 md:h-8 w-auto fill-current"><path d="M12.33 0H0v28.84h4.4v-11.0h6.14c4.68 0 8.08-2.65 8.08-8.9 0-6.16-3.4-8.94-6.29-8.94zm-1.03 13.1h-6.9v-8.63h6.9c2.16 0 3.1 1.05 3.1 4.3 0 3.23-.94 4.33-3.1 4.33z"/></svg>) },
  { name: "Wired", color: "hover:text-[#ff0000]", svg: (<svg viewBox="0 0 125 50" className="h-7 md:h-9 w-auto fill-current"><path d="M105.375 14.875v17.25h8.5c2.375 0 3.75-.375 4.75-1.25 1.25-1.125 1.875-3.125 1.875-7.375s-.625-6.25-1.875-7.375c-1-.875-2.375-1.25-4.75-1.25z"/></svg>) },
];

interface PressItem { outlet?: string; outletLogo?: string; url?: string; featured?: boolean; }

export default function PressLogos({ items = [] }: { items?: PressItem[] }) {
  // Use Firebase items that have a logo, else fall back to static SVGs
  const firebaseLogos = items.filter(i => i.outletLogo);

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
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {firebaseLogos.length > 0 ? (
            firebaseLogos.map((item, i) => (
              <motion.a
                key={i}
                href={item.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative h-8 w-28 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
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
                className={`text-white/20 transition-all duration-500 ${logo.color}`}
              >
                {logo.svg}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
