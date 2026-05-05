"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
    id?: string;
    src?: string;
    imageUrl?: string; // Firebase Storage field name fallback
    title: string;
    category?: string;
    span?: string;
    updatedAt?: string;
}

const getCacheBustedSrc = (image: GalleryImage): string => {
    // Firebase often stores as imageUrl, fall back to src
    const url = image.src || image.imageUrl || "";
    if (!url) return "";
    const cacheKey = image.updatedAt || image.id || "";
    if (!cacheKey) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}v=${cacheKey}`;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[250px]">
            {images.map((image, idx) => {
                const src = getCacheBustedSrc(image);
                if (!src) return null;

                return (
                    <motion.div
                        key={image.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative group overflow-hidden rounded-3xl border border-white/5 glass-card ${image.span ?? ""}`}
                    >
                        <Image
                            src={src}
                            alt={image.title}
                            fill
                            className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                            <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.2em] block mb-2">
                                {image.category}
                            </span>
                            <h3 className="text-2xl font-display text-white italic">
                                {image.title}
                            </h3>
                        </div>
                        <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-colors duration-700" />
                    </motion.div>
                );
            })}
        </div>
    );
}