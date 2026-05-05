// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// export default function Preloader() {
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setLoading(false);
//         }, 2000);
//         return () => clearTimeout(timer);
//     }, []);
//     return (
//         <AnimatePresence>
//             {loading && (
//                 <motion.div
//                     initial={{ opacity: 1 }}
//                     exit={{
//                         opacity: 0,
//                         transition: { duration: 0.8, ease: "easeInOut" }
//                     }}
//                     className="fixed inset-0 z-[100] bg-brand-rich-black flex flex-col items-center justify-center overflow-hidden"
//                 >
//                     {/* Grain Overlay */}
//                     <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

//                     <div className="relative">
//                         {/* Logo / Initials */}
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             transition={{ duration: 0.8 }}
//                             className="mb-8 text-center"
//                         >
//                             <span className="text-5xl md:text-7xl font-display font-bold tracking-widest text-text-primary">
//                                 D<span className="text-brand-blue">K</span>
//                             </span>
//                         </motion.div>

//                         {/* Progress Bar Container */}
//                         <div className="w-64 h-[2px] bg-brand-border relative overflow-hidden">
//                             <motion.div
//                                 initial={{ x: "-100%" }}
//                                 animate={{ x: "0%" }}
//                                 transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
//                                 className="absolute inset-0 bg-brand-blue"
//                             />
//                         </div>

//                         {/* Animated Text */}
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: 0.8 }}
//                             className="mt-8 text-center"
//                         >
//                             <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-text-secondary">
//                                 Booting Visionary Interface
//                             </span>
//                         </motion.div>
//                     </div>

//                     {/* Decorative Background Elements */}
//                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -z-10" />
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// }
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "dk_preloader_seen_v1";

export default function Preloader() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show once per session to avoid repeatedly delaying LCP.
    const seen = sessionStorage.getItem(SESSION_KEY) === "1";
    if (seen) return;

    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(true);

    // Keep it short; long preloaders destroy Lighthouse.
    const t = window.setTimeout(
      () => setOpen(false),
      prefersReducedMotion ? 0 : 700,
    );
    return () => window.clearTimeout(t);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!open) return;

    // Prevent scroll jumps while overlay is visible.
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: prefersReducedMotion ? 0 : 0.35,
              ease: "easeOut",
            },
          }}
          className="fixed inset-0 z-[100] bg-brand-rich-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Optional: consider self-hosting this noise SVG to avoid extra network dependency. */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          <div className="relative">
            <motion.div
              initial={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.98 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
              className="mb-8 text-center"
            >
              <span className="text-5xl md:text-7xl font-display font-bold tracking-widest text-text-primary">
                D<span className="text-brand-blue">K</span>
              </span>
            </motion.div>

            <div className="w-64 h-[2px] bg-brand-border relative overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.6,
                  ease: [0.65, 0, 0.35, 1],
                }}
                className="absolute inset-0 bg-brand-blue"
                style={{ willChange: "transform" }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReducedMotion ? 0 : 0.15 }}
              className="mt-8 text-center"
            >
              <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-text-secondary">
                Booting Visionary Interface
              </span>
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[120px] -z-10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
