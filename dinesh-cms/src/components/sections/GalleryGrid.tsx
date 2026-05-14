"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface GalleryImage {
  id?: string; src?: string; imageUrl?: string;
  title: string; category?: string; span?: string; updatedAt?: string;
}

const getUrl = (img: GalleryImage): string => {
  const url = img.src || img.imageUrl || "";
  if (!url) return "";
  const key = img.updatedAt || img.id || "";
  if (!key) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${key}`;
};

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const validImages = images.filter(img => getUrl(img));

  const open  = (idx: number) => setLightboxIdx(idx);
  const close = useCallback(() => setLightboxIdx(null), []);
  const prev  = useCallback(() => setLightboxIdx(i => i !== null ? (i - 1 + validImages.length) % validImages.length : null), [validImages.length]);
  const next  = useCallback(() => setLightboxIdx(i => i !== null ? (i + 1) % validImages.length : null), [validImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   prev();
      if (e.key === "ArrowRight")  next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, close, prev, next]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  const active = lightboxIdx !== null ? validImages[lightboxIdx] : null;

  return (
    <>
      {/* ── Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[250px]">
        {images.map((image, idx) => {
          const src = getUrl(image);
          if (!src) return null;
          const validIdx = validImages.findIndex(v => v === image);
          return (
            <motion.div
              key={image.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => open(validIdx)}
              className={`relative group overflow-hidden rounded-3xl border border-white/5 glass-card cursor-zoom-in ${image.span ?? ""}`}
            >
              <Image
                src={src} alt={image.title} fill
                className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-700 ease-out"
              />
              {/* Hover overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 bg-linear-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.2em] block mb-2">{image.category}</span>
                <h3 className="text-2xl font-display text-white italic">{image.title}</h3>
              </div>
              {/* Zoom icon */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 border border-white/10">
                  <ZoomIn size={14} className="text-white" />
                </div>
              </div>
              <div className="absolute inset-0 bg-brand-primary/5 group-hover:bg-transparent transition-colors duration-700" />
            </motion.div>
          );
        })}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {active && lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md"
            onClick={close}
          >
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-6 right-6 z-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-3 transition-colors"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute top-6 left-6 z-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2">
              <span className="text-white/60 font-mono text-xs">{lightboxIdx + 1} / {validImages.length}</span>
            </div>

            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation(); prev(); }}
              className="absolute left-4 md:left-8 z-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-3 transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-5xl mx-16 md:mx-24 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
            >
              <Image
                src={getUrl(active)} alt={active.title} fill
                className="object-contain"
                sizes="(max-width: 768px) 90vw, 80vw"
                priority
              />
            </motion.div>

            {/* Caption */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
              {active.category && (
                <span className="text-brand-primary font-mono text-[10px] uppercase tracking-[0.3em] block mb-1">
                  {active.category}
                </span>
              )}
              {active.title && (
                <h3 className="text-white text-xl font-display italic">{active.title}</h3>
              )}
            </div>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation(); next(); }}
              className="absolute right-4 md:right-8 z-10 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full p-3 transition-colors"
            >
              <ChevronRight size={24} className="text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}